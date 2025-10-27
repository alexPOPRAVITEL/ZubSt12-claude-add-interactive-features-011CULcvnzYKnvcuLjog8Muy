import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  Eye,
  TrendingUp,
  Calendar,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  weeklyGrowth: number;
  topPages: Array<{ page: string; views: number }>;
  deviceStats: Array<{ device: string; count: number }>;
  sourceStats: Array<{ source: string; count: number }>;
}

interface AnalyticsManagementProps {
  onBack: () => void;
}

export const AnalyticsManagement: React.FC<AnalyticsManagementProps> = ({ onBack }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisitors: 0,
    todayVisitors: 0,
    weeklyGrowth: 0,
    topPages: [],
    deviceStats: [],
    sourceStats: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load visitors data
      const { data: visitors, error } = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process analytics data
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const todayVisitors = visitors?.filter(v => 
        new Date(v.created_at) >= todayStart
      ).length || 0;

      const deviceStats = visitors?.reduce((acc: any[], visitor) => {
        const device = visitor.platform?.includes('Mobile') ? 'Mobile' : 
                     visitor.platform?.includes('Mac') ? 'Mac' : 'PC';
        const existing = acc.find(d => d.device === device);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ device, count: 1 });
        }
        return acc;
      }, []) || [];

      const sourceStats = visitors?.reduce((acc: any[], visitor) => {
        const source = visitor.source || 'web';
        const existing = acc.find(s => s.source === source);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ source, count: 1 });
        }
        return acc;
      }, []) || [];

      setAnalytics({
        totalVisitors: visitors?.length || 0,
        todayVisitors,
        weeklyGrowth: 15, // Mock data
        topPages: [
          { page: '/', views: 1250 },
          { page: '/services', views: 890 },
          { page: '/doctors', views: 650 },
          { page: '/prices', views: 540 }
        ],
        deviceStats,
        sourceStats
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const dateRangeOptions = [
    { value: '1d', label: 'Сегодня' },
    { value: '7d', label: '7 дней' },
    { value: '30d', label: '30 дней' },
    { value: '90d', label: '3 месяца' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Аналитика</h1>
            <span className="text-sm text-gray-500">Статистика посещений и поведения</span>
          </div>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
        >
          {dateRangeOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего посетителей</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalVisitors}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Сегодня</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.todayVisitors}</p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Рост за неделю</p>
                  <p className="text-2xl font-bold text-gray-900">+{analytics.weeklyGrowth}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Конверсия</p>
                  <p className="text-2xl font-bold text-gray-900">12.5%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Pages */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Популярные страницы</h3>
              <div className="space-y-3">
                {analytics.topPages.map((page, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{page.page}</span>
                    <span className="font-semibold">{page.views}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Устройства</h3>
              <div className="space-y-3">
                {analytics.deviceStats.map((device, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      {device.device === 'Mobile' ? <Smartphone className="w-4 h-4 mr-2" /> : <Monitor className="w-4 h-4 mr-2" />}
                      <span className="text-gray-700">{device.device}</span>
                    </div>
                    <span className="font-semibold">{device.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};