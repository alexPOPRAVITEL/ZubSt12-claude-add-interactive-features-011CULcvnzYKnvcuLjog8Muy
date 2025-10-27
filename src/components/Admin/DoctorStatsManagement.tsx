import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users, Award, Activity, Calendar } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface DoctorStats {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  photo_url?: string;
  // Статистика (будет храниться в БД)
  patients_per_month?: number;
  total_procedures?: number;
  rating?: number;
  return_rate?: number;
  appointments_completed?: number;
}

interface DoctorStatsManagementProps {
  onBack: () => void;
}

export const DoctorStatsManagement: React.FC<DoctorStatsManagementProps> = ({ onBack }) => {
  const [doctors, setDoctors] = useState<DoctorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setDoctors(data || []);

      // Инициализируем statsData
      const initialStats: Record<string, any> = {};
      (data || []).forEach((doctor: DoctorStats) => {
        initialStats[doctor.id] = {
          patients_per_month: doctor.patients_per_month || 0,
          total_procedures: doctor.total_procedures || 0,
          rating: doctor.rating || 4.8,
          return_rate: doctor.return_rate || 85,
          appointments_completed: doctor.appointments_completed || 0,
        };
      });
      setStatsData(initialStats);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStats = async (doctorId: string) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({
          patients_per_month: statsData[doctorId].patients_per_month,
          total_procedures: statsData[doctorId].total_procedures,
          rating: statsData[doctorId].rating,
          return_rate: statsData[doctorId].return_rate,
          appointments_completed: statsData[doctorId].appointments_completed,
        })
        .eq('id', doctorId);

      if (error) throw error;

      alert('Статистика обновлена!');
      setEditingDoctor(null);
      loadDoctors();
    } catch (error) {
      console.error('Error updating stats:', error);
      alert('Ошибка при обновлении статистики');
    }
  };

  const handleStatChange = (doctorId: string, field: string, value: any) => {
    setStatsData({
      ...statsData,
      [doctorId]: {
        ...statsData[doctorId],
        [field]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад к панели
        </button>
        <h2 className="text-2xl font-bold">Статистика врачей</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Для пациентов:</strong> Вместо точных цифр показываются доверительные бэйджи (Эксперт, Любим пациентами, Сертифицирован)
        </p>
        <p className="text-sm text-blue-700 mt-2">
          Эта детальная статистика доступна только администраторам
        </p>
      </div>

      <div className="grid gap-6">
        {doctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-start gap-4">
              <img
                src={doctor.photo_url || 'https://via.placeholder.com/80'}
                alt={doctor.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
                <p className="text-gray-600 mb-4">{doctor.specialization}</p>

                {editingDoctor === doctor.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Users className="w-4 h-4 inline mr-1" />
                        Пациентов в месяц
                      </label>
                      <input
                        type="number"
                        value={statsData[doctor.id]?.patients_per_month || 0}
                        onChange={(e) =>
                          handleStatChange(doctor.id, 'patients_per_month', parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Activity className="w-4 h-4 inline mr-1" />
                        Всего процедур
                      </label>
                      <input
                        type="number"
                        value={statsData[doctor.id]?.total_procedures || 0}
                        onChange={(e) =>
                          handleStatChange(doctor.id, 'total_procedures', parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Award className="w-4 h-4 inline mr-1" />
                        Рейтинг (из 5)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={statsData[doctor.id]?.rating || 4.8}
                        onChange={(e) =>
                          handleStatChange(doctor.id, 'rating', parseFloat(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <TrendingUp className="w-4 h-4 inline mr-1" />
                        Возвращаются (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={statsData[doctor.id]?.return_rate || 85}
                        onChange={(e) =>
                          handleStatChange(doctor.id, 'return_rate', parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Приемов завершено
                      </label>
                      <input
                        type="number"
                        value={statsData[doctor.id]?.appointments_completed || 0}
                        onChange={(e) =>
                          handleStatChange(doctor.id, 'appointments_completed', parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Пациентов/мес</div>
                      <div className="text-lg font-bold text-gray-900">
                        {statsData[doctor.id]?.patients_per_month || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Процедур</div>
                      <div className="text-lg font-bold text-gray-900">
                        {statsData[doctor.id]?.total_procedures || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Рейтинг</div>
                      <div className="text-lg font-bold text-yellow-600">
                        {statsData[doctor.id]?.rating || 4.8}/5
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Возвращаются</div>
                      <div className="text-lg font-bold text-green-600">
                        {statsData[doctor.id]?.return_rate || 85}%
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Приемов</div>
                      <div className="text-lg font-bold text-blue-600">
                        {statsData[doctor.id]?.appointments_completed || 0}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {editingDoctor === doctor.id ? (
                    <>
                      <button
                        onClick={() => handleUpdateStats(doctor.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => {
                          setEditingDoctor(null);
                          loadDoctors();
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Отмена
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingDoctor(doctor.id)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Редактировать статистику
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
