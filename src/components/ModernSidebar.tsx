import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingWizard } from './BookingWizard';
import {
  Menu,
  X,
  Home,
  Info,
  Users,
  Heart,
  Briefcase,
  DollarSign,
  Star,
  Gift,
  MessageSquare,
  BookOpen,
  Phone,
  Video,
  Calendar,
  Smartphone,
  Award,
  ShoppingBag,
  Newspaper,
  HelpCircle,
  Mail,
  Image,
  Search,
  Zap,
  TrendingUp
} from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
}

interface MenuCategory {
  id: string;
  title: string;
  color: string;
  gradient: string;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    id: 'quick',
    title: 'Быстрый доступ',
    color: '#ef4444',
    gradient: 'from-red-500 to-pink-600',
    items: [
      { id: 'home', title: 'Главная', icon: <Home className="w-5 h-5" />, path: '/' },
      { id: 'contacts', title: 'Записаться', icon: <Calendar className="w-5 h-5" />, path: '/contacts', badge: 'Онлайн', badgeColor: 'bg-green-500' },
      { id: 'promotions', title: 'Акции', icon: <Gift className="w-5 h-5" />, path: '/promotions', badge: 'HOT', badgeColor: 'bg-red-500' },
      { id: 'prices', title: 'Цены', icon: <DollarSign className="w-5 h-5" />, path: '/prices', badge: 'Калькулятор', badgeColor: 'bg-blue-500' },
    ]
  },
  {
    id: 'main',
    title: 'О нас',
    color: '#2563eb',
    gradient: 'from-blue-500 to-blue-600',
    items: [
      { id: 'about', title: 'О клинике', icon: <Info className="w-5 h-5" />, path: '/about', description: 'История и ценности' },
      { id: 'team', title: 'Команда', icon: <Users className="w-5 h-5" />, path: '/team', description: 'Познакомьтесь с нами' },
      { id: 'press', title: 'СМИ о нас', icon: <Newspaper className="w-5 h-5" />, path: '/press', description: 'Публикации' },
      { id: 'virtual-tour', title: 'Виртуальный тур', icon: <Video className="w-5 h-5" />, path: '/virtual-tour', description: '360° по клинике' },
    ]
  },
  {
    id: 'services',
    title: 'Услуги и лечение',
    color: '#10b981',
    gradient: 'from-green-500 to-emerald-600',
    items: [
      { id: 'services', title: 'Все услуги', icon: <Heart className="w-5 h-5" />, path: '/services', description: 'Полный каталог' },
      { id: 'doctors', title: 'Наши врачи', icon: <Briefcase className="w-5 h-5" />, path: '/doctors', description: 'Выберите специалиста' },
      { id: 'portfolio', title: 'Результаты', icon: <Image className="w-5 h-5" />, path: '/portfolio', description: 'До и после' },
      { id: 'reviews', title: 'Отзывы', icon: <MessageSquare className="w-5 h-5" />, path: '/reviews', badge: '4.9⭐', badgeColor: 'bg-green-500' },
    ]
  },
  {
    id: 'special',
    title: 'Экономия и выгода',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    items: [
      { id: 'subscriptions', title: 'Абонементы', icon: <Award className="w-5 h-5" />, path: '/subscriptions', badge: '2+1', badgeColor: 'bg-red-500', description: 'Экономия до 30%' },
      { id: 'loyalty', title: 'Программа лояльности', icon: <Star className="w-5 h-5" />, path: '/loyalty', badge: 'GOLD', badgeColor: 'bg-yellow-500', description: 'Накопительные бонусы' },
      { id: 'marketplace', title: 'Магазин товаров', icon: <ShoppingBag className="w-5 h-5" />, path: '/marketplace', description: 'Средства для ухода' },
    ]
  },
  {
    id: 'content',
    title: 'Полезная информация',
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-600',
    items: [
      { id: 'blog', title: 'Блог', icon: <BookOpen className="w-5 h-5" />, path: '/blog', description: 'Советы стоматологов' },
      { id: 'faq', title: 'Частые вопросы', icon: <HelpCircle className="w-5 h-5" />, path: '/faq', description: 'Быстрые ответы' },
      { id: 'newsletter', title: 'Email рассылка', icon: <Mail className="w-5 h-5" />, path: '/newsletter', description: 'Полезные новости' },
    ]
  },
  {
    id: 'digital',
    title: 'Telegram & Приложение',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
    items: [
      { id: 'mobile-app', title: 'Мобильное приложение', icon: <Smartphone className="w-5 h-5" />, path: '/mobile-app', badge: 'Скачать', badgeColor: 'bg-blue-500', description: 'Записи и бонусы' },
      { id: 'training', title: 'Портал обучения', icon: <Award className="w-5 h-5" />, path: '/training', badge: 'Новое', badgeColor: 'bg-green-500', description: 'Для сотрудников' },
      { id: 'contacts-tg', title: 'Контакты и связь', icon: <Phone className="w-5 h-5" />, path: '/contacts', description: 'WhatsApp • Telegram • Звонок' },
    ]
  }
];

