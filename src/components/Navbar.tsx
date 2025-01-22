'use client';

import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/ktsv-logo.svg"
                  alt="KTSV Media"
                  width={160}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </motion.div>
            </Link>
          </div>

          <div className="hidden sm:flex sm:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-900 hover:text-blue-600',
                  'px-3 py-2 text-sm font-medium'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <Link
              href="/schedule"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
