import { motion } from 'framer-motion';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';
import BackgroundAnimation from './BackgroundAnimation';

export default function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      <BackgroundAnimation />
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center flex flex-col items-center justify-center"
      >
        {/* Small badge at top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-x-2 rounded-full bg-white/90 px-4 py-1.5 text-sm shadow-sm"
        >
          <span className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-yellow-500" />
            <span className="font-medium text-indigo-600">Free 30-min consultation</span>
          </span>
          <span className="h-1 w-1 rounded-full bg-gray-200" />
          <span className="font-medium text-gray-600">Limited time offer</span>
        </motion.div>

        {/* Main content */}
        <div className="relative">
          {/* Rotating ring around the content */}
          <motion.div
            className="absolute -inset-x-4 -inset-y-4 z-0 hidden sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 rounded-full border border-indigo-100" />
            <motion.div
              className="absolute inset-0 rounded-full border border-indigo-200/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <motion.h1
            variants={item}
            className="relative text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl antialiased"
          >
            <span className="block bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 text-transparent">
              Elevate Your Brand
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="relative mx-auto mt-6 max-w-md text-lg leading-8 text-gray-600 sm:text-xl antialiased"
          >
            Transform your digital presence with expert media solutions
          </motion.p>

          <motion.div
            variants={item}
            className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="#consultation"
                className="relative inline-flex items-center gap-x-2 rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="absolute inset-0 rounded-full bg-white/10" />
                Start Growing Now
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ x: 5 }}
              className="text-sm font-semibold leading-6 text-gray-900 antialiased cursor-pointer"
            >
              <Link href="#features">
                See how it works <span aria-hidden="true">↓</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Fixed scroll indicator at bottom */}
        <div className="fixed bottom-8 left-0 right-0 z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm"
            >
              <span className="text-sm font-medium text-gray-800">Scroll to explore</span>
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.5l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
