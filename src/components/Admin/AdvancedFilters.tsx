import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search, Calendar, Tag, User } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'multiSelect';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  onApplyFilters: (filters: Record<string, any>) => void;
  onClearFilters: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onApplyFilters,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filterValues);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilterValues({});
    onClearFilters();
  };

  const activeFiltersCount = Object.values(filterValues).filter(v => v !== '' && v !== null && v !== undefined).length;

  const renderFilterInput = (filter: FilterOption) => {
    const value = filterValues[filter.id] || '';

    switch (filter.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            placeholder={filter.placeholder || filter.label}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            <option value="">Все</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        );

      case 'dateRange':
        return (
          <div className="flex space-x-2">
            <input
              type="date"
              value={value?.from || ''}
              onChange={(e) => handleFilterChange(filter.id, { ...value, from: e.target.value })}
              placeholder="От"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
            <input
              type="date"
              value={value?.to || ''}
              onChange={(e) => handleFilterChange(filter.id, { ...value, to: e.target.value })}
              placeholder="До"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
        );

      case 'multiSelect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filter.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(v => v !== option.value);
                    handleFilterChange(filter.id, newValues);
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span>Фильтры</span>
        {activeFiltersCount > 0 && (
          <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 font-medium">
            {activeFiltersCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Фильтры</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {filters.map(filter => (
                    <div key={filter.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {filter.label}
                      </label>
                      {renderFilterInput(filter)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
                <button
                  onClick={handleClear}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Сбросить все
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Применить
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
