import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';

export const SafetyExcellence: React.FC = () => {
  const safetySteps = [
    {
      number: 1,
      title: 'Предстерилизационная очистка',
      description: 'Тщательное удаление всех видов загрязнений'
    },
    {
      number: 2,
      title: 'Стерилизация в автоклаве',
      description: 'Уничтожение всех микроорганизмов при высокой температуре'
    },
    {
      number: 3,
      title: 'Запечатанное хранение',
      description: 'Стерильные инструменты в индивидуальных упаковках'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <img
              src="https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Система стерилизации"
              className="w-full h-80 object-cover rounded-2xl shadow-lg"
              loading="lazy"
            />
          </div>
          
          <div>
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold text-[#002B49]">Превосходство в безопасности</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              Пациенты стоматологических клиник находятся в зоне особого внимания к вопросам 
              инфекционной безопасности.
            </p>
            
            <p className="text-gray-700 mb-8">
              В "Зубной Станции" внедрена современная <strong>трехуровневая система стерилизации</strong>, 
              которая максимально защищает от возможного инфицирования как пациента, так и врача.
            </p>
            
            <div className="space-y-6 mb-8">
              {safetySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-start bg-white rounded-xl p-4 shadow-md">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
              <p className="text-gray-700 font-medium">
                Наша система безопасности - это залог спокойной, уверенной и эффективной работы!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};