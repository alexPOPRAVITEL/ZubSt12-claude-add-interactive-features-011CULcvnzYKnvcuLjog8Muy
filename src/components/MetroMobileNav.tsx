import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { metroNavigationData, MetroStation, MetroLine } from '../data/metroNavigation';

export const MetroMobileNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openLine, setOpenLine] = useState<string | null>(null);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLine = (lineId: string) => {
    setOpenLine(openLine === lineId ? null : lineId);
  };

  // Close menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Floating Menu Button */}
      <motion.button
        onClick={toggleMenu}
        className="fixed bottom-4 right-4 z-50 bg-primary text-white rounded-full w-16 h-16 shadow-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center md:hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isMenuOpen ? <X className="w-8 h-8" /> : <span className="text-2xl">🚇</span>}
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white z-40 overflow-y-auto mobile-safe-bottom md:hidden"
          >
            <div className="p-6 pt-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#002B49] mb-2">
                  🚇 Навигация Метро
                </h2>
                <p className="text-gray-600">Схема станций "Зубная Станция"</p>
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
                        <span>{line.name.split(' ')[0]} {line.name.split(' ').slice(1).join(' ')}</span>
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

              <div className="mt-8 flex flex-col space-y-4">
                <a
                  href="tel:+79619785454"
                  className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors duration-300 font-medium shadow-md"
                >
                  <Phone className="w-5 h-5" />
                  <span>📞 Позвонить нам</span>
                </a>
                <Link
                  to="/contacts"
                  className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors duration-300 font-medium shadow-md"
                >
                  <span>🎯 Записаться на приём</span>
                </Link>
                <a
                  href="https://wa.me/79619785454"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors duration-300 font-medium shadow-md"
                >
                  <span>💬 WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};