import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Settings, Globe, Mail, Phone, MapPin, Clock, Palette } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface SiteSettingsProps {
  onBack: () => void;
}

interface SiteSetting {
  id: string;
  key: string;
  value: any;
  updated_at: string;
}

export function SiteSettings({ onBack }: SiteSettingsProps) {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    site_title: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    working_hours: '',
    primary_color: '#3B82F6',
    secondary_color: '#10B981',
    social_vk: '',
    social_telegram: '',
    social_instagram: '',
    analytics_enabled: true,
    maintenance_mode: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      setSettings(data || []);
      
      // Populate form with existing settings
      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as any) || {};

      setFormData(prev => ({
        ...prev,
        ...settingsMap
      }));
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update each setting
      for (const [key, value] of Object.entries(formData)) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            key,
            value,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'key'
          });

        if (error) throw error;
      }

      alert('Настройки успешно сохранены!');
      loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад к дашборду</span>
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Настройки сайта</h2>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* General Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-800">Основные настройки</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название сайта
                </label>
                <input
                  type="text"
                  value={formData.site_title}
                  onChange={(e) => handleInputChange('site_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Зубная станция"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание сайта
                </label>
                <textarea
                  value={formData.site_description}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Современная стоматологическая клиника..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-800">Контактная информация</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="info@zubst.ru"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="г. Москва, ул. Примерная, д. 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Часы работы
                </label>
                <input
                  type="text"
                  value={formData.working_hours}
                  onChange={(e) => handleInputChange('working_hours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-18:00"
                />
              </div>
            </div>
          </div>

          {/* Design Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-800">Дизайн</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Основной цвет
                </label>
                <input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дополнительный цвет
                </label>
                <input
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Социальные сети</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ВКонтакте
                </label>
                <input
                  type="url"
                  value={formData.social_vk}
                  onChange={(e) => handleInputChange('social_vk', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://vk.com/your_page"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telegram
                </label>
                <input
                  type="url"
                  value={formData.social_telegram}
                  onChange={(e) => handleInputChange('social_telegram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://t.me/your_channel"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.social_instagram}
                  onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/your_account"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Системные настройки</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Аналитика
                  </label>
                  <p className="text-sm text-gray-500">Включить сбор статистики посещений</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.analytics_enabled}
                  onChange={(e) => handleInputChange('analytics_enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Режим обслуживания
                  </label>
                  <p className="text-sm text-gray-500">Временно закрыть сайт для посетителей</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.maintenance_mode}
                  onChange={(e) => handleInputChange('maintenance_mode', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}