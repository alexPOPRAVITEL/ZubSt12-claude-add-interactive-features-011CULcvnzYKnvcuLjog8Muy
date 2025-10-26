import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Phone, MessageCircle, Clock, X, Check, ArrowLeft } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface QuickAppointmentProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAppointment: React.FC<QuickAppointmentProps> = ({ isOpen, onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const quickMethods = [
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      icon: <MessageCircle className="w-8 h-8" />,
      description: 'Напишите нам прямо сейчас',
      color: 'from-green-500 to-green-600',
      action: () => {
        window.open('https://wa.me/79619785454?text=Здравствуйте! Хочу записаться на прием', '_blank');
        onClose();
      }
    },
    {
      id: 'call',
      title: 'Позвонить',
      icon: <Phone className="w-8 h-8" />,
      description: 'Мгновенная связь с администратором',
      color: 'from-blue-500 to-blue-600',
      action: () => {
        window.location.href = 'tel:+79619785454';
        onClose();
      }
    },
    {
      id: 'callback',
      title: 'Перезвоните мне',
      icon: <Clock className="w-8 h-8" />,
      description: 'Мы перезвоним через 1 минуту',
      color: 'from-purple-500 to-purple-600',
      action: () => setSelectedMethod('callback')
    }
  ];

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_name: name,
          client_name: name,
          phone: phone,
          client_phone: phone,
          appointment_type: 'callback',
          status: 'pending',
          notes: 'Быстрая заявка - перезвоните через 1 минуту',
          source: 'website_quick_appointment'
        });

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setSelectedMethod(null);
        setName('');
        setPhone('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting callback:', error);
      alert('Произошла ошибка. Позвоните нам: +7 (961) 978-54-54');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-dark p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-2">Записаться на прием</h2>
                  <p className="text-lg opacity-90">Выберите удобный способ связи</p>
                </div>
              </div>

              <div className="p-8">
                {!selectedMethod ? (
                  <div className="grid gap-4">
                    {quickMethods.map((method, index) => (
                      <motion.button
                        key={method.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={method.action}
                        className={`bg-gradient-to-r ${method.color} text-white p-6 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 group`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-white/20 p-4 rounded-xl group-hover:bg-white/30 transition-colors">
                            {method.icon}
                          </div>
                          <div className="text-left flex-1">
                            <h3 className="text-xl font-bold mb-1">{method.title}</h3>
                            <p className="text-sm opacity-90">{method.description}</p>
                          </div>
                          <div className="text-white/50">→</div>
                        </div>
                      </motion.button>
                    ))}

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-4 text-gray-600">
                        <Phone className="w-5 h-5" />
                        <a href="tel:+79619785454" className="text-lg font-semibold hover:text-primary transition-colors">
                          +7 (961) 978-54-54
                        </a>
                      </div>
                      <p className="text-center text-sm text-gray-500 mt-2">
                        Пн-Пт: 09:00-20:00, Сб-Вс: выходной
                      </p>
                    </div>
                  </div>
                ) : isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Заявка отправлена!</h3>
                    <p className="text-gray-600 text-lg">
                      Мы перезвоним вам через 1 минуту
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <motion.button
                      onClick={() => setSelectedMethod(null)}
                      className="flex items-center gap-2 px-4 py-2 text-primary border-2 border-primary rounded-xl hover:bg-primary/5 transition-all duration-300 mb-6"
                      whileHover={{ scale: 1.02, x: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Назад
                    </motion.button>

                    <form onSubmit={handleCallbackSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Ваше имя
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Как к вам обращаться?"
                          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Номер телефона
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          placeholder="+7 (___) ___-__-__"
                          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                        />
                      </div>

                      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Clock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="font-semibold text-purple-900 mb-1">Быстрый ответ</h4>
                            <p className="text-sm text-purple-700">
                              Администратор перезвонит вам в течение 1 минуты для уточнения деталей записи
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-5 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Отправка...' : 'Жду звонка'}
                      </button>
                    </form>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
