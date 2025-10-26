import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronDown, Check, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import { trackFormSubmission } from '../utils/analytics';
import 'react-day-picker/dist/style.css';

import { supabase, AppointmentServiceCategory, AppointmentService } from '../utils/supabase';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDoctor?: string;
  selectedService?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedDoctor,
  selectedService 
}) => {
  const [step, setStep] = useState(1);
  const [selectedServiceState, setSelectedServiceState] = useState(selectedService || '');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [serviceCategories, setServiceCategories] = useState<AppointmentServiceCategory[]>([]);
  const [appointmentServices, setAppointmentServices] = useState<AppointmentService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: '',
    agreement: false
  });
  const timeRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showAgreementError, setShowAgreementError] = useState(false);

  // Load appointment services data
  useEffect(() => {
    const fetchAppointmentData = async () => {
      setLoadingServices(true);
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('appointment_service_categories')
          .select('*')
          .order('order_index', { ascending: true });

        if (categoriesError) throw categoriesError;
        setServiceCategories(categoriesData || []);

        const { data: servicesData, error: servicesError } = await supabase
          .from('appointment_services')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (servicesError) throw servicesError;
        setAppointmentServices(servicesData || []);

      } catch (error) {
        console.error('Error fetching appointment services data:', error);
      } finally {
        setLoadingServices(false);
      }
    };

    if (isOpen) {
      fetchAppointmentData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDate && timeRef.current) {
      timeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedService) {
      setSelectedServiceState(selectedService);
      // If selectedService matches a category name, find the category and set it
      const matchingCategory = serviceCategories.find(cat => cat.name === selectedService);
      if (matchingCategory) {
        setSelectedCategoryId(matchingCategory.id);
        setStep(1); // Stay on step 1 to show services in this category
      } else {
        // If it's a specific service name, try to find it and proceed
        const matchingService = appointmentServices.find(service => service.name === selectedService);
        if (matchingService) {
          setSelectedCategoryId(matchingService.category_id);
        }
        setStep(2);
      }
    }
  }, [selectedService]);

  const getAvailableServices = () => {
    if (loadingServices) {
      return [];
    }

    // If a specific category is selected (from doctor button), show services in that category
    if (selectedCategoryId) {
      return appointmentServices
        .filter(service => service.category_id === selectedCategoryId)
        .map(service => ({
          name: service.name,
          duration: service.duration || 'Уточняется',
          price: service.price
        }));
    }

    // If selectedService matches a category name, show services in that category
    if (selectedServiceState) {
      const matchingCategory = serviceCategories.find(cat => cat.name === selectedServiceState);
      if (matchingCategory) {
        return appointmentServices
          .filter(service => service.category_id === matchingCategory.id)
          .map(service => ({
            name: service.name,
            duration: service.duration || 'Уточняется',
            price: service.price
          }));
      }
    }

    // Otherwise, show all categories as options
    return serviceCategories.map(category => ({
      name: category.name,
      duration: 'Выберите услугу',
      isCategory: true,
      categoryId: category.id
    }));
  };

  const handleServiceSelection = (serviceName: string, isCategory?: boolean, categoryId?: string) => {
    setSelectedServiceState(serviceName);
    
    if (isCategory && categoryId) {
      // If it's a category, set the category and stay on step 1 to show services
      setSelectedCategoryId(categoryId);
    } else {
      // If it's a specific service, proceed to step 2
      setStep(2);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 20;
    const interval = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        if (hour === endHour - 1 && minute + interval > 60) continue;
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAgreementError(false);

    if (!formData.agreement) {
      setShowAgreementError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Track form submission for analytics
      trackFormSubmission('Appointment', {
        service: selectedServiceState,
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
        time: selectedTime,
        doctor: selectedDoctor,
        has_name: !!formData.name,
        has_phone: !!formData.phone,
        has_comment: !!formData.comment
      });

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          service: selectedServiceState,
          date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
          time: selectedTime,
          doctor: selectedDoctor,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
        setStep(1);
        setSelectedServiceState('');
        setSelectedDate(undefined);
        setSelectedTime('');
        setFormData({
          name: '',
          phone: '',
          comment: '',
          agreement: false
        });
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDays = [
    { from: new Date(2000, 1, 1), to: new Date() },
    { dayOfWeek: [0, 6] }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-lg relative overflow-hidden max-h-[85vh] flex flex-col mb-20 md:mb-0"
          >
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-[#002B49] mb-4">
                Запись на приём
                {selectedDoctor && <span className="block text-lg text-primary mt-1">к врачу {selectedDoctor}</span>}
              </h2>

              <div className="flex items-center">
                {[1, 2, 3].map((i) => (
                  <React.Fragment key={i}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step === i ? 'bg-primary text-white' : 
                        step > i ? 'bg-green-500 text-white' : 
                        'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step > i ? '✓' : i}
                    </div>
                    {i < 3 && (
                      <div 
                        className={`h-1 flex-1 mx-2 ${
                          step > i ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">Спасибо за заявку!</h3>
                  <p className="text-gray-600">
                    Мы свяжемся с вами в ближайшее время для подтверждения записи.
                  </p>
                </div>
              ) : (
                <div>
                  {step === 1 && (
                    <>
                      {loadingServices ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {getAvailableServices().map((service: any) => (
                            <motion.button
                              key={service.name}
                              onClick={() => handleServiceSelection(
                                service.name, 
                                service.isCategory, 
                                service.categoryId
                              )}
                              className={`p-3 rounded-xl border-2 transition-colors duration-300 text-left ${
                                selectedServiceState === service.name
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200 hover:border-primary/50'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                              <div className="flex justify-between items-center">
                                <p className="text-gray-600">{service.duration}</p>
                                {service.price && (
                                  <span className="text-primary font-medium">
                                    от {service.price.toLocaleString()}₽
                                  </span>
                                )}
                              </div>
                              {service.isCategory && (
                                <p className="text-xs text-primary mt-1">Нажмите для выбора конкретной услуги</p>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {step === 2 && (
                    <div>
                      <div className="mb-4">
                        <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            if (date && timeRef.current) {
                              setTimeout(() => {
                                timeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }, 100);
                            }
                          }}
                          disabled={disabledDays}
                          locale={ru}
                          className="mx-auto w-[calc(100%-2rem)]"
                          classNames={{
                            day_selected: "bg-primary text-white",
                            day_today: "bg-gray-100",
                            day: "text-base p-2",
                            head_cell: "text-base",
                            caption: "text-lg mb-4"
                          }}
                          styles={{
                            caption: { margin: '1rem 0' },
                            table: { width: '100%' }
                          }}
                        />
                      </div>
                      {selectedDate && (
                        <div ref={timeRef}>
                          <h3 className="font-medium mb-3">Выберите время</h3>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {generateTimeSlots().map((time) => (
                              <motion.button
                                key={time}
                                onClick={() => {
                                  setSelectedTime(time);
                                  setStep(3);
                                }}
                                className={`p-2 rounded-xl border transition-colors duration-300 ${
                                  selectedTime === time
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-gray-200 hover:border-primary/50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {time}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Ваше имя
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                          placeholder="Как к вам обращаться?"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Телефон
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                          placeholder="+7 (___) ___-__-__"
                        />
                      </div>

                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                          Комментарий
                        </label>
                        <textarea
                          id="comment"
                          value={formData.comment}
                          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                          rows={2}
                          placeholder="Что вас беспокоит?"
                        />
                      </div>

                      <div className="flex items-start bg-primary/5 p-3 rounded-xl relative">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={formData.agreement ? { scale: 1 } : { scale: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute left-3 top-3 text-green-500"
                        >
                          <Check className="w-5 h-5" />
                        </motion.div>
                        <input
                          type="checkbox"
                          id="agreement"
                          checked={formData.agreement}
                          onChange={(e) => {
                            setFormData({ ...formData, agreement: e.target.checked });
                            setShowAgreementError(false);
                          }}
                          className="h-5 w-5 text-primary border-2 border-primary rounded focus:ring-primary"
                        />
                        <label 
                          htmlFor="agreement" 
                          className={`ml-2 text-sm ${showAgreementError ? 'text-red-500' : 'text-gray-600'}`}
                        >
                          Я согласен на обработку персональных данных
                        </label>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            {submitStatus !== 'success' && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between">
                  {step > 1 && (
                    <motion.button
                      onClick={() => setStep(step - 1)}
                      className="flex items-center gap-2 px-6 py-2 text-primary border-2 border-primary rounded-xl hover:bg-primary/5 transition-all duration-300"
                      whileHover={{ scale: 1.02, x: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Назад
                    </motion.button>
                  )}
                  {step < 3 ? (
                    <button
                      onClick={() => {
                        if (step === 1 && selectedServiceState) {
                          // Check if it's a category selection, if so, don't proceed to step 2
                          const selectedOption = getAvailableServices().find((service: any) => service.name === selectedServiceState);
                          if (!selectedOption?.isCategory) {
                            setStep(2);
                          }
                        }
                      }}
                      disabled={
                        (step === 1 && !selectedServiceState) || 
                        (step === 1 && getAvailableServices().find((service: any) => service.name === selectedServiceState)?.isCategory) ||
                        (step === 2 && !selectedTime)
                      }
                      className={`px-6 py-2 rounded-xl transition-colors duration-300 ${
                        (step === 1 && !selectedServiceState) || 
                        (step === 1 && getAvailableServices().find((service: any) => service.name === selectedServiceState)?.isCategory) ||
                        (step === 2 && !selectedTime)
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                    >
                      Продолжить
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors duration-300 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Отправка...' : 'Записаться на приём'}
                    </button>
                  )}
                </div>

                <p className="text-sm text-gray-500 text-center mt-3">
                  Администратор перезвонит в течение 5 минут
                </p>

                {submitStatus === 'error' && (
                  <p className="text-red-500 text-sm text-center mt-4">
                    Произошла ошибка. Пожалуйста, попробуйте позже.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};