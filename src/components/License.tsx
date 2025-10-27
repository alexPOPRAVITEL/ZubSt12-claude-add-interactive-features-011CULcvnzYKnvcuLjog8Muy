import React from 'react';
import { motion } from 'framer-motion';

export const License: React.FC = () => {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl p-8 shadow-md"
        >
          <h1 className="text-3xl font-bold text-[#002B49] mb-8">Лицензия</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-8">
              Положение о защите и обработке персональных данных в обществе с ограниченной ответственностью «Зубная Станция»
            </p>
            
            <div className="mb-8">
              <p>Оказание медицинских услуг предполагает обработку и хранение персональных данных клиентов в автоматизированных информационных системах Общества с ограниченной ответственностью «Зубная Станция» (далее - Клиника).
                Адрес: г. Барнаул, пр-кт Красноармейский, д. 95а<br />
                тел. <a href="tel:+73852627766" className="text-primary hover:text-primary-dark">(3852)62-77-66</a><br />
                <a href="http://www.zdravalt.ru" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">www.zdravalt.ru</a><br />
                <a href="mailto:krayzdrav@zdravalt.ru" className="text-primary hover:text-primary-dark">krayzdrav@zdravalt.ru</a>
              </p>
            </div>

            <div className="mb-8">
              <p className="mb-4">
                Проверить действительность лицензии и виды деятельности ООО «Зубная Станция» можно{' '}
                <a 
                  href="https://www.roszdravnadzor.gov.ru/services/licenses" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark font-semibold"
                >
                  ЗДЕСЬ
                </a>
              </p>
            </div>

            <div className="mt-8">
              <img 
                src="https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Лицензия ООО «Зубная Станция»"
                className="w-full rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};