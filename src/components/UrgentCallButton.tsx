import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone } from 'lucide-react';

export const UrgentCallButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href="tel:+79619785454"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="glass-button glass-button-urgent fixed top-24 right-6 md:top-32 md:right-8 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center group"
          style={{
            animation: 'pulse-glow 2s ease-in-out infinite'
          }}
        >
          <Phone className="w-6 h-6 md:w-7 md:h-7 text-white relative z-10 drop-shadow-lg" />

          <div className="absolute bottom-full mb-3 right-0 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl">
            Экстренный вызов
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
};
