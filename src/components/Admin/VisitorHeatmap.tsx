import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, MousePointer, Eye, Clock } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface ClickEvent {
  x: number;
  y: number;
  timestamp: string;
  element: string;
  page: string;
}

interface VisitorHeatmapProps {
  onBack: () => void;
}

export const VisitorHeatmap: React.FC<VisitorHeatmapProps> = ({ onBack }) => {
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeatmapData();
    const interval = setInterval(loadHeatmapData, 10000);
    return () => clearInterval(interval);
  }, [selectedPage]);

  const loadHeatmapData = async () => {
    try {
      const { data: events, error } = await supabase
        .from('learning_analytics_events')
        .select('*')
        .eq('event_type', 'click')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;

      const clickEvents: ClickEvent[] = events?.map(e => ({
        x: e.event_data?.x || 0,
        y: e.event_data?.y || 0,
        timestamp: e.created_at,
        element: e.event_data?.element || '',
        page: e.event_data?.url || '/'
      })) || [];

      setClicks(clickEvents.filter(c => c.page.includes(selectedPage)));

      const { count } = await supabase
        .from('learning_analytics_events')
        .select('session_id', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

      setActiveUsers(count || 0);
    } catch (error) {
      console.error('Error loading heatmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHeatmapIntensity = (x: number, y: number, radius: number = 50): number => {
    return clicks.filter(click => {
      const distance = Math.sqrt(Math.pow(click.x - x, 0) + Math.pow(click.y - y, 2));
      return distance <= radius;
    }).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Тепловая карта посетителей</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Активных пользователей</p>
              <p className="text-4xl font-bold mt-2">{activeUsers}</p>
            </div>
            <Eye className="w-12 h-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Кликов за 24ч</p>
              <p className="text-4xl font-bold mt-2">{clicks.length}</p>
            </div>
            <MousePointer className="w-12 h-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Горячих зон</p>
              <p className="text-4xl font-bold mt-2">
                {clicks.filter(c => getHeatmapIntensity(c.x, c.y) > 10).length}
              </p>
            </div>
            <MapPin className="w-12 h-12 text-purple-200" />
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Выберите страницу
          </label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="/">Главная</option>
            <option value="/services">Услуги</option>
            <option value="/doctors">Врачи</option>
            <option value="/prices">Цены</option>
            <option value="/reviews">Отзывы</option>
            <option value="/marketplace">Магазин</option>
            <option value="/contacts">Контакты</option>
          </select>
        </div>

        <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            {clicks.map((click, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.4 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute w-8 h-8 rounded-full bg-red-500 blur-sm"
                style={{
                  left: `${(click.x / window.innerWidth) * 100}%`,
                  top: `${(click.y / window.innerHeight) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>

          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4" />
              <span>Данные за последние 24 часа</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 opacity-40"></div>
              <span className="text-xs text-gray-600">= клики пользователей</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Топ элементов</h3>
        <div className="space-y-3">
          {Array.from(new Set(clicks.map(c => c.element)))
            .slice(0, 10)
            .map((element, index) => {
              const count = clicks.filter(c => c.element === element).length;
              const percentage = (count / clicks.length) * 100;

              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{element || 'Unknown'}</span>
                      <span className="text-sm text-gray-500">{count} кликов</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
