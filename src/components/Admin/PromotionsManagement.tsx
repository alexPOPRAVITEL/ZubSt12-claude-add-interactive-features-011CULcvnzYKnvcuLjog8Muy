import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Search, CreditCard as Edit, Trash2, Eye, Gift, Calendar, DollarSign, Save, X } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface Promotion {
  id: string;
  title: string;
  description: string;
  badge?: string;
  old_price?: number;
  new_price: string;
  validity?: string;
  image?: string;
  featured: boolean;
  category?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface PromotionsManagementProps {
  onBack: () => void;
}

export const PromotionsManagement: React.FC<PromotionsManagementProps> = ({ onBack }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePromotion = async (promoData: Partial<Promotion>) => {
    try {
      // Валидация обязательных полей
      if (!promoData.title || !promoData.title.trim()) {
        alert('Название акции обязательно');
        return;
      }

      if (!promoData.description || !promoData.description.trim()) {
        alert('Описание акции обязательно');
        return;
      }

      if (!promoData.new_price || !promoData.new_price.trim()) {
        alert('Новая цена обязательна');
        return;
      }

      const cleanData = {
        ...promoData,
        title: promoData.title.trim(),
        description: promoData.description.trim(),
        new_price: promoData.new_price.trim(),
        updated_at: new Date().toISOString()
      };

      if (editingPromo?.id) {
        const { error } = await supabase
          .from('promotions')
          .update(cleanData)
          .eq('id', editingPromo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert([cleanData]);

        if (error) throw error;
      }

      await loadPromotions();
      setEditingPromo(null);
      setIsCreating(false);
      alert('Акция сохранена!');
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert(`Ошибка сохранения акции: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (!confirm('Удалить акцию?')) return;

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadPromotions();
      alert('Акция удалена!');
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert('Ошибка удаления акции');
    }
  };

  const filteredPromotions = promotions.filter(promo =>
    promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (editingPromo || isCreating) {
    return <PromotionEditor 
      promotion={editingPromo} 
      onSave={handleSavePromotion} 
      onCancel={() => {
        setEditingPromo(null);
        setIsCreating(false);
      }}
    />;
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
            <h1 className="text-2xl font-semibold text-gray-900">Управление акциями</h1>
            <span className="text-sm text-gray-500">Создание и редактирование акций</span>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Создать акцию
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск акций..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Promotions Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{promo.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{promo.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-primary">{promo.new_price}</div>
                {promo.old_price && (
                  <div className="text-sm text-gray-400 line-through">
                    {promo.old_price.toLocaleString()} ₽
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  promo.is_published ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {promo.is_published ? 'Активна' : 'Неактивна'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPromo(promo)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePromotion(promo.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Promotion Editor Component
const PromotionEditor: React.FC<{
  promotion: Promotion | null;
  onSave: (data: Partial<Promotion>) => void;
  onCancel: () => void;
}> = ({ promotion, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: promotion?.title || '',
    description: promotion?.description || '',
    badge: promotion?.badge || '',
    old_price: promotion?.old_price || 0,
    new_price: promotion?.new_price || '',
    validity: promotion?.validity || '',
    image: promotion?.image || '',
    featured: promotion?.featured || false,
    category: promotion?.category || '',
    is_published: promotion?.is_published || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {promotion ? 'Редактировать акцию' : 'Создать акцию'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название акции *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Старая цена (₽)
            </label>
            <input
              type="number"
              value={formData.old_price}
              onChange={(e) => setFormData({ ...formData, old_price: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Новая цена *
            </label>
            <input
              type="text"
              required
              value={formData.new_price}
              onChange={(e) => setFormData({ ...formData, new_price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="1500₽ или БЕСПЛАТНО"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Срок действия
          </label>
          <input
            type="text"
            value={formData.validity}
            onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="до 31 декабря 2024"
          />
        </div>

        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="ml-2 text-sm text-gray-700">Рекомендуемая акция</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="ml-2 text-sm text-gray-700">Опубликовать</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};