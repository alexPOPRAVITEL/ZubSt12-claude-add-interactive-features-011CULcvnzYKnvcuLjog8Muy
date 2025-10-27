import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { QuickAppointment } from './QuickAppointment';

export const FloatingAppointmentButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="glass-button fixed top-64 right-6 md:top-80 md:right-8 z-40 w-14 h-14 flex items-center justify-center group"
        whileHover={{
          scale: 1.08,
          y: -4,
          transition: {
            duration: 0.4,
            type: "spring",
            stiffness: 400,
            damping: 10
          }
        }}
        whileTap={{
          scale: 0.92,
          y: 0,
          transition: { duration: 0.2 }
        }}
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1
        }}
      >
        <Calendar className="w-6 h-6 text-white relative z-10 drop-shadow-lg" />

        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse shadow-lg">
          !
        </div>

        <div className="absolute bottom-full mb-3 right-0 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl">
          Записаться на прием
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
        </div>
      </motion.button>

      <QuickAppointment isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
