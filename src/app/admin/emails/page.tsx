'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ValidationResult {
  email: string;
  isValid: boolean;
  status: string;
  notes: string;
}

export default function EmailManager() {
  const [emails, setEmails] = useState('');
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedEmails, setSavedEmails] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEmails(content);
    };
    reader.readAsText(file);
  };

  const validateEmails = async () => {
    setLoading(true);
    try {
      const emailList = emails
        .split(/[\n,]/)
        .map(email => email.trim())
        .filter(email => email);

      const response = await fetch('/api/admin/emails/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: emailList }),
      });

      if (!response.ok) throw new Error('Validation failed');

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error validating emails:', error);
      alert('Failed to validate emails');
    } finally {
      setLoading(false);
    }
  };

  const copyValidEmails = () => {
    const validEmails = results
      .filter(result => result.isValid)
      .map(result => result.email)
      .join('\n');

    navigator.clipboard.writeText(validEmails);
    alert('Valid emails copied to clipboard!');
  };

  const saveValidEmails = async () => {
    try {
      const validEmails = results.filter(result => result.isValid);
      
      const response = await fetch('/api/admin/emails/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: validEmails }),
      });

      if (!response.ok) throw new Error('Failed to save emails');

      setSavedEmails(validEmails.map(result => result.email));
      alert('Emails saved successfully!');
    } catch (error) {
      console.error('Error saving emails:', error);
      alert('Failed to save emails');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>
          <nav className="space-y-2">
            <Link 
              href="/admin"
              className="block py-2 px-4 rounded text-white hover:bg-gray-700"
            >
              Bookings
            </Link>
            <Link 
              href="/admin/emails"
              className="block py-2 px-4 rounded bg-gray-700 text-white hover:bg-gray-600"
            >
              Email Manager
            </Link>
            <Link 
              href="/admin/email-campaigns"
              className="block py-2 px-4 rounded text-white hover:bg-gray-700"
            >
              Email Campaigns
            </Link>
            <Link 
              href="/"
              className="block py-2 px-4 rounded text-white hover:bg-gray-700"
            >
              Back to Website
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Email Validation</h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-black">
                Upload Email List (CSV/TXT)
              </label>
              <input
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-black">
                Or Paste Emails (one per line or comma-separated)
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full h-32 px-3 py-2 border rounded-lg text-black"
                placeholder="email@example.com&#10;another@example.com"
              />
            </div>

            <button
              onClick={validateEmails}
              disabled={loading || !emails}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? 'Validating...' : `Validate ${emails.split(/[\n,]/).filter(e => e.trim()).length} Emails`}
            </button>
          </div>

          {results.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">Validation Results</h2>
                <div className="space-x-2">
                  <button
                    onClick={copyValidEmails}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Copy Valid Emails
                  </button>
                  <button
                    onClick={saveValidEmails}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Valid Emails
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-black">Email</th>
                      <th className="px-4 py-2 text-left text-black">Status</th>
                      <th className="px-4 py-2 text-left text-black">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-black">{result.email}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            result.isValid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-black">{result.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
