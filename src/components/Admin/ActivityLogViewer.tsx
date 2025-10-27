import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, User, FileText, RefreshCw, Download, Filter, Search } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { exportToCSV } from '../../utils/exportData';

interface ActivityLog {
  id: string;
  admin_user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  admin_users?: {
    full_name: string;
    email: string;
  };
}

interface ActivityLogViewerProps {
  onBack: () => void;
}

export const ActivityLogViewer: React.FC<ActivityLogViewerProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterResource, setFilterResource] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select(`
          *,
          admin_users (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;

      if (data) {
        setLogs(data);
      }
    } catch (error) {
      console.error('Error loading activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return '➕';
      case 'update':
        return '✏️';
      case 'delete':
        return '🗑️';
      case 'view':
        return '👁️';
      case 'export':
        return '📤';
      case 'login':
        return '🔓';
      case 'logout':
        return '🔒';
      default:
        return '📝';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-600 bg-green-50';
      case 'update':
        return 'text-blue-600 bg-blue-50';
      case 'delete':
        return 'text-red-600 bg-red-50';
      case 'view':
        return 'text-gray-600 bg-gray-50';
      case 'export':
        return 'text-purple-600 bg-purple-50';
      case 'login':
      case 'logout':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      !searchTerm ||
      log.admin_users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = !filterAction || log.action === filterAction;
    const matchesResource = !filterResource || log.resource_type === filterResource;

    return matchesSearch && matchesAction && matchesResource;
  });

  const handleExport = () => {
    const exportData = filteredLogs.map(log => ({
      'Дата и время': formatDate(log.created_at),
      'Администратор': log.admin_users?.full_name || 'Неизвестно',
      'Email': log.admin_users?.email || '',
      'Действие': log.action,
      'Тип ресурса': log.resource_type,
      'ID ресурса': log.resource_id || '',
      'User Agent': log.user_agent || ''
    }));

    exportToCSV(exportData, `activity_logs_${new Date().toISOString().split('T')[0]}`);
  };

  const uniqueActions = Array.from(new Set(logs.map(l => l.action)));
  const uniqueResources = Array.from(new Set(logs.map(l => l.resource_type)));

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Activity className="w-8 h-8 mr-3 text-primary" />
              Журнал активности
            </h1>
            <p className="text-gray-600 mt-1">
              История всех действий администраторов
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              disabled={filteredLogs.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Экспорт</span>
            </button>
            <button
              onClick={loadLogs}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Обновить</span>
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Назад
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            <option value="">Все действия</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          <select
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            <option value="">Все типы ресурсов</option>
            {uniqueResources.map(resource => (
              <option key={resource} value={resource}>
                {resource}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Найдено записей: <strong className="ml-2">{filteredLogs.length}</strong>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Загрузка журнала активности...</p>
          </div>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Записи не найдены</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата и время
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Администратор
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действие
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ресурс
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Детали
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(log.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {log.admin_users?.full_name || 'Неизвестно'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.admin_users?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        <span className="mr-1">{getActionIcon(log.action)}</span>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{log.resource_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.resource_id && (
                        <div className="max-w-xs truncate">
                          ID: {log.resource_id}
                        </div>
                      )}
                      {Object.keys(log.details || {}).length > 0 && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-primary hover:text-primary-dark">
                            Подробнее
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-w-xs">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
