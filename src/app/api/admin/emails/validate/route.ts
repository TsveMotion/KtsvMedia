import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import dns from 'dns';
import { promisify } from 'util';
import net from 'net';
import { Email } from '@/types/prisma';

const resolveMx = promisify(dns.resolveMx);

interface ValidationResult {
  isValid: boolean;
  reason?: string;
  message?: string;
  emailStr: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  results?: ValidationResult[];
}

// Gmail-specific validation
function isValidGmailFormat(email: string): ValidationResult {
  // Basic Gmail format check
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  if (!gmailRegex.test(email)) {
    return { isValid: false, reason: 'Invalid Gmail format', emailStr: email };
  }

  // Gmail-specific rules
  const localPart = email.split('@')[0];
  
  // Rule 1: Length between 6-30 characters
  if (localPart.length < 6 || localPart.length > 30) {
    return { isValid: false, reason: 'Gmail username must be between 6-30 characters', emailStr: email };
  }

  // Rule 2: Must start with a letter or number
  if (!/^[a-zA-Z0-9]/.test(localPart)) {
    return { isValid: false, reason: 'Gmail username must start with a letter or number', emailStr: email };
  }

  // Rule 3: No consecutive dots
  if (localPart.includes('..')) {
    return { isValid: false, reason: 'Gmail username cannot contain consecutive dots', emailStr: email };
  }

  // Rule 4: No dots at start or end
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, reason: 'Gmail username cannot start or end with a dot', emailStr: email };
  }

  // Rule 5: Only allowed characters
  if (!/^[a-zA-Z0-9.]+$/.test(localPart)) {
    return { isValid: false, reason: 'Gmail username can only contain letters, numbers, and dots', emailStr: email };
  }

  return { isValid: true, emailStr: email };
}

// Regular email format validation
function isValidEmailFormat(email: string): ValidationResult {
  // Remove whitespace
  email = email.trim();

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, reason: 'Invalid email format', emailStr: email };
  }

  // Length check
  if (email.length > 254) {
    return { isValid: false, reason: 'Email address is too long', emailStr: email };
  }

  // Local part length check
  const localPart = email.split('@')[0];
  if (localPart.length > 64) {
    return { isValid: false, reason: 'Local part of email is too long', emailStr: email };
  }

  // Domain part checks
  const domain = email.split('@')[1];
  
  // Domain length check
  if (domain.length > 255) {
    return { isValid: false, reason: 'Domain part of email is too long', emailStr: email };
  }

  // Domain format check
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { isValid: false, reason: 'Invalid domain format', emailStr: email };
  }

  // TLD check
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return { isValid: false, reason: 'Invalid top-level domain', emailStr: email };
  }

  return { isValid: true, emailStr: email };
}

async function verifyMXRecords(domain: string): Promise<ValidationResult> {
  try {
    const mxRecords = await resolveMx(domain);
    
    if (!mxRecords || mxRecords.length === 0) {
      return { isValid: false, reason: 'No MX records found', emailStr: domain };
    }

    return { isValid: true, emailStr: domain };
  } catch (error) {
    console.error('MX record verification error:', error);
    return { isValid: false, reason: 'Failed to verify MX records', emailStr: domain };
  }
}

async function checkSMTP(email: string, domain: string): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let response = '';
    let step = 0;
    let timer: NodeJS.Timeout;

    const cleanup = () => {
      clearTimeout(timer);
      socket.destroy();
    };

    const fail = (reason: string) => {
      cleanup();
      resolve({ isValid: false, reason, emailStr: email });
    };

    socket.on('data', (data) => {
      response += data.toString();
      const code = parseInt(response.substring(0, 3));

      if (code >= 500) {
        fail('SMTP server rejected connection');
        return;
      }

      switch (step) {
        case 0:
          if (code === 220) {
            socket.write(`HELO ${domain}\r\n`);
            step = 1;
            response = '';
          }
          break;
        case 1:
          if (code === 250) {
            socket.write(`MAIL FROM:<check@${domain}>\r\n`);
            step = 2;
            response = '';
          }
          break;
        case 2:
          if (code === 250) {
            socket.write(`RCPT TO:<${email}>\r\n`);
            step = 3;
            response = '';
          }
          break;
        case 3:
          if (code === 250) {
            cleanup();
            resolve({ isValid: true, emailStr: email });
          } else {
            fail('Email address rejected by SMTP server');
          }
          break;
      }
    });

    socket.on('error', (error) => {
      console.error('SMTP check error:', error);
      fail('Failed to connect to SMTP server');
    });

    socket.on('timeout', () => {
      fail('Connection timed out');
    });

    socket.connect(25, domain);

    timer = setTimeout(() => {
      fail('Connection timed out');
    }, 10000);
  });
}

async function validateEmail(email: string): Promise<ValidationResult> {
  try {
    const [, domain] = email.split('@');
    const isGmail = domain.toLowerCase() === 'gmail.com';
    
    // Step 1: Format validation
    const formatCheck = isGmail ? isValidGmailFormat(email) : isValidEmailFormat(email);
    if (!formatCheck.isValid) {
      return formatCheck;
    }

    // Step 2: MX record check
    const mxCheck = await verifyMXRecords(domain);
    if (!mxCheck.isValid) {
      return mxCheck;
    }

    // Step 3: SMTP check (optional for Gmail)
    if (!isGmail) {
      const smtpCheck = await checkSMTP(email, domain);
      if (!smtpCheck.isValid) {
        return smtpCheck;
      }
    }

    // Save validation result to database
    await prisma.email.upsert({
      where: { email },
      update: {
        isValid: true,
        status: 'valid',
        notes: isGmail ? 'Valid Gmail address' : 'Valid email verified via SMTP'
      },
      create: {
        email,
        isValid: true,
        status: 'valid',
        notes: isGmail ? 'Valid Gmail address' : 'Valid email verified via SMTP'
      }
    });

    return {
      isValid: true,
      emailStr: email,
      reason: isGmail ? 'Valid Gmail address' : 'Valid email verified via SMTP'
    };

  } catch (error) {
    console.error('Email validation error:', error);
    return {
      isValid: false,
      emailStr: email,
      reason: 'Error during validation'
    };
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { emails } = await request.json();
    
    if (!Array.isArray(emails)) {
      const result = await validateEmail(emails);
      return NextResponse.json({
        success: result.isValid,
        results: [result]
      });
    }

    const results = await Promise.all(emails.map(validateEmail));
    return NextResponse.json({
      success: results.every(r => r.isValid),
      results: results.map(r => ({
        isValid: r.isValid,
        reason: r.reason,
        message: r.message,
        emailStr: r.emailStr
      }))
    });
  } catch (error) {
    console.error('Error validating emails:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to validate emails'
    }, { status: 500 });
  }
}
