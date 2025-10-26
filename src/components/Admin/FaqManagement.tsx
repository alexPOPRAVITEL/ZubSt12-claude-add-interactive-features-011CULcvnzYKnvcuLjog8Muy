import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save,
  X,
  HelpCircle,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface FaqManagementProps {
  onBack: () => void;
}

export const FaqManagement: React.FC<FaqManagementProps> = ({ onBack }) => {
  const [faqEntries, setFaqEntries] = useState<FaqEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingEntry, setEditingEntry] = useState<FaqEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Все категории', icon: '📋' },
    { id: 'general', label: 'Общие вопросы о клинике', icon: '🏥' },
    { id: 'services', label: 'Услуги и лечение', icon: '🦷' },
    { id: 'pricing', label: 'Цены и оплата', icon: '💰' },
    { id: 'appointment', label: 'Запись на прием', icon: '📅' },
    { id: 'prevention', label: 'Профилактика и уход', icon: '✨' },
    { id: 'children', label: 'Детская стоматология', icon: '👶' },
    { id: 'emergency', label: 'Экстренные случаи', icon: '🚨' }
  ];

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    order_index: 0,
    is_published: true
  });

  useEffect(() => {
    loadFaqEntries();
  }, []);

  const loadFaqEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('faq_entries')
        .select('*')
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFaqEntries(data || []);
    } catch (error) {
      console.error('Error loading FAQ entries:', error);
      setError('Ошибка загрузки FAQ записей');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const faqData = {
        ...formData,
        category: formData.category || null,
        updated_at: new Date().toISOString()
      };

      if (editingEntry?.id) {
        // Update existing entry
        const { error } = await supabase
          .from('faq_entries')
          .update(faqData)
          .eq('id', editingEntry.id);
        
        if (error) throw error;
        alert('FAQ запись обновлена!');
      } else {
        // Create new entry
        const { error } = await supabase
          .from('faq_entries')
          .insert([faqData]);
        
        if (error) throw error;
        alert('FAQ запись создана!');
      }

      await loadFaqEntries();
      resetForm();
    } catch (error) {
      console.error('Error saving FAQ entry:', error);
      setError('Ошибка сохранения FAQ записи');
    } finally {
      setSaving(false);
    }
  };

  const handleEditEntry = (entry: FaqEntry) => {
    setEditingEntry(entry);
    setFormData({
      question: entry.question,
      answer: entry.answer,
      category: entry.category || 'general',
      order_index: entry.order_index,
      is_published: entry.is_published
    });
  };

  const handleDeleteEntry = async (id: string, question: string) => {
    if (!confirm(`Удалить вопрос "${question.substring(0, 50)}..."?`)) return;

    try {
      const { error } = await supabase
        .from('faq_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadFaqEntries();
      alert('FAQ запись удалена!');
    } catch (error) {
      console.error('Error deleting FAQ entry:', error);
      alert('Ошибка удаления FAQ записи');
    }
  };

  const toggleEntryStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('faq_entries')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await loadFaqEntries();
    } catch (error) {
      console.error('Error updating FAQ entry status:', error);
      alert('Ошибка обновления статуса');
    }
  };

  const resetForm = () => {
    setEditingEntry(null);
    setIsCreating(false);
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      order_index: 0,
      is_published: true
    });
    setError(null);
  };

  const filteredEntries = faqEntries.filter(entry => {
    const matchesSearch = entry.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalEntries = faqEntries.length;
  const publishedEntries = faqEntries.filter(e => e.is_published).length;
  const categoriesWithEntries = [...new Set(faqEntries.map(e => e.category).filter(Boolean))].length;

  // Show form if creating or editing
  if (isCreating || editingEntry) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={resetForm}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {editingEntry ? 'Редактировать FAQ' : 'Создать FAQ'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Ошибка</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveFaq} className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                {categories.filter(cat => cat.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Порядок отображения
              </label>
              <input
                type="number"
                min="0"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="0 = первый"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Вопрос *
            </label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Например: Больно ли лечить кариес?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ответ *
            </label>
            <textarea
              required
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Подробный ответ на вопрос..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Совет: Начните ответ с самой важной информации для лучшего отображения в поисковых системах
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="is_published" className="ml-2 text-sm text-gray-700">
              Опубликовать на сайте
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

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
            <h1 className="text-2xl font-semibold text-gray-900">Управление FAQ</h1>
            <span className="text-sm text-gray-500">Часто задаваемые вопросы</span>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить вопрос
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Ошибка</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего вопросов</p>
              <p className="text-2xl font-bold text-gray-900">{totalEntries}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Опубликованных</p>
              <p className="text-2xl font-bold text-gray-900">{publishedEntries}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Категорий</p>
              <p className="text-2xl font-bold text-gray-900">{categoriesWithEntries}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по вопросам и ответам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQ Entries List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">❓</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || selectedCategory !== 'all' ? 'Вопросы не найдены' : 'Нет вопросов'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Попробуйте изменить фильтры или поисковый запрос' 
              : 'Создайте первый вопрос для FAQ раздела'}
          </p>
          {!searchQuery && selectedCategory === 'all' && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Создать первый вопрос
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg">
                      {categories.find(cat => cat.id === entry.category)?.icon || '❓'}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {entry.question}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {categories.find(cat => cat.id === entry.category)?.label || 'Без категории'}
                        </span>
                        <span>Порядок: {entry.order_index}</span>
                        <span>
                          {new Date(entry.updated_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {entry.answer.length > 200 
                      ? `${entry.answer.substring(0, 200)}...` 
                      : entry.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleEntryStatus(entry.id, entry.is_published)}
                    className={`p-2 transition-colors ${
                      entry.is_published 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={entry.is_published ? 'Скрыть' : 'Опубликовать'}
                  >
                    {entry.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEditEntry(entry)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id, entry.question)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  entry.is_published ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {entry.is_published ? 'Опубликован' : 'Черновик'}
                </span>
                <div className="text-xs text-gray-500">
                  ID: {entry.id.slice(-8)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};