import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  FileText,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Image as ImageIcon,
  Link as LinkIcon,
  Type
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface ContentManagementProps {
  onBack: () => void;
}

interface ContentSection {
  id: string;
  section: string;
  content: any;
  is_published: boolean;
  updated_at: string;
}

const CONTENT_SECTIONS = [
  {
    id: 'hero',
    label: 'Hero секция (главная)',
    fields: [
      { key: 'title', label: 'Заголовок', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'buttonText', label: 'Текст кнопки', type: 'text' },
      { key: 'imageUrl', label: 'URL изображения', type: 'text' }
    ]
  },
  {
    id: 'safety',
    label: 'Безопасность и Совершенство',
    fields: [
      { key: 'title', label: 'Заголовок', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'feature1_title', label: 'Особенность 1 - Заголовок', type: 'text' },
      { key: 'feature1_text', label: 'Особенность 1 - Текст', type: 'textarea' },
      { key: 'feature2_title', label: 'Особенность 2 - Заголовок', type: 'text' },
      { key: 'feature2_text', label: 'Особенность 2 - Текст', type: 'textarea' },
      { key: 'feature3_title', label: 'Особенность 3 - Заголовок', type: 'text' },
      { key: 'feature3_text', label: 'Особенность 3 - Текст', type: 'textarea' }
    ]
  },
  {
    id: 'advantages',
    label: 'Преимущества',
    fields: [
      { key: 'title', label: 'Заголовок секции', type: 'text' },
      { key: 'advantage1_title', label: 'Преимущество 1 - Заголовок', type: 'text' },
      { key: 'advantage1_text', label: 'Преимущество 1 - Текст', type: 'textarea' },
      { key: 'advantage2_title', label: 'Преимущество 2 - Заголовок', type: 'text' },
      { key: 'advantage2_text', label: 'Преимущество 2 - Текст', type: 'textarea' },
      { key: 'advantage3_title', label: 'Преимущество 3 - Заголовок', type: 'text' },
      { key: 'advantage3_text', label: 'Преимущество 3 - Текст', type: 'textarea' },
      { key: 'advantage4_title', label: 'Преимущество 4 - Заголовок', type: 'text' },
      { key: 'advantage4_text', label: 'Преимущество 4 - Текст', type: 'textarea' }
    ]
  },
  {
    id: 'footer',
    label: 'Footer (подвал сайта)',
    fields: [
      { key: 'about_text', label: 'О клинике (текст)', type: 'textarea' },
      { key: 'address', label: 'Адрес', type: 'text' },
      { key: 'phone', label: 'Телефон', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'vk_link', label: 'Ссылка VK', type: 'text' },
      { key: 'telegram_link', label: 'Ссылка Telegram', type: 'text' },
      { key: 'instagram_link', label: 'Ссылка Instagram', type: 'text' },
      { key: 'whatsapp_link', label: 'Ссылка WhatsApp', type: 'text' }
    ]
  },
  {
    id: 'contact',
    label: 'Контактная информация',
    fields: [
      { key: 'title', label: 'Заголовок', type: 'text' },
      { key: 'address_full', label: 'Полный адрес', type: 'textarea' },
      { key: 'working_hours', label: 'Часы работы', type: 'textarea' },
      { key: 'phone_main', label: 'Основной телефон', type: 'text' },
      { key: 'phone_additional', label: 'Дополнительный телефон', type: 'text' },
      { key: 'email_main', label: 'Основной email', type: 'text' }
    ]
  },
  {
    id: 'mission',
    label: 'Миссия клиники',
    fields: [
      { key: 'title', label: 'Заголовок', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'text' },
      { key: 'mission_text', label: 'Текст миссии', type: 'textarea' },
      { key: 'values_title', label: 'Наши ценности - Заголовок', type: 'text' },
      { key: 'value1', label: 'Ценность 1', type: 'text' },
      { key: 'value2', label: 'Ценность 2', type: 'text' },
      { key: 'value3', label: 'Ценность 3', type: 'text' }
    ]
  }
];

export const ContentManagement: React.FC<ContentManagementProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState(CONTENT_SECTIONS[0].id);
  const [contentData, setContentData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (error) throw error;

      const contentMap: Record<string, any> = {};
      data?.forEach((item: ContentSection) => {
        contentMap[item.section] = item.content || {};
      });

      setContentData(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
      setError('Ошибка загрузки контента');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const currentSection = selectedSection;
      const currentContent = contentData[currentSection] || {};

      const { error } = await supabase
        .from('site_content')
        .upsert({
          section: currentSection,
          content: currentContent,
          is_published: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;

      alert('Контент успешно сохранен!');
      await loadContent();
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Ошибка сохранения контента');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setContentData(prev => ({
      ...prev,
      [selectedSection]: {
        ...(prev[selectedSection] || {}),
        [key]: value
      }
    }));
  };

  const currentSectionConfig = CONTENT_SECTIONS.find(s => s.id === selectedSection);
  const currentSectionData = contentData[selectedSection] || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <span>{saving ? 'Сохранение...' : 'Сохранить изменения'}</span>
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Управление контентом страниц</h2>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Редактируйте тексты, заголовки и ссылки на всех страницах сайта
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Выберите секцию</h3>
            {CONTENT_SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedSection === section.id
                    ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {currentSectionConfig?.label}
              </h3>
              <p className="text-sm text-gray-600">
                Редактируйте содержимое этой секции
              </p>
            </div>

            <div className="space-y-4">
              {currentSectionConfig?.fields.map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    {field.type === 'text' && <Type className="w-4 h-4" />}
                    {field.type === 'textarea' && <FileText className="w-4 h-4" />}
                    {field.key.includes('link') && <LinkIcon className="w-4 h-4" />}
                    {field.key.includes('image') && <ImageIcon className="w-4 h-4" />}
                    <span>{field.label}</span>
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      value={currentSectionData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={`Введите ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={currentSectionData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={`Введите ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Предварительный просмотр</p>
                  <p className="text-blue-700">
                    Изменения вступят в силу сразу после сохранения. Обновите страницу сайта, чтобы увидеть результат.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
