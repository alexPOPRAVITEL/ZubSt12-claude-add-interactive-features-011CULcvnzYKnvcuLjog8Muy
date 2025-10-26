import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Главная', icon: 'heart-tooth' },
    { path: '/services', label: 'Услуги', icon: 'tooth' },
    { path: '/doctors', label: 'Врачи', icon: 'doctor' },
    { path: '/prices', label: 'Цены', icon: 'wallet' },
    { path: '/subscriptions', label: 'Абонементы', icon: 'subscription' },
    { path: '/reviews', label: 'Отзывы', icon: 'star' },
    { path: '/marketplace', label: 'Магазин', icon: 'shopping' },
    { path: '/portfolio', label: 'Работы', icon: 'gallery' },
    { path: '/team', label: 'Команда', icon: 'team' },
    { path: '/press', label: 'СМИ', icon: 'newspaper' },
    { path: '/contacts', label: 'Контакты', icon: 'location' },
    { path: '/loyalty', label: 'Лояльность', icon: 'star' },
    { path: '/virtual-tour', label: 'Тур', icon: 'gallery' }
  ];

  const icons = {
    'heart-tooth': (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21z"/>
      </svg>
    ),
    'tooth': (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3.4c-3.8 0-6.8 2.6-6.8 5.8v8.8c0 1.9 1.6 3.4 3.4 3.4h6.8c1.9 0 3.4-1.6 3.4-3.4V9.2c0-3.2-3-5.8-6.8-5.8z"/>
      </svg>
    ),
    'doctor': (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15.8 9.2a3.8 3.8 0 11-7.6 0 3.8 3.8 0 017.6 0z"/>
        <path d="M12 13v4"/>
        <path d="M10 15h4"/>
        <path d="M5.2 20.6v-1.9c0-1.9 1.5-3.4 3.4-3.4h6.8c1.9 0 3.4 1.5 3.4 3.4v1.9"/>
      </svg>
    ),
    'wallet': (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M22 10h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4"/>
      </svg>
    ),
    'location': (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21c0 0 8-6 8-12 0-4.4-3.6-8-8-8S4 4.6 4 8c0 6 8 12 8 12z"/>
        <circle cx="12" cy="8" r="3"/>
      </svg>
    ),
    'star': (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
    'gallery': (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21,15 16,10 5,21"/>
      </svg>
    ),
    'newspaper': (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="16" y2="11" />
        <line x1="8" y1="15" x2="16" y2="15" />
      </svg>
    ),
    'subscription': (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <path d="M3 10h18"/>
        <path d="M8 21v-10"/>
        <path d="M16 21v-10"/>
      </svg>
    ),
    'shopping': (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H3m4 8v6a1 1 0 001 1h8a1 1 0 001-1v-6"/>
        <circle cx="9" cy="20" r="1"/>
        <circle cx="20" cy="20" r="1"/>
      </svg>
    ),
    'team': (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <motion.div 
        className="flex items-center justify-between px-4 py-3 bg-white rounded-t-[24px] shadow-lg mx-auto mobile-nav"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className="flex flex-col items-center transition-all duration-300"
          >
            <motion.div
              className={`${isActive(item.path) ? 'text-primary scale-110' : 'text-secondary'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {icons[item.icon as keyof typeof icons]}
            </motion.div>
            <span className={`text-sm font-medium mt-1 ${isActive(item.path) ? 'text-primary' : 'text-secondary'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </motion.div>
    </nav>
  );
};