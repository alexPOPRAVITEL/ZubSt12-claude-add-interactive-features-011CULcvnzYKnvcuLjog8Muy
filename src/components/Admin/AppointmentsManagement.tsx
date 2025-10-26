import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Calendar, Clock, Phone, User, MessageSquare, CheckCircle, XCircle, AlertCircle, Filter, Download, RefreshCw, Edit2, Trash2, Eye } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Appointment {
  id: string;
  patient_name: string;
  phone: string;
  email?: string;
  appointment_date?: string;
  appointment_time?: string;
  service_name?: string;
  doctor_id?: string;
  appointment_type: string;
  status: string;
  notes?: string;
  admin_notes?: string;
  comment?: string;
  source?: string;
  created_at: string;
  updated_at?: string;
  confirmed_at?: string;
  completed_at?: string;
}

interface AppointmentsManagementProps {
  onBack: () => void;
}

export const AppointmentsManagement: React.FC<AppointmentsManagementProps> = ({ onBack }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAppointments();

    const subscription = supabase
      .channel('appointments_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => {
          loadAppointments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;
      await loadAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Ошибка при обновлении статуса');
    } finally {
      setSaving(false);
    }
  };

  const updateAdminNotes = async () => {
    if (!selectedAppointment) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ admin_notes: adminNotes })
        .eq('id', selectedAppointment.id);

      if (error) throw error;
      await loadAppointments();
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('Error updating admin notes:', error);
      alert('Ошибка при сохранении заметок');
    } finally {
      setSaving(false);
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;
      await loadAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Ошибка при удалении записи');
    }
  };

  const exportToCSV = () => {
    const headers = ['Дата создания', 'Имя', 'Телефон', 'Email', 'Дата приема', 'Время', 'Услуга', 'Тип', 'Статус', 'Заметки'];
    const rows = filteredAppointments.map(apt => [
      format(new Date(apt.created_at), 'dd.MM.yyyy HH:mm', { locale: ru }),
      apt.patient_name,
      apt.phone,
      apt.email || '',
      apt.appointment_date ? format(new Date(apt.appointment_date), 'dd.MM.yyyy', { locale: ru }) : '',
      apt.appointment_time || '',
      apt.service_name || '',
      apt.appointment_type,
      apt.status,
      apt.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `appointments_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.includes(searchQuery) ||
      (apt.email && apt.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesType = typeFilter === 'all' || apt.appointment_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Ожидает' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Подтверждено' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Завершено' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Отменено' },
      no_show: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Не пришел' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig: Record<string, { color: string; label: string }> = {
      appointment: { color: 'bg-blue-50 text-blue-700', label: 'Запись' },
      callback: { color: 'bg-purple-50 text-purple-700', label: 'Обратный звонок' },
      consultation: { color: 'bg-teal-50 text-teal-700', label: 'Консультация' },
      emergency: { color: 'bg-red-50 text-red-700', label: 'Срочно' }
    };

    const config = typeConfig[type] || typeConfig.appointment;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    today: appointments.filter(a =>
      a.appointment_date &&
      format(new Date(a.appointment_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад к панели
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Записи на прием</h1>
              <p className="text-gray-600">Управление записями пациентов</p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Экспорт CSV
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Всего</span>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Ожидают</span>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Подтверждено</span>
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.confirmed}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Завершено</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Сегодня</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.today}</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск по имени, телефону, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все статусы</option>
              <option value="pending">Ожидает</option>
              <option value="confirmed">Подтверждено</option>
              <option value="completed">Завершено</option>
              <option value="cancelled">Отменено</option>
              <option value="no_show">Не пришел</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все типы</option>
              <option value="appointment">Запись</option>
              <option value="callback">Обратный звонок</option>
              <option value="consultation">Консультация</option>
              <option value="emergency">Срочно</option>
            </select>

            <button
              onClick={loadAppointments}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Записи не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата создания
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Пациент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Контакты
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата/Время приема
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Услуга
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Тип
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment, index) => (
                    <motion.tr
                      key={appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(appointment.created_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {appointment.patient_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${appointment.phone}`} className="hover:text-blue-600">
                              {appointment.phone}
                            </a>
                          </div>
                          {appointment.email && (
                            <div className="text-xs text-gray-500 mt-1">{appointment.email}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.appointment_date && appointment.appointment_time ? (
                          <div>
                            <div>{format(new Date(appointment.appointment_date), 'dd.MM.yyyy', { locale: ru })}</div>
                            <div className="text-xs text-gray-500">{appointment.appointment_time}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Не указано</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {appointment.service_name || <span className="text-gray-400">Не указано</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(appointment.appointment_type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={appointment.status}
                          onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                          className="text-sm border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded"
                          disabled={saving}
                        >
                          <option value="pending">Ожидает</option>
                          <option value="confirmed">Подтверждено</option>
                          <option value="completed">Завершено</option>
                          <option value="cancelled">Отменено</option>
                          <option value="no_show">Не пришел</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setAdminNotes(appointment.admin_notes || '');
                              setIsDetailModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="Подробнее"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {isDetailModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Детали записи</h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Пациент</label>
                    <p className="text-gray-900">{selectedAppointment.patient_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Телефон</label>
                    <p className="text-gray-900">{selectedAppointment.phone}</p>
                  </div>
                </div>

                {selectedAppointment.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedAppointment.email}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Дата приема</label>
                    <p className="text-gray-900">
                      {selectedAppointment.appointment_date
                        ? format(new Date(selectedAppointment.appointment_date), 'dd.MM.yyyy', { locale: ru })
                        : 'Не указано'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Время</label>
                    <p className="text-gray-900">{selectedAppointment.appointment_time || 'Не указано'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Услуга</label>
                  <p className="text-gray-900">{selectedAppointment.service_name || 'Не указано'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Тип записи</label>
                    <div className="mt-1">{getTypeBadge(selectedAppointment.appointment_type)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Статус</label>
                    <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Комментарий пациента</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
                  </div>
                )}

                {selectedAppointment.source && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Источник</label>
                    <p className="text-gray-900">{selectedAppointment.source}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">Заметки администратора</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Добавьте заметки для внутреннего использования..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={updateAdminNotes}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Сохранение...' : 'Сохранить заметки'}
                  </button>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
