import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, FileText, Settings, Star, TrendingUp, Calendar, MessageSquare, Activity, Eye, CreditCard as Edit, Plus, Stethoscope, BookOpen, Award, Lock, LogOut, Image, ShoppingBag, Gift, Mail, Phone, MapPin, HelpCircle, GraduationCap, Menu, X } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { NotificationCenter } from './NotificationCenter';
import { AdminDashboard } from './AdminDashboard';
import { ServicesManagement } from './ServicesManagement';
import { DoctorsManagement } from './DoctorsManagement';
import { ReviewsManagement } from './ReviewsManagement';
import { SiteSettings } from './SiteSettings';
import { FaqManagement } from './FaqManagement';
import { MediaManagement } from './MediaManagement';
import { BlogManagement } from './BlogManagement';
import { PromotionsManagement } from './PromotionsManagement';
import { OrdersManagement } from './OrdersManagement';
import { AnalyticsManagement } from './AnalyticsManagement';
import { AppointmentCategoriesManagement } from './AppointmentCategoriesManagement';
import { AppointmentServicesManagement } from './AppointmentServicesManagement';
import { TrainingManagement } from './TrainingManagement';
import { FinanceManagement } from './FinanceManagement';
import { ActivityLogViewer } from './ActivityLogViewer';
import { AppointmentsManagement } from './AppointmentsManagement';
import { VisitorHeatmap } from './VisitorHeatmap';
import { HeroStoriesManagement } from './HeroStoriesManagement';

export const AdminPage: React.FC = () => {
  const { adminUser, loading: authLoading, login, logout } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    setLoginError('');
    const success = await login(password);
    if (!success) {
      setLoginError('Неверный пароль');
    }
  };

  const handleLogout = async () => {
    await logout();
    setPassword('');
    setActiveModule('dashboard');
    setIsMobileMenuOpen(false);
  };

  const modules = [
    {
      id: 'dashboard',
      title: 'Дашборд',
      description: 'Общая статистика и быстрые действия',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'hero-stories',
      title: 'Hero Stories',
      description: 'Карусель на главной странице',
      icon: <Image className="w-6 h-6" />,
      color: 'bg-fuchsia-500'
    },
    {
      id: 'services',
      title: 'Услуги',
      description: 'Управление каталогом услуг и ценами',
      icon: <Stethoscope className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'doctors',
      title: 'Врачи',
      description: 'Управление информацией о врачах',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 'appointments',
      title: 'Записи на прием',
      description: 'Управление записями пациентов',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-teal-500'
    },
    {
      id: 'blog',
      title: 'Блог',
      description: 'Создание и редактирование статей',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-indigo-500'
    },
    {
      id: 'reviews',
      title: 'Отзывы',
      description: 'Модерация и управление отзывами',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-yellow-500'
    },
    {
      id: 'promotions',
      title: 'Акции',
      description: 'Создание и управление акциями',
      icon: <Gift className="w-6 h-6" />,
      color: 'bg-red-500'
    },
    {
      id: 'orders',
      title: 'Заказы',
      description: 'Управление заказами из магазина',
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'bg-orange-500'
    },
    {
      id: 'media',
      title: 'Медиафайлы',
      description: 'Управление изображениями и видео',
      icon: <Image className="w-6 h-6" />,
      color: 'bg-pink-500'
    },
    {
      id: 'analytics',
      title: 'Аналитика',
      description: 'Статистика посещений и конверсий',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-teal-500'
    },
    {
      id: 'heatmap',
      title: 'Тепловая карта',
      description: 'Визуализация активности пользователей',
      icon: <Eye className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 'faq',
      title: 'FAQ',
      description: 'Управление вопросами и ответами',
      icon: <HelpCircle className="w-6 h-6" />,
      color: 'bg-orange-500'
    },
    {
      id: 'appointment-categories',
      title: 'Категории услуг',
      description: 'Управление категориями для записи',
      icon: <HelpCircle className="w-6 h-6" />,
      color: 'bg-cyan-500'
    },
    {
      id: 'appointment-services',
      title: 'Услуги для записи',
      description: 'Управление услугами в модальном окне',
      icon: <Stethoscope className="w-6 h-6" />,
      color: 'bg-emerald-500'
    },
    {
      id: 'training',
      title: 'Обучение',
      description: 'Система обучения сотрудников',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'finance',
      title: 'Финансы',
      description: 'FinTablo - учет доходов и расходов',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      id: 'activity-log',
      title: 'Журнал активности',
      description: 'История действий администраторов',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-slate-500'
    },
    {
      id: 'settings',
      title: 'Настройки',
      description: 'Общие настройки сайта',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-gray-500'
    }
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'hero-stories':
        return <HeroStoriesManagement onBack={() => setActiveModule('dashboard')} />;
      case 'services':
        return <ServicesManagement onBack={() => setActiveModule('dashboard')} />;
      case 'doctors':
        return <DoctorsManagement onBack={() => setActiveModule('dashboard')} />;
      case 'appointments':
        return <AppointmentsManagement onBack={() => setActiveModule('dashboard')} />;
      case 'blog':
        return <BlogManagement onBack={() => setActiveModule('dashboard')} />;
      case 'reviews':
        return <ReviewsManagement onBack={() => setActiveModule('dashboard')} />;
      case 'promotions':
        return <PromotionsManagement onBack={() => setActiveModule('dashboard')} />;
      case 'orders':
        return <OrdersManagement onBack={() => setActiveModule('dashboard')} />;
      case 'media':
        return <MediaManagement onBack={() => setActiveModule('dashboard')} />;
      case 'analytics':
        return <AnalyticsManagement onBack={() => setActiveModule('dashboard')} />;
      case 'heatmap':
        return <VisitorHeatmap onBack={() => setActiveModule('dashboard')} />;
      case 'faq':
        return <FaqManagement onBack={() => setActiveModule('dashboard')} />;
      case 'settings':
        return <SiteSettings onBack={() => setActiveModule('dashboard')} />;
      case 'appointment-categories':
        return <AppointmentCategoriesManagement onBack={() => setActiveModule('dashboard')} />;
      case 'appointment-services':
        return <AppointmentServicesManagement onBack={() => setActiveModule('dashboard')} />;
      case 'training':
        return <TrainingManagement />;
      case 'finance':
        return <FinanceManagement />;
      case 'activity-log':
        return <ActivityLogViewer onBack={() => setActiveModule('dashboard')} />;
      default:
        return <AdminDashboard />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full"
        >
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
            <p className="text-gray-600">Зубная Станция</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                placeholder="Введите пароль"
              />
              {loginError && (
                <p className="text-red-500 text-sm mt-1">{loginError}</p>
              )}
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-primary text-white py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors duration-300"
            >
              Войти
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <img
                src="https://files.salebot.pro/uploads/file_item/file/575843/ЗУБНАЯ_СТАНЦИЯ__6_.png"
                alt="Зубная Станция"
                className="h-10 w-10 mr-4"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Админ-панель</h1>
                <span className="text-sm text-gray-500">{adminUser.full_name} ({adminUser.role})</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter adminUserId={adminUser.id} />
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Просмотреть сайт
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white shadow-sm min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <nav className="p-4">
            <div className="space-y-2">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => {
                    setActiveModule(module.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                    activeModule === module.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activeModule === module.id ? 'bg-white/20' : module.color
                  }`}>
                    <div className={activeModule === module.id ? 'text-white' : 'text-white'}>
                      {module.icon}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{module.title}</div>
                    <div className={`text-xs ${
                      activeModule === module.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {module.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};