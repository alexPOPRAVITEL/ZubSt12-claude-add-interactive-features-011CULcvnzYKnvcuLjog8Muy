import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroAutoScrollProps {
  imageUrl: string;
}

export const HeroAutoScroll: React.FC<HeroAutoScrollProps> = ({ imageUrl }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const totalSections = 3;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % totalSections);
    }, 3500);

    return () => clearInterval(interval);
  }, [isMobile]);

  const getPositionClass = () => {
    switch (currentSection) {
      case 0:
        return 'object-left';
      case 1:
        return 'object-center';
      case 2:
        return 'object-right';
      default:
        return 'object-left';
    }
  };

  if (!isMobile) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imageUrl}
          alt="Hero background"
          className="w-full h-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.img
        src={imageUrl}
        alt="Hero background"
        className="w-full h-full object-cover"
        animate={{
          objectPosition: currentSection === 0 ? 'left center' : currentSection === 1 ? 'center center' : 'right center'
        }}
        transition={{
          duration: 2,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSection === index
                ? 'w-8 bg-white'
                : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
