import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, Star, Calendar, MessageSquare, Settings, Plus, X, GripVertical } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface Widget {
  id: string;
  widget_type: string;
  position: number;
  settings: Record<string, any>;
  is_visible: boolean;
}

interface DashboardWidgetsProps {
  adminUserId: string;
  stats: Record<string, any>;
}

const widgetTypes = [
  {
    type: 'quick-stats',
    name: 'Быстрая статистика',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Основные показатели'
  },
  {
    type: 'recent-reviews',
    name: 'Последние отзывы',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Недавние отзывы клиентов'
  },
  {
    type: 'orders-summary',
    name: 'Сводка заказов',
    icon: <ShoppingBag className="w-5 h-5" />,
    description: 'Статус заказов'
  },
  {
    type: 'appointments',
    name: 'Записи на прием',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Предстоящие записи'
  },
  {
    type: 'top-services',
    name: 'Популярные услуги',
    icon: <Star className="w-5 h-5" />,
    description: 'Самые востребованные'
  }
];

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ adminUserId, stats }) => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWidgets();
  }, [adminUserId]);

  const loadWidgets = async () => {
    try {
      const { data, error } = await supabase
        .from('dashboard_widgets')
        .select('*')
        .eq('admin_user_id', adminUserId)
        .order('position');

      if (error) throw error;

      if (data && data.length > 0) {
        setWidgets(data);
      } else {
        const defaultWidgets = [
          { widget_type: 'quick-stats', position: 0, is_visible: true },
          { widget_type: 'recent-reviews', position: 1, is_visible: true },
          { widget_type: 'orders-summary', position: 2, is_visible: true }
        ];

        for (const widget of defaultWidgets) {
          await supabase.from('dashboard_widgets').insert({
            admin_user_id: adminUserId,
            ...widget,
            settings: {}
          });
        }

        loadWidgets();
      }
    } catch (error) {
      console.error('Error loading widgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWidget = async (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    const { error } = await supabase
      .from('dashboard_widgets')
      .update({ is_visible: !widget.is_visible })
      .eq('id', widgetId);

    if (!error) {
      setWidgets(prev =>
        prev.map(w => w.id === widgetId ? { ...w, is_visible: !w.is_visible } : w)
      );
    }
  };

  const addWidget = async (widgetType: string) => {
    const maxPosition = Math.max(...widgets.map(w => w.position), -1);

    const { data, error } = await supabase
      .from('dashboard_widgets')
      .insert({
        admin_user_id: adminUserId,
        widget_type: widgetType,
        position: maxPosition + 1,
        is_visible: true,
        settings: {}
      })
      .select()
      .single();

    if (!error && data) {
      setWidgets(prev => [...prev, data]);
    }
  };

  const removeWidget = async (widgetId: string) => {
    const { error } = await supabase
      .from('dashboard_widgets')
      .delete()
      .eq('id', widgetId);

    if (!error) {
      setWidgets(prev => prev.filter(w => w.id !== widgetId));
    }
  };

  const renderWidget = (widget: Widget) => {
    if (!widget.is_visible) return null;

    const widgetType = widgetTypes.find(wt => wt.type === widget.widget_type);
    if (!widgetType) return null;

    switch (widget.widget_type) {
      case 'quick-stats':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              {widgetType.icon}
              <span className="ml-2">{widgetType.name}</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Услуги</p>
                <p className="text-2xl font-bold text-primary">{stats.totalServices || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Отзывы</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalReviews || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Рейтинг</p>
                <p className="text-2xl font-bold text-yellow-600">★ {stats.averageRating || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Посетители</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalVisitors || 0}</p>
              </div>
            </div>
          </div>
        );

      case 'recent-reviews':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              {widgetType.icon}
              <span className="ml-2">{widgetType.name}</span>
            </h3>
            <p className="text-gray-500">Последние отзывы появятся здесь</p>
          </div>
        );

      case 'orders-summary':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              {widgetType.icon}
              <span className="ml-2">{widgetType.name}</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Всего заказов</span>
                <span className="font-semibold">{stats.totalOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">В ожидании</span>
                <span className="font-semibold text-orange-600">{stats.pendingOrders || 0}</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              {widgetType.icon}
              <span className="ml-2">{widgetType.name}</span>
            </h3>
            <p className="text-gray-500">{widgetType.description}</p>
          </div>
        );
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Загрузка виджетов...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ваш дашборд</h2>
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>{isCustomizing ? 'Готово' : 'Настроить'}</span>
        </button>
      </div>

      {isCustomizing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
        >
          <h3 className="font-semibold text-gray-900 mb-3">Доступные виджеты</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {widgetTypes.map(widgetType => {
              const isAdded = widgets.some(w => w.widget_type === widgetType.type);
              return (
                <button
                  key={widgetType.type}
                  onClick={() => !isAdded && addWidget(widgetType.type)}
                  disabled={isAdded}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                    isAdded
                      ? 'border-green-300 bg-green-50 cursor-not-allowed'
                      : 'border-gray-300 hover:border-primary hover:bg-white'
                  }`}
                >
                  {widgetType.icon}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{widgetType.name}</div>
                    <div className="text-xs text-gray-500">{widgetType.description}</div>
                  </div>
                  {isAdded ? (
                    <span className="text-green-600 text-xs">✓ Добавлен</span>
                  ) : (
                    <Plus className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm">Ваши виджеты</h4>
            {widgets.map(widget => {
              const widgetType = widgetTypes.find(wt => wt.type === widget.widget_type);
              return (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    {widgetType?.icon}
                    <span className="text-sm font-medium">{widgetType?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleWidget(widget.id)}
                      className={`text-xs px-2 py-1 rounded ${
                        widget.is_visible
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {widget.is_visible ? 'Виден' : 'Скрыт'}
                    </button>
                    <button
                      onClick={() => removeWidget(widget.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets
          .filter(w => w.is_visible)
          .sort((a, b) => a.position - b.position)
          .map(widget => (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {renderWidget(widget)}
            </motion.div>
          ))}
      </div>
    </div>
  );
};
