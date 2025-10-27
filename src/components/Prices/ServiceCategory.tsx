import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface Service {
  name: string;
  price: number;
  priceFrom?: boolean;
}

interface ServiceCategoryProps {
  title: string;
  services: Service[];
  searchQuery: string;
}

export const ServiceCategory: React.FC<ServiceCategoryProps> = ({ title, services, searchQuery }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredServices.length === 0) return null;

  const displayedServices = isExpanded ? filteredServices : filteredServices.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm mb-4"
    >
      <h3 className="text-xl font-semibold text-secondary mb-4">{title}</h3>
      
      <div className="space-y-3">
        {displayedServices.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
          >
            <span className="text-secondary">{service.name}</span>
            <span className="text-primary font-medium whitespace-nowrap">{service.priceFrom ? 'от ' : ''}{service.price.toLocaleString()}₽</span>
          </motion.div>
        ))}
      </div>

      {filteredServices.length > 3 && (
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-full mt-4 text-warm-gray hover:text-primary transition-colors duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="mr-2">{isExpanded ? 'Свернуть' : 'Показать больше'}</span>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </motion.button>
      )}
    </motion.div>
  );
};