import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Search, Trash2, Save, X, Upload, Loader2, Eye, EyeOff, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface HeroStory {
  id: string;
  url: string;
  type: 'image' | 'video';
  order_index: number;
  is_active: boolean;
  title?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface HeroStoriesManagementProps {
  onBack: () => void;
}

export const HeroStoriesManagement: React.FC<HeroStoriesManagementProps> = ({ onBack }) => {
  const [stories, setStories] = useState<HeroStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStory, setEditingStory] = useState<HeroStory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    url: '',
    type: 'image' as 'image' | 'video',
    title: '',
    description: '',
    is_active: true,
    order_index: 0
  });

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('hero_stories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error loading hero stories:', error);
      setError('Ошибка загрузки историй');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadingImage(true);
      setError(null);

      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('section', 'hero');
        formDataUpload.append('altText', formData.title || 'Hero Story');
        formDataUpload.append('caption', formData.description || 'Hero Story Image');

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/yandex-disk?action=upload`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: formDataUpload,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const result = await response.json();
        setFormData(prev => ({ ...prev, url: result.file.public_url }));
        alert('Изображение успешно загружено!');
      } catch (err) {
        console.error('Error uploading image:', err);
        setError(`Ошибка загрузки изображения: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.url || !formData.url.trim()) {
        setError('URL изображения/видео обязателен');
        setSaving(false);
        return;
      }

      let finalFormData = { ...formData };
      if (!editingStory?.id) {
        const maxOrder = stories.length > 0 ? Math.max(...stories.map(s => s.order_index || 0)) : -1;
        finalFormData.order_index = maxOrder + 1;
      }

      const storyData = {
        url: formData.url.trim(),
        type: formData.type,
        title: formData.title && formData.title.trim() ? formData.title.trim() : null,
        description: formData.description && formData.description.trim() ? formData.description.trim() : null,
        is_active: formData.is_active,
        order_index: finalFormData.order_index,
        updated_at: new Date().toISOString()
      };

      if (editingStory?.id) {
        const { error } = await supabase
          .from('hero_stories')
          .update(storyData)
          .eq('id', editingStory.id);

        if (error) throw error;
        alert('История обновлена!');
      } else {
        const { error } = await supabase
          .from('hero_stories')
          .insert([storyData]);

        if (error) throw error;
        alert('История создана!');
      }

      await loadStories();
      resetForm();
    } catch (error) {
      console.error('Error saving story:', error);
      setError(`Ошибка сохранения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditStory = (story: HeroStory) => {
    setEditingStory(story);
    setFormData({
      url: story.url,
      type: story.type,
      title: story.title || '',
      description: story.description || '',
      is_active: story.is_active,
      order_index: story.order_index
    });
  };

  const handleDeleteStory = async (id: string, title: string) => {
    if (!confirm(`Удалить историю "${title || 'Без названия'}"?`)) return;

    try {
      const { error } = await supabase
        .from('hero_stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadStories();
      alert('История удалена!');
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Ошибка удаления истории');
    }
  };

  const toggleStoryStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_stories')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await loadStories();
    } catch (error) {
      console.error('Error updating story status:', error);
      alert('Ошибка обновления статуса');
    }
  };

  const moveStory = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = stories.findIndex(story => story.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= stories.length) return;

    try {
      const currentStory = stories[currentIndex];
      const targetStory = stories[targetIndex];

      await supabase
        .from('hero_stories')
        .update({ order_index: targetStory.order_index })
        .eq('id', currentStory.id);

      await supabase
        .from('hero_stories')
        .update({ order_index: currentStory.order_index })
        .eq('id', targetStory.id);

      await loadStories();
    } catch (error) {
      console.error('Error moving story:', error);
      alert('Ошибка перемещения истории');
    }
  };

  const resetForm = () => {
    setEditingStory(null);
    setIsCreating(false);
    setFormData({
      url: '',
      type: 'image',
      title: '',
      description: '',
      is_active: true,
      order_index: 0
    });
    setError(null);
  };

  // Show form if creating or editing
  if (isCreating || editingStory) {
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
            {editingStory ? 'Редактировать историю' : 'Создать историю'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSaveStory} className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип контента *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="image">Изображение</option>
              <option value="video">Видео</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.type === 'image' ? 'Изображение' : 'URL видео'} *
            </label>
            {formData.type === 'image' ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'Загрузка...' : 'Загрузить изображение'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  {formData.url && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, url: '' })}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Удалить
                    </button>
                  )}
                </div>
                {formData.url && (
                  <div className="mt-3">
                    <img
                      src={formData.url}
                      alt="Preview"
                      className="w-full max-w-md rounded-lg border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="https://example.com/video.mp4"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название (необязательно)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Название истории..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание (необязательно)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Описание истории..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
              Активная история (отображается в карусели)
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
              disabled={saving || uploadingImage}
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Управление Hero Stories</h1>
            <span className="text-sm text-gray-500">Карусель на главной странице</span>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить историю
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Нет историй</h3>
          <p className="text-gray-600 mb-4">Создайте первую историю для карусели</p>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Создать историю
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                {story.type === 'image' ? (
                  <img
                    src={story.url}
                    alt={story.title || 'Hero Story'}
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Видео</p>
                    </div>
                  </div>
                )}
              </div>

              {story.title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{story.title}</h3>
              )}
              {story.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{story.description}</p>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  story.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {story.is_active ? 'Активна' : 'Неактивна'}
                </span>
                <span className="text-xs text-gray-500">
                  Порядок: {story.order_index}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <button
                    onClick={() => moveStory(story.id, 'up')}
                    disabled={index === 0}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Переместить вверх"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveStory(story.id, 'down')}
                    disabled={index === stories.length - 1}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Переместить вниз"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => toggleStoryStatus(story.id, story.is_active)}
                    className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                    title={story.is_active ? 'Скрыть' : 'Показать'}
                  >
                    {story.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEditStory(story)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Редактировать"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStory(story.id, story.title || 'Без названия')}
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
