import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
}

interface PricesTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const PricesTabs: React.FC<PricesTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { id: 'price', label: 'Прайс' },
    { id: 'subscriptions', label: 'Абонементы' },
    { id: 'whitening', label: 'Отбеливание' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 flex-1 md:flex-none ${
            activeTab === tab.id
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-secondary hover:bg-gray-50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
};