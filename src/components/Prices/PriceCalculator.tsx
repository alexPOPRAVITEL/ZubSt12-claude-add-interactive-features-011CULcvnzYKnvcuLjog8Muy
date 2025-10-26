import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Plus, Minus } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  basePrice: number;
  category: string;
}

interface SelectedService extends Service {
  quantity: number;
}

export const PriceCalculator: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);

  const availableServices: Service[] = [
    { id: 'consultation', name: 'Консультация', basePrice: 0, category: 'Диагностика' },
    { id: 'cleaning', name: 'Профчистка', basePrice: 2500, category: 'Профилактика' },
    { id: 'caries', name: 'Лечение кариеса (1 зуб)', basePrice: 3500, category: 'Лечение' },
    { id: 'filling', name: 'Пломба', basePrice: 2500, category: 'Лечение' },
    { id: 'whitening', name: 'Отбеливание', basePrice: 8000, category: 'Эстетика' },
    { id: 'crown', name: 'Коронка', basePrice: 11000, category: 'Протезирование' },
    { id: 'implant', name: 'Имплант', basePrice: 35000, category: 'Имплантация' }
  ];

  const addService = (service: Service) => {
    const existing = selectedServices.find(s => s.id === service.id);
    if (existing) {
      setSelectedServices(selectedServices.map(s => 
        s.id === service.id ? { ...s, quantity: s.quantity + 1 } : s
      ));
    } else {
      setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
    }
  };

  const updateQuantity = (serviceId: string, change: number) => {
    setSelectedServices(selectedServices.map(service => {
      if (service.id === serviceId) {
        const newQuantity = Math.max(0, service.quantity + change);
        return newQuantity > 0 ? { ...service, quantity: newQuantity } : null;
      }
      return service;
    }).filter(Boolean) as SelectedService[]);
  };

  const calculateSubtotal = () => {
    return selectedServices.reduce((sum, service) => sum + (service.basePrice * service.quantity), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (subtotal > 15000) return subtotal * 0.15; // 15% скидка при сумме > 15000
    if (subtotal > 10000) return subtotal * 0.10; // 10% скидка при сумме > 10000
    if (subtotal > 5000) return subtotal * 0.05;  // 5% скидка при сумме > 5000
    return 0;
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const total = subtotal - discount;

  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 mb-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center">
          <Calculator className="w-6 h-6 mr-2 text-primary" />
          💡 Конструктор лечения
        </h3>
        <p className="text-gray-600">Выберите услуги и узнайте стоимость с учётом скидок</p>
      </div>

      {!showCalculator ? (
        <div className="text-center">
          <button
            onClick={() => setShowCalculator(true)}
            className="bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-dark transition-colors duration-300"
          >
            Рассчитать стоимость лечения
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
        >
          {/* Service Selection */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4">Выберите услуги:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => addService(service)}
                  className="bg-white p-3 rounded-xl border border-gray-200 hover:border-primary transition-colors duration-300 text-left"
                >
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.category}</div>
                  <div className="text-primary font-semibold">
                    {service.basePrice === 0 ? 'Бесплатно' : `${service.basePrice.toLocaleString()}₽`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Services */}
          {selectedServices.length > 0 && (
            <div className="bg-white rounded-xl p-6 mb-6">
              <h4 className="font-semibold mb-4">Ваш план лечения:</h4>
              <div className="space-y-3">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-gray-500 ml-2">× {service.quantity}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(service.id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{service.quantity}</span>
                      <button
                        onClick={() => updateQuantity(service.id, 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-primary font-semibold w-20 text-right">
                        {(service.basePrice * service.quantity).toLocaleString()}₽
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Подытог:</span>
                  <span>{subtotal.toLocaleString()}₽</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Скидка:</span>
                    <span>-{discount.toLocaleString()}₽</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Итого:</span>
                  <span className="text-primary">{total.toLocaleString()}₽</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors duration-300">
                  Записаться с этим планом
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Точная стоимость определяется после осмотра
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};