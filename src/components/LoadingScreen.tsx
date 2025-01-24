'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Store that we've shown the loading screen
    if (!sessionStorage.getItem('loadingShown')) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('loadingShown', 'true');
      }, 2000); // 2 seconds total animation time

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="relative flex items-center">
            {/* Text Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-1"
            >
              <motion.span 
                className="text-4xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-gray-900">Ktsv</span>
              </motion.span>
              <motion.span
                className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Media
              </motion.span>
            </motion.div>

            {/* Animated Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ 
                duration: 1.5,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
