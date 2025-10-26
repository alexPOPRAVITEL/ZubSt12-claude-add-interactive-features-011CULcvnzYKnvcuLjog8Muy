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
  FolderOpen,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { supabase, AppointmentServiceCategory } from '../../utils/supabase';

interface AppointmentCategoriesManagementProps {
  onBack: () => void;
}

export const AppointmentCategoriesManagement: React.FC<AppointmentCategoriesManagementProps> = ({ onBack }) => {
  const [categories, setCategories] = useState<AppointmentServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<AppointmentServiceCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    order_index: 0
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('appointment_service_categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const categoryData = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      if (editingCategory?.id) {
        // Update existing category
        const { error } = await supabase
          .from('appointment_service_categories')
          .update(categoryData)
          .eq('id', editingCategory.id);
        
        if (error) throw error;
        alert('Категория обновлена!');
      } else {
        // Create new category
        const { error } = await supabase
          .from('appointment_service_categories')
          .insert([categoryData]);
        
        if (error) throw error;
        alert('Категория создана!');
      }

      await loadCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Ошибка сохранения категории');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = (category: AppointmentServiceCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      order_index: category.order_index
    });
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Удалить категорию "${name}"? Все связанные услуги также будут удалены.`)) return;

    try {
      const { error } = await supabase
        .from('appointment_service_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadCategories();
      alert('Категория удалена!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Ошибка удаления категории');
    }
  };

  const moveCategory = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(cat => cat.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    try {
      const currentCategory = categories[currentIndex];
      const targetCategory = categories[targetIndex];

      // Swap order_index values
      await supabase
        .from('appointment_service_categories')
        .update({ order_index: targetCategory.order_index })
        .eq('id', currentCategory.id);

      await supabase
        .from('appointment_service_categories')
        .update({ order_index: currentCategory.order_index })
        .eq('id', targetCategory.id);

      await loadCategories();
    } catch (error) {
      console.error('Error moving category:', error);
      alert('Ошибка перемещения категории');
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData({
      name: '',
      order_index: 0
    });
    setError(null);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show form if creating or editing
  if (isCreating || editingCategory) {
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
            {editingCategory ? 'Редактировать категорию' : 'Создать категорию'}
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

        <form onSubmit={handleSaveCategory} className="max-w-lg space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название категории *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Например: Эстетическая стоматология"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Порядок отображения
            </label>
            <input
              type="number"
              min="0"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="0 = первая в списке"
            />
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
            <h1 className="text-2xl font-semibold text-gray-900">Категории услуг</h1>
            <span className="text-sm text-gray-500">Управление категориями для записи на прием</span>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить категорию
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

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск категорий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'Категории не найдены' : 'Нет категорий'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? 'Попробуйте изменить поисковый запрос' 
              : 'Создайте первую категорию услуг'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Создать первую категорию
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Порядок: {category.order_index}</span>
                    <span>
                      Создана: {new Date(category.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveCategory(category.id, 'up')}
                    disabled={index === 0}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Переместить вверх"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveCategory(category.id, 'down')}
                    disabled={index === filteredCategories.length - 1}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Переместить вниз"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Удалить"
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