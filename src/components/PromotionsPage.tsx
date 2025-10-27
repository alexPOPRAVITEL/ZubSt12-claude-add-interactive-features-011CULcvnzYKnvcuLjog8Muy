import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Percent, Users, Calendar, CreditCard, Heart } from 'lucide-react';
import { AppointmentModal } from './AppointmentModal';
import { supabase } from '../utils/supabase';

export const PromotionsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState('');
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback promotions in case the API call fails
  const fallbackPromos = [
    // ... existing currentPromos array content
  ];

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('is_published', true)
          .order('featured', { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setPromotions(data);
        } else {
          console.log('No promotions found, using fallback data');
          setPromotions([]);
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();

    const channel = supabase
      .channel('promotions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'promotions'
        },
        () => {
          fetchPromotions();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loyaltyPrograms = [
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: 'Накопительная система',
      description: 'Получайте бонусы за каждое посещение и тратьте их на следующие процедуры'
    },
    {
      icon: <Gift className="w-8 h-8 text-primary" />,
      title: 'Скидка в день рождения',
      description: 'Специальная скидка 15% в месяц вашего дня рождения'
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'Приведи друга',
      description: 'Скидка 500 рублей вам и вашему другу при первом посещении'
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: 'Регулярные пациенты',
      description: 'Дополнительные скидки для постоянных пациентов клиники'
    }
  ];

  const handlePromoClick = (title: string) => {
    setSelectedPromo(title);
    setIsModalOpen(true);
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8">
            Акции и специальные предложения
          </h1>
          
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Выгодные предложения для наших пациентов
          </p>

          {/* Current Promotions */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Текущие акции</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : promotions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {promotions.map((promo, index) => (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                      promo.featured ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={promo.image}
                        alt={promo.title}
                        className="w-full h-48 object-cover"
                      />
                      {promo.badge && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {promo.badge}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{promo.title}</h3>
                      <p className="text-gray-600 mb-4">{promo.description}</p>
                      
                      <div className="mb-4">
                        {promo.old_price ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 line-through">{Number(promo.old_price).toLocaleString()} руб.</span>
                            <span className="text-2xl font-bold text-primary">
                              {typeof promo.new_price === 'number' 
                                ? Number(promo.new_price).toLocaleString() + ' руб.' 
                                : promo.new_price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-primary">{promo.new_price}</span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        Действует до: {promo.validity}
                      </div>
                      
                      <button
                        onClick={() => handlePromoClick(promo.title)}
                        className="w-full bg-primary text-white py-2 px-4 rounded-xl hover:bg-primary-dark transition-colors duration-300"
                      >
                        Записаться по акции
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  В данный момент нет активных акций. Пожалуйста, загляните позже.
                </p>
              </div>
            )}
          </section>

          {/* Loyalty Program */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-center mb-12">Программа лояльности</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {loyaltyPrograms.map((program, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-4 flex justify-center">{program.icon}</div>
                    <h3 className="text-lg font-semibold mb-3">{program.title}</h3>
                    <p className="text-gray-600">{program.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Terms and Conditions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-md"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Условия акций</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Общие условия:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Акции не суммируются с другими скидками и специальными предложениями</li>
                  <li>• Предложения действительны при предъявлении данной информации</li>
                  <li>• Количество участников акций может быть ограничено</li>
                  <li>• Подробности уточняйте у администратора клиники</li>
                  <li>• Клиника оставляет за собой право изменить условия акций</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Рассрочка:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Беспроцентная рассрочка предоставляется клиникой на срок до 12 месяцев</li>
                  <li>• Рассрочка доступна при сумме лечения от 15 000 рублей</li>
                  <li>• Необходим документ, удостоверяющий личность</li>
                </ul>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPromo('');
        }}
        selectedService={selectedPromo}
      />
    </div>
  );
};