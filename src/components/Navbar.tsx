'use client';

import Link from 'next/link'
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

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
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="bg-white border-b border-gray-100 fixed w-full z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 w-1/4">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl tracking-tight">
                <span className="text-gray-900">Ktsv</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-600">Media</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative text-gray-900 hover:text-indigo-600 transition-colors duration-200 py-2 text-sm font-medium"
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Schedule button */}
          <div className="hidden sm:flex w-1/4 justify-end">
            <Link
              href="/schedule"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors duration-200"
            >
              Schedule Consultation
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden ml-auto items-center space-x-4">
            <Link
              href="/schedule"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200"
            >
              Schedule
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 hover:text-indigo-600 p-2"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-white border-t border-gray-100"
          >
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      isActive ? 'text-indigo-600' : 'text-gray-900 hover:text-indigo-600',
                      'block py-2 text-base font-medium transition-colors duration-200'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
              <Link
                href="/schedule"
                className="block w-full text-center bg-indigo-600 text-white hover:bg-indigo-700 mt-4 px-4 py-2 rounded-full font-medium transition-colors duration-200"
              >
                Schedule Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
