import React from 'react';
import { motion } from 'framer-motion';

export const HomeAdvantages: React.FC = () => {
  const advantages = [
    {
      title: 'Семейная стоматология с заботой',
      description: '"Зубная Станция" - это семейная клиника, где каждый пациент чувствует себя как дома. Мы лечим всю семью от малышей до бабушек и дедушек, создавая атмосферу доверия и комфорта.',
      image: 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'Современные технологии',
      description: 'Используем передовое стоматологическое оборудование и работаем под увеличением для максимальной точности. Инновационные методы лечения обеспечивают лучший результат.',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'Индивидуальный подход',
      description: 'Каждый пациент уникален. Мы составляем персональный план лечения с учетом особенностей здоровья, пожеланий и финансовых возможностей.',
      image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'Комфорт с первого визита',
      description: 'Удобное расположение в центре Барнаула. Бесплатная парковка. Гибкий график работы. Безболезненное лечение с качественной анестезией.',
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Почему выбирают "Зубную Станцию"
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={advantage.image}
                  alt={advantage.title}
                  className="w-full h-48 object-cover rounded-xl mb-6"
                  loading="lazy"
                />
                <h3 className="text-xl font-semibold mb-4">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};