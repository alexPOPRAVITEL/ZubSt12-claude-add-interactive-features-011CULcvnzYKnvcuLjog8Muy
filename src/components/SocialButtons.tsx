import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, MapPin } from 'lucide-react';

export const SocialButtons: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const socialLinks = [
    {
      icon: '📱',
      name: 'VK',
      url: 'https://vk.com/zubst',
      className: 'glass-button-vk',
      delay: 0
    },
    {
      icon: <Send className="w-6 h-6 text-white relative z-10 drop-shadow-lg" />,
      name: 'Telegram',
      url: 'https://t.me/zub_st',
      className: 'glass-button-telegram',
      delay: 0.05
    },
    {
      icon: '📸',
      name: 'Instagram',
      url: 'https://www.instagram.com/zubnayast?igsh=MTNwbGo3c3o4Y2NwZQ%3D%3D&utm_source=qr',
      className: 'glass-button-instagram',
      delay: 0.1
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-white relative z-10 drop-shadow-lg" />,
      name: 'WhatsApp',
      url: 'https://wa.me/79619785454',
      className: 'glass-button-whatsapp',
      delay: 0.15
    },
    {
      icon: '🗺️',
      name: '2GIS',
      url: 'https://2gis.ru/barnaul/geo/70000001085665549',
      className: 'glass-button-2gis',
      delay: 0.2
    },
    {
      icon: <MapPin className="w-6 h-6 text-white relative z-10 drop-shadow-lg" />,
      name: 'Yandex',
      url: 'https://yandex.ru/maps/org/zubnaya_stantsiya/160523065239?si=bh6f5fxy24ttcc8uekgpxc2c7c',
      className: 'glass-button-yandex',
      delay: 0.25
    }
  ];

  return (
    <div className="fixed bottom-44 right-6 md:bottom-44 md:right-8 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isExpanded && (
          <>
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ x: 100, opacity: 0, scale: 0 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 100, opacity: 0, scale: 0 }}
                transition={{
                  delay: social.delay,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className={`glass-button ${social.className} w-14 h-14 flex items-center justify-center group`}
                whileHover={{
                  scale: 1.08,
                  y: -4,
                  transition: {
                    scale: { duration: 0.3 },
                    y: { duration: 0.3 }
                  }
                }}
                whileTap={{
                  scale: 0.92,
                  y: 0,
                  transition: { duration: 0.2 }
                }}
              >
                {typeof social.icon === 'string' ? (
                  <span className="text-2xl relative z-10 drop-shadow-lg">{social.icon}</span>
                ) : (
                  social.icon
                )}

                <div className="absolute bottom-full mb-3 right-0 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl">
                  {social.name}
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
                </div>
              </motion.a>
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="glass-button glass-button-toggle w-10 h-10 flex items-center justify-center"
        whileHover={{
          scale: 1.1,
          rotate: 360,
          transition: {
            scale: { duration: 0.3 },
            rotate: { duration: 0.6, ease: "easeInOut" }
          }
        }}
        whileTap={{
          scale: 0.9,
          transition: { duration: 0.1 }
        }}
        animate={{
          rotate: isExpanded ? 0 : 180
        }}
        transition={{
          rotate: { duration: 0.5, type: "spring", stiffness: 200 }
        }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="w-5 h-5 text-white drop-shadow-lg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isExpanded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </motion.div>
      </motion.button>
    </div>
  );
};
