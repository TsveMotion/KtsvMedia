'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(to right top, rgba(99, 102, 241, 0.2), rgba(255, 255, 255, 0.1), rgba(99, 102, 241, 0.2))',
            'linear-gradient(to left top, rgba(99, 102, 241, 0.2), rgba(255, 255, 255, 0.1), rgba(99, 102, 241, 0.2))',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Rotating circles */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: `${400 + i * 100}px`,
              height: `${400 + i * 100}px`,
              marginLeft: `-${200 + i * 50}px`,
              marginTop: `-${200 + i * 50}px`,
              border: '1px solid rgba(99, 102, 241, 0.1)',
              borderRadius: '50%',
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 5 + i * 2,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-indigo-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Moving gradient lines */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(99, 102, 241, 0.1) 0px, transparent 2px, transparent 100px)',
            backgroundSize: '100px 100px',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Glowing orb */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}
