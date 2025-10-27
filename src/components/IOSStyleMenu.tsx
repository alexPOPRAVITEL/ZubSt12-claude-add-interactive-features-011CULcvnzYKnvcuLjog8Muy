import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Home,
  Info,
  Briefcase,
  DollarSign,
  Users,
  BookOpen,
  Contact,
  Phone,
  MessageCircle,
  Send,
  MapPin,
  Grid
} from 'lucide-react';

interface MenuItem {
  type: 'link' | 'external';
  path?: string;
  url?: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

export const IOSStyleMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { type: 'link', path: '/', icon: <Home className="w-6 h-6" />, label: 'Главная', color: 'from-blue-500 to-blue-600' },
    { type: 'link', path: '/about', icon: <Info className="w-6 h-6" />, label: 'О клинике', color: 'from-cyan-500 to-cyan-600' },
    { type: 'link', path: '/services', icon: <Briefcase className="w-6 h-6" />, label: 'Услуги', color: 'from-teal-500 to-teal-600' },
    { type: 'link', path: '/prices', icon: <DollarSign className="w-6 h-6" />, label: 'Цены', color: 'from-green-500 to-green-600' },
    { type: 'link', path: '/doctors', icon: <Users className="w-6 h-6" />, label: 'Врачи', color: 'from-emerald-500 to-emerald-600' },
    { type: 'link', path: '/blog', icon: <BookOpen className="w-6 h-6" />, label: 'Блог', color: 'from-lime-500 to-lime-600' },
    { type: 'link', path: '/contact', icon: <Contact className="w-6 h-6" />, label: 'Контакты', color: 'from-yellow-500 to-yellow-600' },
    { type: 'external', url: 'tel:+79619785454', icon: <Phone className="w-6 h-6" />, label: 'Позвонить', color: 'from-orange-500 to-orange-600' },
    { type: 'external', url: 'https://vk.com/zubst', icon: '📱', label: 'VK', color: 'from-blue-600 to-blue-700' },
    { type: 'external', url: 'https://t.me/zub_st', icon: <Send className="w-6 h-6" />, label: 'Telegram', color: 'from-sky-500 to-sky-600' },
    { type: 'external', url: 'https://www.instagram.com/zubnayast?igsh=MTNwbGo3c3o4Y2NwZQ%3D%3D&utm_source=qr', icon: '📸', label: 'Instagram', color: 'from-pink-500 to-purple-600' },
    { type: 'external', url: 'https://wa.me/79619785454', icon: <MessageCircle className="w-6 h-6" />, label: 'WhatsApp', color: 'from-green-500 to-green-600' },
    { type: 'external', url: 'https://2gis.ru/barnaul/geo/70000001085665549', icon: '🗺️', label: '2GIS', color: 'from-green-600 to-green-700' },
    { type: 'external', url: 'https://yandex.ru/maps/org/zubnaya_stantsiya/160523065239?si=bh6f5fxy24ttcc8uekgpxc2c7c', icon: <MapPin className="w-6 h-6" />, label: 'Yandex', color: 'from-red-500 to-red-600' },
  ];

  const calculatePosition = (index: number, total: number) => {
    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? 160 : 280;
    const startAngle = isMobile ? -45 : -20;
    const endAngle = isMobile ? 180 : 200;
    const angleStep = (endAngle - startAngle) / (total - 1);
    const angle = (startAngle + angleStep * index) * (Math.PI / 180);

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed top-1/2 -translate-y-1/2 right-4 md:bottom-8 md:top-auto md:translate-y-0 md:right-8 z-50">
        <AnimatePresence>
          {isOpen && (
            <>
              {menuItems.map((item, index) => {
                const pos = calculatePosition(index, menuItems.length);

                return (
                  <motion.div
                    key={item.label}
                    initial={{
                      scale: 0,
                      x: 0,
                      y: 0,
                      opacity: 0
                    }}
                    animate={{
                      scale: 1,
                      x: pos.x,
                      y: pos.y,
                      opacity: 1
                    }}
                    exit={{
                      scale: 0,
                      x: 0,
                      y: 0,
                      opacity: 0
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: index * 0.02
                    }}
                    className="absolute bottom-0 right-0"
                  >
                    {item.type === 'link' ? (
                      <Link
                        to={item.path!}
                        onClick={() => setIsOpen(false)}
                        className={`flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${item.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group`}
                      >
                        <div className="flex flex-col items-center">
                          {typeof item.icon === 'string' ? (
                            <span className="text-2xl mb-1">{item.icon}</span>
                          ) : (
                            item.icon
                          )}
                        </div>
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          {item.label}
                        </div>
                      </Link>
                    ) : (
                      <a
                        href={item.url!}
                        target={item.url!.startsWith('http') ? '_blank' : undefined}
                        rel={item.url!.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onClick={() => setIsOpen(false)}
                        className={`flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${item.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group`}
                      >
                        <div className="flex flex-col items-center">
                          {typeof item.icon === 'string' ? (
                            <span className="text-2xl mb-1">{item.icon}</span>
                          ) : (
                            item.icon
                          )}
                        </div>
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          {item.label}
                        </div>
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${
            isOpen
              ? 'from-red-500 to-red-600'
              : 'from-blue-600 to-purple-600'
          } text-white shadow-2xl flex items-center justify-center z-50`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            rotate: isOpen ? 45 : 0,
            scale: isOpen ? 1.05 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <motion.div
            animate={{
              rotate: isOpen ? 90 : 0,
              scale: isOpen ? 0.8 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <motion.div
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                ✕
              </motion.div>
            ) : (
              <Grid className="w-6 h-6 md:w-7 md:h-7" />
            )}
          </motion.div>

          <motion.div
            className="absolute inset-0 rounded-full bg-white"
            initial={{ scale: 0, opacity: 0.3 }}
            animate={isOpen ? {
              scale: [1, 1.5, 2],
              opacity: [0.3, 0.1, 0]
            } : {}}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      </div>
    </>
  );
};
