import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  User,
  Stethoscope,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  Search
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { format, addDays, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  category_id: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  order_index: number;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  photo_url: string;
  experience_years: number;
}

interface BookingData {
  service?: Service;
  doctor?: Doctor;
  date?: Date;
  time?: string;
  name?: string;
  phone?: string;
  email?: string;
  comment?: string;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalSteps = 5;

  useEffect(() => {
    if (isOpen) {
      loadServices();
      loadDoctors();
    }
  }, [isOpen]);

  const loadServices = async () => {
    const { data: categoriesData } = await supabase
      .from('appointment_service_categories')
      .select('*')
      .order('order_index');

    const { data: servicesData } = await supabase
      .from('appointment_services')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    if (categoriesData) setCategories(categoriesData);
    if (servicesData) setServices(servicesData);
  };

  const loadDoctors = async () => {
    const { data } = await supabase
      .from('doctors')
      .select('id, name, specialization, photo_url, experience_years')
      .eq('is_active', true)
      .order('name');

    if (data) setDoctors(data);
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_name: bookingData.name,
          client_name: bookingData.name,
          phone: bookingData.phone,
          client_phone: bookingData.phone,
          email: bookingData.email,
          client_email: bookingData.email,
          service_id: bookingData.service?.id,
          service_name: bookingData.service?.name,
          doctor_id: bookingData.doctor?.id,
          appointment_date: bookingData.date,
          appointment_time: bookingData.time,
          notes: bookingData.comment || `Услуга: ${bookingData.service?.name}`,
          comment: bookingData.comment,
          status: 'pending',
          appointment_type: 'booking',
          source: 'website_booking_wizard'
        });

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setStep(1);
        setBookingData({});
      }, 3000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Произошла ошибка. Позвоните нам: +7 (961) 978-54-54');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedServices = categories.map(category => ({
    ...category,
    services: filteredServices.filter(s => s.category_id === category.id)
  })).filter(cat => cat.services.length > 0);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30'
  ];

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {[1, 2, 3, 4, 5].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            stepNumber <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
          } font-bold transition-all duration-300`}>
            {stepNumber < step ? <Check className="w-5 h-5" /> : stepNumber}
          </div>
          {stepNumber < 5 && (
            <div className={`flex-1 h-1 mx-2 ${
              stepNumber < step ? 'bg-primary' : 'bg-gray-200'
            } transition-all duration-300`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">Выберите услугу</h2>
        <p className="text-gray-600">Что вас беспокоит?</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Поиск услуги..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all"
        />
      </div>

      <div className="max-h-96 overflow-y-auto space-y-4">
        {groupedServices.map((category) => (
          <div key={category.id}>
            <h3 className="font-bold text-lg mb-2 text-primary">{category.name}</h3>
            <div className="grid gap-2">
              {category.services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setBookingData({ ...bookingData, service });
                    nextStep();
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    bookingData.service?.id === service.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{service.description}</div>
                      <div className="text-sm text-gray-500 mt-2 flex gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.duration}
                        </span>
                        <span className="font-semibold text-primary">
                          от {service.price.toLocaleString()} ₽
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">Выберите врача</h2>
        <p className="text-gray-600">Или мы подберем первого свободного специалиста</p>
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto">
        <button
          onClick={() => {
            setBookingData({ ...bookingData, doctor: undefined });
            nextStep();
          }}
          className="p-4 rounded-xl border-2 border-dashed border-primary bg-primary/5 text-left hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg">Любой свободный врач</div>
              <div className="text-sm text-gray-600">Мы подберем специалиста, который сможет принять вас раньше всех</div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </button>

        {doctors.map((doctor) => (
          <button
            key={doctor.id}
            onClick={() => {
              setBookingData({ ...bookingData, doctor });
              nextStep();
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
              bookingData.doctor?.id === doctor.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={doctor.photo_url}
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-bold">{doctor.name}</div>
                <div className="text-sm text-gray-600">{doctor.specialization}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Стаж: {doctor.experience_years} {doctor.experience_years > 4 ? 'лет' : 'года'}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">Выберите дату и время</h2>
        <p className="text-gray-600">Когда вам удобно прийти?</p>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Дата приёма</h3>
        <div className="grid grid-cols-7 gap-2">
          {getAvailableDates().map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => setBookingData({ ...bookingData, date })}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                bookingData.date && isSameDay(bookingData.date, date)
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="text-xs">{format(date, 'EEE', { locale: ru })}</div>
              <div className="text-lg font-bold">{format(date, 'd')}</div>
              <div className="text-xs">{format(date, 'MMM', { locale: ru })}</div>
            </button>
          ))}
        </div>
      </div>

      {bookingData.date && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <h3 className="font-semibold mb-3">Время приёма</h3>
          <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => {
                  setBookingData({ ...bookingData, time });
                  nextStep();
                }}
                className={`p-3 rounded-xl border-2 text-center transition-all hover:shadow-md ${
                  bookingData.time === time
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">Ваши контакты</h2>
        <p className="text-gray-600">Как с вами связаться?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Ваше имя *</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={bookingData.name || ''}
              onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
              placeholder="Как к вам обращаться?"
              required
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Телефон *</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={bookingData.phone || ''}
              onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
              placeholder="+7 (___) ___-__-__"
              required
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Email (опционально)</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={bookingData.email || ''}
              onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Комментарий (опционально)</label>
          <div className="relative">
            <MessageCircle className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <textarea
              value={bookingData.comment || ''}
              onChange={(e) => setBookingData({ ...bookingData, comment: e.target.value })}
              placeholder="Расскажите о своих пожеланиях..."
              rows={3}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={nextStep}
        disabled={!bookingData.name || !bookingData.phone}
        className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Далее
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );

  const renderStep5 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {isSuccess ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Запись подтверждена!</h3>
          <p className="text-gray-600 text-lg">
            Мы отправили вам SMS с деталями записи
          </p>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold mb-2">Подтверждение записи</h2>
            <p className="text-gray-600">Проверьте данные перед подтверждением</p>
          </div>

          <div className="space-y-4 bg-gray-50 p-6 rounded-2xl">
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <div className="text-sm text-gray-600 mb-1">Услуга</div>
                <div className="font-bold">{bookingData.service?.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {bookingData.service?.duration} • {bookingData.service?.price.toLocaleString()} ₽
                </div>
              </div>
              <button onClick={() => setStep(1)} className="text-primary hover:underline text-sm">
                Изменить
              </button>
            </div>

            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <div className="text-sm text-gray-600 mb-1">Врач</div>
                <div className="font-bold">
                  {bookingData.doctor?.name || 'Любой свободный специалист'}
                </div>
                {bookingData.doctor && (
                  <div className="text-sm text-gray-600 mt-1">
                    {bookingData.doctor.specialization}
                  </div>
                )}
              </div>
              <button onClick={() => setStep(2)} className="text-primary hover:underline text-sm">
                Изменить
              </button>
            </div>

            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <div className="text-sm text-gray-600 mb-1">Дата и время</div>
                <div className="font-bold">
                  {bookingData.date && format(bookingData.date, 'd MMMM yyyy', { locale: ru })}
                </div>
                <div className="text-sm text-gray-600 mt-1">{bookingData.time}</div>
              </div>
              <button onClick={() => setStep(3)} className="text-primary hover:underline text-sm">
                Изменить
              </button>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-600 mb-1">Контакты</div>
                <div className="font-bold">{bookingData.name}</div>
                <div className="text-sm text-gray-600 mt-1">{bookingData.phone}</div>
                {bookingData.email && (
                  <div className="text-sm text-gray-600">{bookingData.email}</div>
                )}
              </div>
              <button onClick={() => setStep(4)} className="text-primary hover:underline text-sm">
                Изменить
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              'Отправка...'
            ) : (
              <>
                <Check className="w-6 h-6" />
                Подтвердить запись
              </>
            )}
          </button>
        </>
      )}
    </motion.div>
  );

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-dark p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="text-white pr-12 text-center">
                  <h2 className="text-2xl font-bold mb-1">Онлайн запись</h2>
                  <p className="text-sm opacity-90">Шаг {step} из {totalSteps}</p>
                </div>
              </div>

              <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                {renderStepIndicator()}

                <AnimatePresence mode="wait">
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  {step === 4 && renderStep4()}
                  {step === 5 && renderStep5()}
                </AnimatePresence>
              </div>

              {step > 1 && step < 5 && (
                <div className="p-6 border-t border-gray-200 flex gap-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Назад
                  </button>
                  {step === 3 && !bookingData.time && (
                    <button
                      disabled={!bookingData.date}
                      className="flex-1 py-3 rounded-xl bg-gray-300 text-gray-500 font-semibold cursor-not-allowed"
                    >
                      Выберите время
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
