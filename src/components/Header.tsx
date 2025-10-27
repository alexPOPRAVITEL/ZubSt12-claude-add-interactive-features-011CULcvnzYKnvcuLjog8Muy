import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, Send } from 'lucide-react';
import { getImageUrl } from '../utils/mediaContent';

const reminders = [
  { text: 'зубы ты не забыл?', emoji: '🦷' },
  { text: 'чистку?', emoji: '🪥' },
  { text: 'ребёнка?', emoji: '👶' },
  { text: 'зуб мудрости?', emoji: '🦷' },
  { text: 'дёсны?', emoji: '🌿' },
  { text: 'профосмотр?', emoji: '✅' },
  { text: 'лечение?', emoji: '🏥' },
  { text: 'улыбку?', emoji: '😊' },
  { text: 'семейную скидку?', emoji: '👨‍👩‍👧‍👦' },
  { text: 'бесплатную консультацию?', emoji: '💬' }
];

export const Header: React.FC = () => {
  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const [logoUrl, setLogoUrl] = useState('https://files.salebot.pro/uploads/file_item/file/575843/ЗУБНАЯ_СТАНЦИЯ__6_.png');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    // Close menu when resizing to mobile
    if (window.innerWidth <= 768) {
      setIsMenuOpen(false);
    }
    
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (socialRef.current && !socialRef.current.contains(event.target as Node)) {
        setIsSocialOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Загружаем логотип из админки
    const loadLogo = async () => {
      const imageUrl = await getImageUrl(
        'general', 
        'logo.png', 
        'https://files.salebot.pro/uploads/file_item/file/575843/ЗУБНАЯ_СТАНЦИЯ__6_.png'
      );
      setLogoUrl(imageUrl);
    };

    loadLogo();
  }, []);

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setCurrentReminderIndex(1);
    }, 5000);

    const interval = setInterval(() => {
      setCurrentReminderIndex((prev) => {
        if (prev === 0) return 1;
        return (prev + 1) % reminders.length;
      });
    }, 3000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { path: '/', label: 'Главная' },
    { path: '/services', label: 'Услуги' },
    { path: '/doctors', label: 'Врачи' },
    { path: '/prices', label: 'Цены' },
    { path: '/subscriptions', label: 'Абонементы' },
    { path: '/reviews', label: 'Отзывы' },
    { path: '/marketplace', label: 'Магазин' },
    { path: '/portfolio', label: 'Работы' },
    { path: '/team', label: 'Команда' },
    { path: '/promotions', label: 'Акции' },
    { path: '/press', label: 'СМИ о нас' },
    { path: '/blog', label: 'Блог' },
    { path: '/contacts', label: 'Контакты' },
    { path: '/loyalty', label: 'Программа лояльности' },
    { path: '/mobile-app', label: 'Приложение' },
    { path: '/virtual-tour', label: 'Виртуальный тур' }
  ];

  // Close menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const socialLinks = [
    { icon: '📱', name: 'VK', url: 'https://vk.com/zubst', color: 'from-blue-500 to-blue-600' },
    { icon: <Send className="w-5 h-5" />, name: 'Telegram', url: 'https://t.me/zub_st', color: 'from-sky-500 to-sky-600' },
    { icon: '📸', name: 'Instagram', url: 'https://www.instagram.com/zubnayast?igsh=MTNwbGo3c3o4Y2NwZQ%3D%3D&utm_source=qr', color: 'from-pink-500 to-purple-600' },
    { icon: '🗺️', name: '2GIS', url: 'https://2gis.ru/barnaul/geo/70000001085665549', color: 'from-green-500 to-green-600' },
    { icon: '📍', name: 'Yandex', url: 'https://yandex.ru/maps/org/zubnaya_stantsiya/160523065239?si=bh6f5fxy24ttcc8uekgpxc2c7c', color: 'from-red-500 to-red-600' }
  ];

  return (
    <header className="bg-white shadow-md relative z-50 overflow-visible w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 sm:h-28 md:h-32">
          <Link to="/" className="flex items-center group relative">
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-[#0891B2] via-[#DC2626] to-[#F59E0B] rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"
            />
            <motion.img
              src="/ЗУБНАЯ СТАНЦИЯ (6) copy.png"
              alt="Зубная Станция"
              className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              whileTap={{ scale: 0.95 }}
            />

            <div className="flex flex-col items-start ml-2 sm:ml-4 md:ml-6 lg:ml-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center"
              >
                <span className={`font-bold text-[#002B49] tracking-tight group-hover:text-primary transition-colors duration-300 ${isMobile ? 'text-4xl xs:text-5xl sm:text-6xl flex flex-col leading-tight' : 'text-6xl md:text-7xl lg:text-8xl xl:text-9xl whitespace-nowrap'}`}>
                  {isMobile ? (
                    <>
                      <span>ЗУБНАЯ</span>
                      <span>СТАНЦИЯ</span>
                    </>
                  ) : (
                    'ЗУБНАЯ СТАНЦИЯ'
                  )}
                </span>
              </motion.div>

              <div className="h-6 sm:h-7 md:h-8 overflow-hidden mt-1 sm:mt-2">
                <motion.div
                  className="flex items-center text-sm sm:text-base md:text-lg lg:text-xl font-medium text-[#002B49]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="whitespace-nowrap">А про&nbsp;</span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentReminderIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center"
                    >
                      <span>{reminders[currentReminderIndex].text}</span>
                      <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl ml-1 sm:ml-2">
                        {reminders[currentReminderIndex].emoji}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3 ml-auto">
            <div className="relative" ref={socialRef}>
              <motion.button
                onClick={() => setIsSocialOpen(!isSocialOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Соцсети</span>
              </motion.button>

              <AnimatePresence>
                {isSocialOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <motion.div
                      className="py-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className={`flex items-center px-4 py-3 hover:bg-gradient-to-r ${social.color} hover:text-white transition-all duration-300 group`}
                        >
                          <span className="text-2xl mr-3">{typeof social.icon === 'string' ? social.icon : social.icon}</span>
                          <span className="font-medium">{social.name}</span>
                        </motion.a>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={menuRef}>
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
                <span className="font-medium">Меню</span>
              </motion.button>
            
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <motion.nav 
                    className="py-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <Link
                          to={item.path}
                          className={`block px-4 py-3 hover:bg-gray-50 transition-colors duration-300 ${
                            isActive(item.path) ? 'text-primary font-medium bg-primary/5' : 'text-secondary'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.nav>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};