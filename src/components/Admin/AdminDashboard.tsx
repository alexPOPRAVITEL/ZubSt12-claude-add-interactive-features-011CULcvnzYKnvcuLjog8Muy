import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, FileText, Settings, Star, TrendingUp, Calendar, MessageSquare, Activity, Eye, CreditCard as Edit, Plus, Stethoscope, BookOpen, Award, RefreshCw, Gift } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { ServicesManagement } from './ServicesManagement';
import { DoctorsManagement } from './DoctorsManagement';
import { ReviewsManagement } from './ReviewsManagement';
import { BlogManagement } from './BlogManagement';
import { PromotionsManagement } from './PromotionsManagement';
import { OrdersManagement } from './OrdersManagement';
import { MediaManagement } from './MediaManagement';
import { AnalyticsManagement } from './AnalyticsManagement';
import { SiteSettings } from './SiteSettings';
import { ContentManagement } from './ContentManagement';
import { FaqManagement } from './FaqManagement';
import { DoctorStatsManagement } from './DoctorStatsManagement';
import { DashboardWidgets } from './DashboardWidgets';
import { useAdminAuth } from '../../hooks/useAdminAuth';

interface DashboardStats {
  totalServices: number;
  activeServices: number;
  totalReviews: number;
  averageRating: number;
  totalVisitors: number;
  todayVisitors: number;
  activePromotions: number;
  totalOrders: number;
  pendingOrders: number;
  totalAppointments: number;
  pendingAppointments: number;
  todayAppointments: number;
}

