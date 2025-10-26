import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { getImageUrl } from '../utils/mediaContent';
import { metroNavigationData } from '../data/metroNavigation';

export const MetroHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openLine, setOpenLine] = useState<string | null>(null);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [logoUrl, setLogoUrl] = useState('https://files.salebot.pro/uploads/file_item/file/575843/ЗУБНАЯ_СТАНЦИЯ__6_.png');

  useEffect(() => {
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

  const toggleLine = (lineId: string) => {
    setOpenLine(openLine === lineId ? null : lineId);
  };

  const isActive = (path: string) => location.pathname === path;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenLine(null);
  }, [location.pathname]);

  return (
    <header className="bg-white shadow-md relative z-50 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-32">
          <Link to="/" className="flex items-center group">
            <motion.img
              src="/dental-station-logo-main.png"
              alt="Зубная Станция"
              className="h-24 md:h-28 w-auto rounded-xl bg-white p-2 shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
            <div className="flex flex-col items-start ml-4 md:ml-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center"
              >
                <span className="text-4xl font-bold text-[#002B49] tracking-tight whitespace-nowrap">
                  ЗУБНАЯ СТАНЦИЯ
                </span>
              </motion.div>
              <p className="text-lg md:text-xl font-medium text-[#002B49] mt-2">
                Следующая станция — здоровая улыбка
              </p>
            </div>
          </Link>

          {/* Metro Map Navigation */}
          <div className="hidden md:block relative" ref={menuRef}>
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
              <span className="font-medium">🚇 Схема Метро</span>
            </motion.button>
            
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 p-6 border border-gray-200"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-[#002B49] mb-2">🚇 Схема Метро "Зубная Станция"</h3>
                    <p className="text-gray-600">Выберите станцию для навигации по сайту</p>
                  </div>
                  
                  <div className="space-y-4">
                    {metroNavigationData.map(line => (
                      <div key={line.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => toggleLine(line.id)}
                          className="w-full p-4 text-left flex justify-between items-center font-semibold text-lg transition-colors duration-300"
                          style={{ 
                            color: line.color.main,
                            backgroundColor: openLine === line.id ? `${line.color.main}15` : 'transparent'
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: line.color.main }}
                            ></div>
                            <span>{line.name}</span>
                          </div>
                          {openLine === line.id ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        <AnimatePresence>
                          {openLine === line.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <nav className="pb-4">
                                {line.stations.map(station => (
                                  <Link
                                    key={station.id}
                                    to={station.path}
                                    className={`block px-6 py-4 text-gray-700 hover:bg-gray-100 transition-colors relative ${
                                      isActive(station.path) ? 'bg-primary/10 text-primary font-medium' : ''
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <span className="text-2xl">{station.icon}</span>
                                      <div className="flex-1">
                                        <div className="font-medium">{station.name}</div>
                                        <div className="text-sm text-gray-500">{station.description}</div>
                                        {station.preview && (
                                          <div className="text-xs text-gray-400 mt-1">{station.preview}</div>
                                        )}
                                      </div>
                                      {station.badge && (
                                        <span className={`text-xs px-2 py-1 rounded-full ${station.badgeColor || 'bg-blue-500'} text-white font-bold`}>
                                          {station.badge}
                                        </span>
                                      )}
                                    </div>
                                    {station.isHub && (
                                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    )}
                                  </Link>
                                ))}
                              </nav>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex flex-col space-y-3">
                    <a
                      href="tel:+79619785454"
                      className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors duration-300 font-medium shadow-md"
                    >
                      <Phone className="w-5 h-5" />
                      <span>📞 Позвонить нам</span>
                    </a>
                    <Link
                      to="/contacts"
                      className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors duration-300 font-medium shadow-md"
                    >
                      <span>🎯 Записаться</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};