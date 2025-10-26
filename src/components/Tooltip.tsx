import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children, direction = 'top' }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positions = {
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2'
  };

  const arrowPositions = {
    left: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45'
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0, y: direction === 'top' ? 20 : direction === 'bottom' ? -20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0, y: direction === 'top' ? 20 : direction === 'bottom' ? -20 : 0 }}
            className={`absolute ${positions[direction]} px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50`}
          >
            {text}
            <div className={`absolute ${arrowPositions[direction]} w-2 h-2 bg-gray-900`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};