export const AdminDashboard: React.FC = () => {
  const { adminUser } = useAdminAuth();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 35,
    activeServices: 0,
    totalReviews: 350,
    averageRating: 4.8,
    totalVisitors: 0,
    todayVisitors: 0,
    activePromotions: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load services data
      const { data: services, error: servicesError } = await supabase
        .from('marketplace_items')
        .select('*');

      // Load reviews data
      const { data: reviews, error: reviewsError } = await supabase
        .from('testimonials')
        .select('*');

      // Load promotions data
      const { data: promotions, error: promotionsError } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_published', true);

      // Load visitors data
      const { data: visitors, error: visitorsError } = await supabase
        .from('visitors')
        .select('*');

      // Load orders data
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      // Load appointments data
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*');

      // Calculate statistics
      const totalServices = services?.length || 0;
      const activeServices = services?.filter(s => s.is_published).length || 0;
      const totalReviews = reviews?.length || 0;
      const averageRating = reviews && reviews.length > 0 
        ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
        : 0;
      
      const totalVisitors = visitors?.length || 0;
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayVisitors = visitors?.filter(v => 
        new Date(v.created_at) >= todayStart
      ).length || 0;
      
      const activePromotions = promotions?.length || 0;
      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;

      const totalAppointments = appointments?.length || 0;
      const pendingAppointments = appointments?.filter(a => a.status === 'pending').length || 0;
      const todayAppointments = appointments?.filter(a => {
        if (!a.appointment_date) return false;
        const aptDate = new Date(a.appointment_date);
        return aptDate.getFullYear() === today.getFullYear() &&
               aptDate.getMonth() === today.getMonth() &&
               aptDate.getDate() === today.getDate();
      }).length || 0;

      setStats({
        totalServices,
        activeServices,
        totalReviews,
        averageRating,
        totalVisitors,
        todayVisitors,
        activePromotions,
        totalOrders,
        pendingOrders,
        totalAppointments,
        pendingAppointments,
        todayAppointments
      });
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    {
      id: 'content',
      title: 'Контент страниц',
      description: 'Тексты, заголовки, ссылки всех блоков',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      stats: 'Hero, Footer, Секции',
      actions: ['Редактировать тексты', 'Обновить ссылки', 'Изменить заголовки']
    },
    {
      id: 'services',
      title: 'Управление услугами',
      description: 'Каталог, цены, акции',
      icon: <Stethoscope className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      stats: `${stats.totalServices} услуг (${stats.activeServices} активных)`,
      actions: ['Добавить услугу', 'Обновить цены', 'Создать акцию']
    },
    {
      id: 'blog',
      title: 'Управление блогом',
      description: 'Статьи, публикации, контент',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      stats: 'Статьи и публикации',
      actions: ['Создать статью', 'Редактировать', 'Опубликовать']
    },
    {
      id: 'doctors',
      title: 'Управление врачами',
      description: 'Профили, фотографии, специализации',
      icon: <Users className="w-8 h-8" />,
      color: 'from-teal-500 to-teal-600',
      stats: 'Профили врачей',
      actions: ['Добавить врача', 'Редактировать', 'Управление']
    },
    {
      id: 'appointments',
      title: 'Записи на прием',
      description: 'Управление записями пациентов',
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-emerald-500 to-emerald-600',
      stats: `${stats.totalAppointments} записей (${stats.pendingAppointments} ожидают, ${stats.todayAppointments} сегодня)`,
      actions: ['Просмотр', 'Подтвердить', 'Экспорт']
    },
    {
      id: 'doctor-stats',
      title: 'Статистика врачей',
      description: 'Детальная статистика работы врачей',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-pink-500 to-rose-600',
      stats: 'Приемы, рейтинги, аналитика',
      actions: ['Просмотр', 'Редактировать', 'Экспорт']
    },
    {
      id: 'reviews',
      title: 'Управление отзывами',
      description: 'Модерация, ответы, аналитика',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      stats: `${stats.totalReviews} отзывов (★${stats.averageRating})`,
      actions: ['Модерировать', 'Ответить', 'Аналитика']
    },
    {
      id: 'promotions',
      title: 'Управление акциями',
      description: 'Создание и редактирование акций',
      icon: <Gift className="w-8 h-8" />,
      color: 'from-red-500 to-red-600',
      stats: `${stats.activePromotions} активных акций`,
      actions: ['Создать акцию', 'Редактировать', 'Деактивировать']
    },
    {
      id: 'faq',
      title: 'Управление FAQ',
      description: 'Вопросы и ответы по категориям',
      icon: <Activity className="w-8 h-8" />,
      color: 'from-cyan-500 to-cyan-600',
      stats: 'FAQ записи',
      actions: ['Добавить вопрос', 'Редактировать', 'Категории']
    },
    {
      id: 'orders',
      title: 'Управление заказами',
      description: 'Заказы из магазина и записи',
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-indigo-500 to-indigo-600',
      stats: `${stats.totalOrders} заказов (${stats.pendingOrders} ожидают)`,
      actions: ['Просмотр заказов', 'Обновить статус', 'Экспорт']
    },
    {
      id: 'media',
      title: 'Медиафайлы',
      description: 'Управление изображениями и видео',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-pink-500 to-pink-600',
      stats: 'Яндекс.Диск интеграция',
      actions: ['Загрузить файлы', 'Организовать', 'Оптимизировать']
    },
    {
      id: 'settings',
      title: 'Настройки сайта',
      description: 'Контакты, SEO, интеграции',
      icon: <Settings className="w-8 h-8" />,
      color: 'from-gray-500 to-gray-600',
      stats: 'Конфигурация',
      actions: ['Контакты', 'SEO', 'Интеграции']
    },
    {
      id: 'analytics',
      title: 'Аналитика и отчеты',
      description: 'Статистика, тренды, KPI',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-indigo-500 to-indigo-600',
      stats: `${stats.totalVisitors} посетителей (${stats.todayVisitors} сегодня)`,
      actions: ['Отчеты', 'Экспорт', 'Настройки']
    }
  ];

  const recentActivity = [
    {
      type: 'review',
      message: 'Новый отзыв от Марии К.',
      time: '5 минут назад',
      status: 'pending'
    },
    {
      type: 'appointment',
      message: 'Запись на прием к Голевой Н.Ф.',
      time: '15 минут назад',
      status: 'completed'
    },
    {
      type: 'service',
      message: 'Обновлена цена на имплантацию',
      time: '1 час назад',
      status: 'completed'
    },
    {
      type: 'doctor',
      message: 'Добавлена статья от Саакяна Д.С.',
      time: '2 часа назад',
      status: 'completed'
    }
  ];

  const quickStats = [
    {
      label: 'Средний рейтинг',
      value: stats.averageRating > 0 ? stats.averageRating.toString() : '0.0',
      change: '+0.2',
      trend: 'up',
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      label: 'Всего посетителей',
      value: stats.totalVisitors.toLocaleString(),
      change: '+15%',
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5 text-green-500" />
    },
    {
      label: 'Заказов ожидают',
      value: stats.pendingOrders.toString(),
      change: '-5',
      trend: 'down',
      icon: <MessageSquare className="w-5 h-5 text-orange-500" />
    },
    {
      label: 'Активные акции',
      value: stats.activePromotions.toString(),
      change: '+2',
      trend: 'up',
      icon: <Calendar className="w-5 h-5 text-purple-500" />
    }
  ];

  // Render specific module
  const renderModule = () => {
    switch (activeModule) {
      case 'content':
        return <ContentManagement onBack={() => setActiveModule(null)} />;
      case 'services':
        return <ServicesManagement onBack={() => setActiveModule(null)} />;
      case 'doctors':
        return <DoctorsManagement onBack={() => setActiveModule(null)} />;
      case 'doctor-stats':
        return <DoctorStatsManagement onBack={() => setActiveModule(null)} />;
      case 'blog':
        return <BlogManagement onBack={() => setActiveModule(null)} />;
      case 'reviews':
        return <ReviewsManagement onBack={() => setActiveModule(null)} />;
      case 'promotions':
        return <PromotionsManagement onBack={() => setActiveModule(null)} />;
      case 'faq':
        return <FaqManagement onBack={() => setActiveModule(null)} />;
      case 'orders':
        return <OrdersManagement onBack={() => setActiveModule(null)} />;
      case 'media':
        return <MediaManagement onBack={() => setActiveModule(null)} />;
      case 'analytics':
        return <AnalyticsManagement onBack={() => setActiveModule(null)} />;
      case 'settings':
        return <SiteSettings onBack={() => setActiveModule(null)} />;
      default:
        return null;
    }
  };

  if (activeModule) {
    return renderModule();
  }

  return (
    <div className="p-6">
      {/* Header with refresh */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-gray-600 mt-1">
            Обзор статистики и быстрый доступ к управлению
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Последнее обновление: {lastUpdated.toLocaleTimeString('ru-RU')}
            </p>
          )}
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Обновить</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Загрузка актуальных данных...</p>
          </div>
        </div>
      ) : (
        <>
        {/* Dashboard Widgets */}
        {adminUser && (
          <div className="mb-8">
            <DashboardWidgets adminUserId={adminUser.id} stats={stats} />
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-right">
                  {stat.icon}
                  <p className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setActiveModule(module.id)}
            >
              <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                    <p className="text-white/80">{module.description}</p>
                  </div>
                  <div className="text-white/80 group-hover:text-white transition-colors">
                    {module.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    {module.stats}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Быстрые действия:</h4>
                <div className="space-y-2">
                  {module.actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Действие: ${action} в модуле ${module.title}`);
                      }}
                    >
                      • {action}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Последняя активность</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setActiveModule('services')}
                className="flex items-center justify-center p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Новая услуга
              </button>
              <button 
                onClick={() => setActiveModule('blog')}
                className="flex items-center justify-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Создать статью
              </button>
              <button 
                onClick={() => setActiveModule('promotions')}
                className="flex items-center justify-center p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Создать акцию
              </button>
              <button 
                onClick={() => setActiveModule('reviews')}
                className="flex items-center justify-center p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Star className="w-4 h-4 mr-2" />
                Модерация отзывов
              </button>
            </div>
          </motion.div>
        </div>
        </>
      )}
    </div>
  );
};