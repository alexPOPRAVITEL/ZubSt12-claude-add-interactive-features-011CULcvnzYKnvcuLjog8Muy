import React from 'react';
import { motion } from 'framer-motion';

export const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="w-full h-full flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: [0.8, 1, 0.95, 1],
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              times: [0, 0.5, 0.8, 1]
            }}
            className="relative"
          >
            <motion.img
              src="/ЗУБНАЯ СТАНЦИЯ (6) copy.png"
              alt="Зубная Станция"
              className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain"
              animate={{
                scale: [1, 0.95, 1]
              }}
              transition={{
                delay: 0.5,
                duration: 0.3,
                times: [0, 0.5, 1]
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};