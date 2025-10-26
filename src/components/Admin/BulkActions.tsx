import React from 'react';
import { Trash2, CheckCircle, XCircle, Download, Archive } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onDelete?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onExport?: () => void;
  onArchive?: () => void;
  customActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'danger' | 'success' | 'secondary';
  }>;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onDelete,
  onActivate,
  onDeactivate,
  onExport,
  onArchive,
  customActions = []
}) => {
  if (selectedCount === 0) return null;

  const getButtonClass = (variant: string = 'primary') => {
    const baseClass = 'px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium';
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-dark',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      success: 'bg-green-500 text-white hover:bg-green-600',
      secondary: 'bg-gray-500 text-white hover:bg-gray-600'
    };
    return `${baseClass} ${variants[variant as keyof typeof variants] || variants.primary}`;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-blue-900">
            Выбрано элементов: {selectedCount}
          </span>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {onActivate && (
            <button onClick={onActivate} className={getButtonClass('success')}>
              <CheckCircle className="w-4 h-4" />
              <span>Активировать</span>
            </button>
          )}

          {onDeactivate && (
            <button onClick={onDeactivate} className={getButtonClass('secondary')}>
              <XCircle className="w-4 h-4" />
              <span>Деактивировать</span>
            </button>
          )}

          {onExport && (
            <button onClick={onExport} className={getButtonClass('primary')}>
              <Download className="w-4 h-4" />
              <span>Экспорт</span>
            </button>
          )}

          {onArchive && (
            <button onClick={onArchive} className={getButtonClass('secondary')}>
              <Archive className="w-4 h-4" />
              <span>Архивировать</span>
            </button>
          )}

          {customActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={getButtonClass(action.variant)}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}

          {onDelete && (
            <button onClick={onDelete} className={getButtonClass('danger')}>
              <Trash2 className="w-4 h-4" />
              <span>Удалить</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
