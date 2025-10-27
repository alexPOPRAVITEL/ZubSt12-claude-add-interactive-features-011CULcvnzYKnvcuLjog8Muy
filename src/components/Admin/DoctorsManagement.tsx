import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Search, CreditCard as Edit, Trash2, Save, X, User, Upload, Calendar, Loader2, CheckCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { ImageCropperModal } from '../ImageCropperModal';

interface DoctorButton {
  label: string;
  action_type: 'appointment' | 'blog' | 'link';
  target_value: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  education?: string;
  photo_url?: string;
  bio?: string;
  phone?: string;
  email?: string;
  schedule?: string;
  is_active: boolean;
  quote?: string;
  achievements?: string[];
  buttons?: DoctorButton[];
  service_categories?: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface DoctorsManagementProps {
  onBack: () => void;
}

export const DoctorsManagement: React.FC<DoctorsManagementProps> = ({ onBack }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image cropping states
  const [isCropperModalOpen, setIsCropperModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState('');
  const [currentFileName, setCurrentFileName] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Appointment categories for button configuration
  const [appointmentCategories, setAppointmentCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience_years: 0,
    education: '',
    photo_url: '',
    bio: '',
    phone: '',
    email: '',
    schedule: '',
    is_active: true,
    quote: '',
    achievements: [] as string[],
    buttons: [] as DoctorButton[],
    service_categories: [] as string[],
    order_index: 0
  });

  useEffect(() => {
    loadDoctors();
    loadAppointmentCategories();
  }, []);

  const loadAppointmentCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_service_categories')
        .select('id, name')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setAppointmentCategories(data || []);
    } catch (error) {
      console.error('Error loading appointment categories:', error);
    }
  };

  const loadDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setError('Ошибка загрузки врачей');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Валидация обязательных полей
      if (!formData.name || !formData.name.trim()) {
        setError('Имя врача обязательно');
        setSaving(false);
        return;
      }

      if (!formData.specialization || !formData.specialization.trim()) {
        setError('Специализация обязательна');
        setSaving(false);
        return;
      }

      if (!formData.experience_years || formData.experience_years <= 0) {
        setError('Укажите опыт работы (должен быть больше 0)');
        setSaving(false);
        return;
      }

      // If creating new doctor, set order_index to be last
      let finalFormData = { ...formData };
      if (!editingDoctor?.id) {
        const maxOrder = doctors.length > 0 ? Math.max(...doctors.map(d => d.order_index || 0)) : -1;
        finalFormData.order_index = maxOrder + 1;
      }

      const doctorData = {
        name: formData.name.trim(),
        specialization: formData.specialization.trim(),
        experience_years: formData.experience_years,
        education: formData.education && formData.education.trim() ? formData.education.trim() : null,
        photo_url: formData.photo_url && formData.photo_url.trim() ? formData.photo_url.trim() : null,
        bio: formData.bio && formData.bio.trim() ? formData.bio.trim() : null,
        phone: formData.phone && formData.phone.trim() ? formData.phone.trim() : null,
        email: formData.email && formData.email.trim() ? formData.email.trim() : null,
        schedule: formData.schedule && formData.schedule.trim() ? formData.schedule.trim() : null,
        quote: formData.quote && formData.quote.trim() ? formData.quote.trim() : null,
        is_active: formData.is_active,
        achievements: formData.achievements.length > 0 ? formData.achievements : null,
        buttons: formData.buttons.length > 0 ? formData.buttons : null,
        service_categories: formData.service_categories.length > 0 ? formData.service_categories : null,
        order_index: finalFormData.order_index,
        updated_at: new Date().toISOString()
      };

      if (editingDoctor?.id) {
        // Update existing doctor
        const { error } = await supabase
          .from('doctors')
          .update(doctorData)
          .eq('id', editingDoctor.id);

        if (error) throw error;
        alert('Врач обновлен!');
      } else {
        // Create new doctor
        const { error } = await supabase
          .from('doctors')
          .insert([doctorData]);

        if (error) throw error;
        alert('Врач добавлен!');
      }

      await loadDoctors();
      resetForm();
    } catch (error) {
      console.error('Error saving doctor:', error);
      setError(`Ошибка сохранения врача: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      experience_years: doctor.experience_years,
      education: doctor.education || '',
      photo_url: doctor.photo_url || '',
      bio: doctor.bio || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      schedule: doctor.schedule || '',
      is_active: doctor.is_active,
      quote: doctor.quote || '',
      achievements: doctor.achievements || [],
      buttons: doctor.buttons || [],
      service_categories: doctor.service_categories || [],
      order_index: doctor.order_index
    });
  };

  const handleDeleteDoctor = async (id: string, name: string) => {
    if (!confirm(`Удалить врача "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadDoctors();
      alert('Врач удален!');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Ошибка удаления врача');
    }
  };

  const toggleDoctorStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await loadDoctors();
    } catch (error) {
      console.error('Error updating doctor status:', error);
      alert('Ошибка обновления статуса');
    }
  };

  const moveDoctor = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = doctors.findIndex(doctor => doctor.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= doctors.length) return;

    try {
      const currentDoctor = doctors[currentIndex];
      const targetDoctor = doctors[targetIndex];

      // Swap order_index values
      await supabase
        .from('doctors')
        .update({ order_index: targetDoctor.order_index })
        .eq('id', currentDoctor.id);

      await supabase
        .from('doctors')
        .update({ order_index: currentDoctor.order_index })
        .eq('id', targetDoctor.id);

      await loadDoctors();
    } catch (error) {
      console.error('Error moving doctor:', error);
      alert('Ошибка перемещения врача');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCurrentFileName(file.name);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageToCrop(reader.result as string);
        setIsCropperModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleEditExistingPhoto = async () => {
    if (!formData.photo_url) return;
    
    setUploadingImage(true);
    try {
      // Загружаем существующее изображение как blob
      const response = await fetch(formData.photo_url);
      if (!response.ok) throw new Error('Failed to fetch existing image');
      
      const blob = await response.blob();
      
      // Преобразуем blob в data URL для редактора
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCurrentFileName(`edited_${formData.name.replace(/\s+/g, '_').toLowerCase()}.jpg`);
        setIsCropperModalOpen(true);
        setUploadingImage(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error loading existing image for editing:', error);
      setError('Ошибка загрузки изображения для редактирования');
      setUploadingImage(false);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob, originalFileName: string) => {
    setUploadingImage(true);
    setError(null);
    try {
      const file = new File([croppedImageBlob], originalFileName, { type: croppedImageBlob.type });
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('section', 'doctors');
      formDataUpload.append('altText', formData.name || 'Фотография врача');
      formDataUpload.append('caption', `Фотография врача ${formData.name}`);

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
      setFormData(prev => ({ ...prev, photo_url: result.file.public_url }));
      alert('Фотография успешно загружена и обрезана!');
    } catch (err) {
      console.error('Error uploading cropped image:', err);
      setError(`Ошибка загрузки фотографии: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploadingImage(false);
      setIsCropperModalOpen(false);
    }
  };

  const resetForm = () => {
    setEditingDoctor(null);
    setIsCreating(false);
    setFormData({
      name: '',
      specialization: '',
      experience_years: 0,
      education: '',
      photo_url: '',
      bio: '',
      phone: '',
      email: '',
      schedule: '',
      is_active: true,
      quote: '',
      achievements: [],
      buttons: [],
      service_categories: [],
      order_index: 0
    });
    setError(null);
    setImageToCrop('');
    setCurrentFileName('');
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, '']
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData({
      ...formData,
      achievements: newAchievements
    });
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index)
    });
  };

  const addButton = () => {
    setFormData({
      ...formData,
      buttons: [...formData.buttons, { label: '', action_type: 'appointment', target_value: '' }]
    });
  };

  const updateButton = (index: number, field: keyof DoctorButton, value: string) => {
    const newButtons = [...formData.buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setFormData({
      ...formData,
      buttons: newButtons
    });
  };

  const removeButton = (index: number) => {
    setFormData({
      ...formData,
      buttons: formData.buttons.filter((_, i) => i !== index)
    });
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalDoctors = doctors.length;
  const activeDoctors = doctors.filter(d => d.is_active).length;
  const avgExperience = doctors.length > 0 
    ? Math.round(doctors.reduce((sum, d) => sum + d.experience_years, 0) / doctors.length)
    : 0;

  // Show form if creating or editing
  if (isCreating || editingDoctor) {
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
            {editingDoctor ? 'Редактировать врача' : 'Добавить врача'}
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

        <form onSubmit={handleSaveDoctor} className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя врача *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Фамилия Имя Отчество"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Специализация *
              </label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Стоматолог-терапевт"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Опыт работы (лет) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон (необязательно)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Личный номер врача (если есть)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Оставьте пустым, если врач использует общий номер клиники
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (необязательно)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Личный email врача (если есть)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Образование
            </label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="МГМСУ им. А.И. Евдокимова"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Фотография врача
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingImage ? 'Загрузка...' : 'Загрузить фото'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
                {formData.photo_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photo_url: '' })}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Удалить фото
                  </button>
                )}
              </div>
              {formData.photo_url && (
                <div className="flex items-center space-x-4">
                  <img 
                    src={formData.photo_url} 
                    alt="Фото врача" 
                    className="w-24 h-24 object-cover rounded-full border-2 border-gray-200" 
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Текущее фото</p>
                    <p className="text-xs text-gray-500">Загрузите новое фото для замены</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Расписание работы
            </label>
            <input
              type="text"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Пн-Пт: 9:00-18:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Биография
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Краткая биография врача..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цитата врача
            </label>
            <textarea
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Личная философия или подход к лечению..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Достижения
            </label>
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => updateAchievement(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Достижение врача..."
                  />
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAchievement}
                className="flex items-center text-primary hover:text-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить достижение
              </button>
            </div>
          </div>

          {/* Action Buttons Configuration */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Кнопки действий под фото врача
              </label>
              <button
                type="button"
                onClick={addButton}
                className="flex items-center text-primary hover:text-primary-dark transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить кнопку
              </button>
            </div>
            <div className="space-y-4">
              {formData.buttons.map((button, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Текст кнопки
                      </label>
                      <input
                        type="text"
                        value={button.label}
                        onChange={(e) => updateButton(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                        placeholder="Записаться на прием"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Тип действия
                      </label>
                      <select
                        value={button.action_type}
                        onChange={(e) => updateButton(index, 'action_type', e.target.value as 'appointment' | 'blog' | 'link')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                      >
                        <option value="appointment">Записаться на прием</option>
                        <option value="blog">Перейти в блог</option>
                        <option value="link">Перейти по ссылке</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {button.action_type === 'appointment' ? 'Категория услуги' : 
                         button.action_type === 'blog' ? 'URL блога' : 'Ссылка'}
                      </label>
                      {button.action_type === 'appointment' ? (
                        <select
                          value={button.target_value}
                          onChange={(e) => updateButton(index, 'target_value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                        >
                          <option value="">Выберите категорию</option>
                          {appointmentCategories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={button.target_value}
                          onChange={(e) => updateButton(index, 'target_value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                          placeholder={button.action_type === 'blog' ? '/blog/article-id' : 'https://example.com'}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      onClick={() => removeButton(index)}
                      className="text-red-600 hover:text-red-700 transition-colors text-sm flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Удалить кнопку
                    </button>
                  </div>
                </div>
              ))}
              {formData.buttons.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">Кнопки не добавлены</p>
                  <p className="text-xs">Нажмите "Добавить кнопку" для создания действий под фото врача</p>
                </div>
              )}
            </div>
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
              placeholder="0 = первый в списке"
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
              Активный врач (отображается на сайте)
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

        <ImageCropperModal
          isOpen={isCropperModalOpen}
          imageSrc={imageToCrop}
          onClose={() => setIsCropperModalOpen(false)}
          onCropComplete={handleCropComplete}
          fileName={currentFileName}
        />
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
            <h1 className="text-2xl font-semibold text-gray-900">Управление врачами</h1>
            <span className="text-sm text-gray-500">Добавление и редактирование информации о врачах</span>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить врача
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
              <p className="text-sm font-medium text-gray-600">Всего врачей</p>
              <p className="text-2xl font-bold text-gray-900">{totalDoctors}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активных</p>
              <p className="text-2xl font-bold text-gray-900">{activeDoctors}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Средний опыт</p>
              <p className="text-2xl font-bold text-gray-900">{avgExperience} лет</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск врачей по имени или специализации..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Doctors List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'Врачи не найдены' : 'Нет врачей'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Добавьте первого врача'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Добавить врача
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                {doctor.photo_url ? (
                  <img
                    src={doctor.photo_url}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-primary font-medium">{doctor.specialization}</p>
                  <p className="text-sm text-gray-600">Опыт: {doctor.experience_years} лет</p>
                </div>
              </div>

              {doctor.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{doctor.bio}</p>
              )}

              {doctor.quote && (
                <blockquote className="text-gray-600 italic text-sm mb-4 border-l-4 border-primary pl-3">
                  "{doctor.quote}"
                </blockquote>
              )}

              {doctor.achievements && doctor.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Достижения:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {doctor.achievements.slice(0, 3).map((achievement, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {achievement}
                      </li>
                    ))}
                    {doctor.achievements.length > 3 && (
                      <li className="text-gray-500">и еще {doctor.achievements.length - 3}...</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  doctor.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {doctor.is_active ? 'Активен' : 'Неактивен'}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveDoctor(doctor.id, 'up')}
                    disabled={index === 0}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Переместить вверх"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDoctor(doctor.id, 'down')}
                    disabled={index === filteredDoctors.length - 1}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Переместить вниз"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleDoctorStatus(doctor.id, doctor.is_active)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      doctor.is_active 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {doctor.is_active ? 'Скрыть' : 'Показать'}
                  </button>
                  <button
                    onClick={() => handleEditDoctor(doctor)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doctor.id, doctor.name)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {doctor.buttons && doctor.buttons.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Кнопки действий:</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.buttons.map((button, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {button.label} ({button.action_type})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};