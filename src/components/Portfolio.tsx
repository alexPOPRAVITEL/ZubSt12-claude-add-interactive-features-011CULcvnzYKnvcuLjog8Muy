import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppointmentModal } from './AppointmentModal';
import { fetchProjects, Project } from '../utils/supabase';

export const Portfolio: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [portfolioData, setPortfolioData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback data in case the API call fails
  const fallbackItems = [
    // ... existing portfolioItems array content
  ];

  const filters = [
    { id: 'all', label: 'Все работы' },
    { id: 'therapy', label: 'Терапия' },
    { id: 'orthodontics', label: 'Ортодонтия' },
    { id: 'implants', label: 'Имплантация' },
    { id: 'prosthetics', label: 'Протезирование' },
    { id: 'pediatric', label: 'Детская стоматология' }
  ];

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const projects = await fetchProjects(activeFilter === 'all' ? undefined : activeFilter);
        if (projects.length > 0) {
          setPortfolioData(projects);
        } else {
          console.log('No projects found, using fallback data');
          setPortfolioData([]);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setPortfolioData([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [activeFilter]);

  // Process projects data to match the portfolio item structure
  const processedItems = portfolioData.map(project => {
    // Extract before and after images from the images array
    const beforeImage = project.images && project.images.length > 0 ? project.images[0] : 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600';
    const afterImage = project.images && project.images.length > 1 ? project.images[1] : 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600';
    
    return {
      id: project.id,
      category: project.category,
      title: project.title,
      description: project.description,
      beforeImage,
      afterImage,
      treatmentType: project.treatment_type || getCategoryLabel(project.category),
      duration: project.duration || 'Индивидуально'
    };
  });

  // Helper function to get category label
  const getCategoryLabel = (categoryId: string): string => {
    const filter = filters.find(f => f.id === categoryId);
    return filter ? filter.label : 'Общее';
  };

  const filteredItems = processedItems;

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8">
            Наши работы
          </h1>
          
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Примеры успешного лечения в "Зубной Станции"
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <div className="grid grid-cols-2">
                      <div className="relative">
                        <img
                          src={item.beforeImage}
                          alt="До лечения"
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                        <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                          ДО
                        </span>
                      </div>
                      <div className="relative">
                        <img
                          src={item.afterImage}
                          alt="После лечения"
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                        <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                          ПОСЛЕ
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {item.treatmentType}
                      </span>
                      <span className="text-gray-500">{item.duration}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                В данной категории пока нет работ. Пожалуйста, выберите другую категорию или загляните позже.
              </p>
            </div>
          )}

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Хотите такой же результат?</h2>
            <p className="text-xl mb-8 opacity-90">
              Запишитесь на консультацию, и мы составим индивидуальный план лечения
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-primary px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Записаться на консультацию
            </button>
          </motion.section>
        </motion.div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        selectedService="Консультация"
      />
    </div>
  );
};