import React from 'react';
import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackPhoneCall } from '../utils/analytics';

export const CallButton: React.FC = () => {
  const handleCall = () => {
    trackPhoneCall('+79619785454');
    window.location.href = 'tel:+79619785454';
  };

  return (
    <motion.button
      onClick={handleCall}
      className="glass-button glass-button-phone fixed top-44 right-6 md:top-56 md:right-8 z-40 w-14 h-14 flex items-center justify-center group"
      whileHover={{
        scale: 1.08,
        y: -4,
        rotate: [0, -5, 5, -5, 5, 0],
        transition: {
          scale: { duration: 0.3 },
          y: { duration: 0.3 },
          rotate: { duration: 0.5, repeat: 3 }
        }
      }}
      whileTap={{
        scale: 0.92,
        y: 0,
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, x: 100, rotate: 90 }}
      animate={{
        opacity: 1,
        x: 0,
        rotate: 0
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }}
    >
      <Phone className="w-6 h-6 text-white relative z-10 drop-shadow-lg" />

      <div className="absolute bottom-full mb-3 right-0 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl">
        Позвонить
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
      </div>
    </motion.button>
  );
};
