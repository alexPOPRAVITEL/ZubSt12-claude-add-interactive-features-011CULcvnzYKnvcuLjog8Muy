import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Trash2, 
  Eye, 
  Edit3, 
  Save, 
  X, 
  Folder, 
  Image, 
  Video,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface MediaFile {
  id?: string;
  name: string;
  path: string;
  size?: number;
  type: 'image' | 'video';
  preview?: string;
  downloadUrl?: string;
  altText: string;
  caption: string;
  createdAt: string;
  modifiedAt: string;
  publicUrl: string;
}

interface Section {
  id: string;
  name: string;
  description: string;
}

interface MediaManagementProps {
  onBack: () => void;
}

export const MediaManagement: React.FC<MediaManagementProps> = ({ onBack }) => {
  const [sections] = useState<Section[]>([
    { id: 'general', name: 'Общие файлы', description: 'Логотипы, иконки, общие изображения' },
    { id: 'hero', name: 'Главная страница', description: 'Изображения и видео для главного блока' },
    { id: 'doctors', name: 'Врачи', description: 'Фотографии врачей и персонала' },
    { id: 'services', name: 'Услуги', description: 'Изображения для страницы услуг' },
    { id: 'portfolio', name: 'Портфолио', description: 'Фото работ "до/после"' },
    { id: 'blog', name: 'Блог', description: 'Изображения для статей блога' },
    { id: 'promotions', name: 'Акции', description: 'Изображения для акций и предложений' },
    { id: 'team', name: 'Команда', description: 'Фотографии команды' },
    { id: 'reviews', name: 'Отзывы', description: 'Аватары и изображения отзывов' },
    { id: 'subscriptions', name: 'Абонементы', description: 'Изображения для абонементов' },
    { id: 'marketplace', name: 'Магазин', description: 'Изображения товаров и услуг' }
  ]);
  
  const [activeSection, setActiveSection] = useState<string>('general');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFiles(activeSection);
  }, [activeSection]);

  const loadFiles = async (section: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/yandex-disk?action=list&section=${section}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401 || errorData.error?.includes('401')) {
          setError('Yandex.Disk не настроен. Обратитесь к администратору для настройки токена.');
        } else {
          setError(`Ошибка загрузки файлов: ${response.status}`);
        }
        setFiles([]);
        return;
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error loading files:', error);
      setError('Ошибка подключения к серверу');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', activeSection);
      formData.append('altText', '');
      formData.append('caption', '');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/yandex-disk?action=upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      await loadFiles(activeSection);
      alert('Файл успешно загружен!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Ошибка загрузки файла');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    if (!confirm(`Удалить файл "${fileName}"?`)) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/yandex-disk?action=delete`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            section: activeSection,
            fileName: fileName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      await loadFiles(activeSection);
      alert('Файл успешно удален!');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Ошибка удаления файла');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Неизвестно';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Управление медиафайлами</h1>
        <p className="text-gray-600">Загрузка и управление изображениями и видео для сайта</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with sections */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Folder className="w-5 h-5 mr-2 text-primary" />
              Разделы сайта
            </h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className={`text-xs ${
                    activeSection === section.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {section.description}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            {/* Section header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {sections.find(s => s.id === activeSection)?.name}
                </h2>
                <p className="text-gray-600">
                  {sections.find(s => s.id === activeSection)?.description}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => loadFiles(activeSection)}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Обновить</span>
                </button>
                <label className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Загрузка...' : 'Загрузить'}</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,video/*"
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-medium">Ошибка загрузки</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Files grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : files.length === 0 && !error ? (
              <div className="text-center py-12">
                <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет файлов</h3>
                <p className="text-gray-600">Загрузите первый файл в этот раздел</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.map((file, index) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    {/* File preview */}
                    <div className="relative mb-4">
                      {file.type === 'image' ? (
                        <img
                          src={file.preview || file.publicUrl || file.downloadUrl}
                          alt={file.altText || file.name}
                          className="w-full h-32 object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Video className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        {file.type === 'image' ? (
                          <Image className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
                        ) : (
                          <Video className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
                        )}
                      </div>
                    </div>

                    {/* File info */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      {file.altText && (
                        <p className="text-sm text-gray-600">
                          <strong>Alt:</strong> {file.altText}
                        </p>
                      )}
                      {file.caption && (
                        <p className="text-sm text-gray-600">
                          <strong>Подпись:</strong> {file.caption}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-2">
                        {file.publicUrl && (
                          <a
                            href={file.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 hover:text-primary transition-colors"
                            title="Просмотр"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => setEditingFile(file)}
                          className="p-2 text-gray-600 hover:text-primary transition-colors"
                          title="Редактировать"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteFile(file.name)}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit file modal */}
      {editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Редактировать файл</h3>
              <button
                onClick={() => setEditingFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Альтернативный текст
                </label>
                <input
                  type="text"
                  value={editingFile.altText}
                  onChange={(e) => setEditingFile({ ...editingFile, altText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="Описание изображения для SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Подпись
                </label>
                <textarea
                  value={editingFile.caption}
                  onChange={(e) => setEditingFile({ ...editingFile, caption: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="Подпись к изображению"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setEditingFile(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSaveFileInfo}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};