export const ModernSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showQuickAppointment, setShowQuickAppointment] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setActiveCategory(null);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const getWaveAnimation = (index: number) => ({
    scale: [1, 1.3, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatDelay: 0.8,
      delay: index * 0.15,
      ease: "easeInOut"
    }
  });

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden lg:block fixed left-0 top-0 h-full w-20 bg-white shadow-xl z-40"
        initial={{ x: -80 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full py-6">
          <Link to="/" className="flex items-center justify-center mb-8 group relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#0891B2] via-[#DC2626] to-[#F59E0B] rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#002B49] via-[#0891B2] to-[#002B49] flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white/20"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
            >
              🦷
            </motion.div>
          </Link>

          <nav className="flex-1 space-y-2 px-3">
            {menuCategories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                className={`w-full rounded-xl p-3 transition-all duration-300 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={category.title}
              >
                <motion.div
                  className="w-full h-1 rounded-full"
                  style={{ backgroundColor: category.color }}
                  animate={getWaveAnimation(index)}
                ></motion.div>
              </motion.button>
            ))}
          </nav>

          <motion.a
            href="tel:+79619785454"
            className="flex items-center justify-center mx-3 p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Позвонить"
          >
            <Phone className="w-6 h-6" />
          </motion.a>
        </div>
      </motion.div>

      {/* Desktop Extended Menu */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 80, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="hidden lg:block fixed left-20 top-0 h-full w-80 bg-white shadow-2xl z-30 overflow-y-auto"
          >
            {menuCategories.find(c => c.id === activeCategory) && (
              <div className="p-6">
                <div className={`bg-gradient-to-r ${menuCategories.find(c => c.id === activeCategory)!.gradient} rounded-2xl p-6 mb-6 text-white`}>
                  <h2 className="text-2xl font-bold mb-2">
                    {menuCategories.find(c => c.id === activeCategory)!.title}
                  </h2>
                  <p className="text-white/80 text-sm">Выберите раздел</p>
                </div>

                <nav className="space-y-2">
                  {menuCategories.find(c => c.id === activeCategory)!.items.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`block p-4 rounded-xl transition-all duration-300 group ${
                        isActive(item.path)
                          ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`${isActive(item.path) ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'} transition-colors`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${isActive(item.path) ? 'text-blue-900' : 'text-gray-900'}`}>
                              {item.title}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-500 mt-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {item.badge && (
                          <span className={`text-xs px-2 py-1 rounded-full ${item.badgeColor} text-white font-bold whitespace-nowrap ml-2`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[#002B49] via-[#0891B2] to-[#002B49] text-white shadow-2xl flex items-center justify-center border-2 border-white/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden fixed inset-0 bg-white z-40 overflow-y-auto"
          >
            <div className="p-6 pb-24">
              <div className="text-center mb-8 pt-4">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0891B2] via-[#DC2626] to-[#F59E0B] rounded-2xl blur opacity-60 animate-pulse"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#002B49] via-[#0891B2] to-[#002B49] flex items-center justify-center text-white text-3xl shadow-lg border-2 border-white/20">
                    🦷
                  </div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#002B49] via-[#0891B2] to-[#002B49] bg-clip-text text-transparent mb-1">Зубная Станция</h2>
                <p className="text-gray-600">Навигация</p>
              </div>

              <div className="space-y-6">
                {menuCategories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                      className={`w-full p-4 rounded-2xl transition-all duration-300 flex items-center justify-between ${
                        activeCategory === category.id
                          ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                          : 'bg-gray-50 text-gray-900'
                      }`}
                    >
                      <h3 className="text-lg font-bold">{category.title}</h3>
                      <motion.div
                        animate={{ rotate: activeCategory === category.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {activeCategory === category.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden mt-2 space-y-2"
                        >
                          {category.items.map((item) => (
                            <Link
                              key={item.id}
                              to={item.path}
                              className={`block p-4 rounded-xl transition-all duration-300 ${
                                isActive(item.path)
                                  ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                                  : 'bg-white border-2 border-gray-100 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-1">
                                <div className="flex items-center space-x-3">
                                  <div className={isActive(item.path) ? 'text-blue-600' : 'text-gray-600'}>
                                    {item.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className={`font-medium ${isActive(item.path) ? 'text-blue-900' : 'text-gray-900'}`}>
                                      {item.title}
                                    </div>
                                    {item.description && (
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        {item.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {item.badge && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${item.badgeColor} text-white font-bold whitespace-nowrap ml-2`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <a
                  href="tel:+79619785454"
                  className="flex items-center justify-center space-x-2 w-full p-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  <span>Позвонить</span>
                </a>
                <button
                  onClick={() => {
                    setShowQuickAppointment(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Записаться</span>
                </button>
                <a
                  href="https://wa.me/79619785454"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium shadow-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingWizard isOpen={showQuickAppointment} onClose={() => setShowQuickAppointment(false)} />
    </>
  );
};

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
