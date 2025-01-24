'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';

// Dynamically import components for better performance
const FeaturesSection = dynamic(() => import('@/components/home/FeaturesSection'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-50" />
});

const StatsSection = dynamic(() => import('@/components/home/StatsSection'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-50" />
});

const QuickSchedule = dynamic(() => import('@/components/QuickSchedule'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-50" />
});

export default function HomeClient() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative bg-white">
      {/* Progress bar */}
      <motion.div
        className="fixed top-16 left-0 right-0 h-1 bg-indigo-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Main content */}
      <div className="relative">
        <HeroSection />

        <Suspense fallback={<div className="h-screen animate-pulse bg-gray-50" />}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FeaturesSection />
          </motion.div>
        </Suspense>

        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-50" />}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <StatsSection />
          </motion.div>
        </Suspense>

        <Suspense fallback={<div className="h-screen animate-pulse bg-gray-50" />}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            id="consultation"
            className="relative z-10 bg-white"
          >
            <QuickSchedule />
          </motion.div>
        </Suspense>

        {/* Floating "Book Now" button for mobile */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden"
        >
          <a
            href="#consultation"
            className="inline-flex items-center gap-x-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Book Your Free Call
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </main>
  );
}
