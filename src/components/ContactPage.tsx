import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { YMaps, Map, Placemark, ZoomControl, FullscreenControl, GeolocationControl } from '@pbe/react-yandex-maps';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Car,
  AlertCircle,
  Send,
  CheckCircle,
  MessageCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: 'Адрес клиники',
      content: '656037, Алтайский край\nг. Барнаул, ул. Панфиловцев, д. 14'
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: 'Телефон',
      content: '+7-961-978-54-54\nОтветим в течение 5 минут'
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: 'Режим работы',
      content: 'Будни: 8:00-20:00\nСуббота: 9:00-18:00\nВоскресенье: выходной\nЭкстренная связь: круглосуточно'
    },
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: 'Email',
      content: 'record@zubst.ru - запись\ninfo@zubst.ru - вопросы\ndirector@zubst.ru - руководство'
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-primary" />,
      title: 'Соцсети',
      content: 'VK, Telegram, Instagram\n2GIS, Yandex Карты\nОтветим в течение 5 минут'
    },
    {
      icon: <Car className="w-6 h-6 text-primary" />,
      title: 'Экстренная помощь',
      content: 'Острая боль: принимаем без записи\nТравма зуба: в течение часа\nДежурный врач: +7 961 978 5454'
    }
  ];

  const directions = [
    {
      icon: '🚌',
      title: 'На общественном транспорте',
      details: [
        'Автобусы: № 17, 25, 36, 144',
        'Остановка: "Панфиловцев"',
        'От остановки: 2 минуты пешком'
      ]
    },
    {
      icon: '🚗',
      title: 'На автомобиле',
      details: [
        'Из центра: по пр. Ленина до ул. Панфиловцев',
        'Парковка: бесплатная, возле здания',
        'Навигатор: ул. Панфиловцев, 14'
      ]
    },
    {
      icon: '🚶',
      title: 'Пешком',
      details: [
        'От ж/д вокзала: 15 минут',
        'От автовокзала: 20 минут',
        'Ориентиры: рядом с торговым центром'
      ]
    }
  ];

  const legalInfo = [
    {
      title: 'Полное наименование',
      content: 'Общество с ограниченной ответственностью "Зубная Станция"'
    },
    {
      title: 'Юридический адрес',
      content: '656037, Алтайский край, г. Барнаул, ул. Панфиловцев, д. 14'
    },
    {
      title: 'ИНН / ОГРН',
      content: 'ИНН: 2222901480\nОГРН: 1232200005245'
    },
    {
      title: 'Генеральный директор',
      content: 'Голева Наталья Федоровна'
    },
    {
      title: 'Лицензия',
      content: 'Лицензия на медицинскую деятельность\n(номер и дата выдачи уточняются)'
    },
    {
      title: 'Банковские реквизиты',
      content: 'Расчетный счет: уточняется\nБанк: уточняется'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          ...formData,
          type: 'Запись через контакты'
        }),
      });

      if (!response.ok) throw new Error('Failed to submit form');

      setSubmitStatus('success');
      setFormData({
        name: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
            Контакты
          </h1>
          
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Мы находимся в центре Барнаула и всегда готовы помочь
          </p>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-md text-center"
              >
                <div className="mb-4 flex justify-center">{info.icon}</div>
                <h3 className="text-lg font-semibold mb-3">{info.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Map Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Как нас найти</h2>
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <YMaps>
                <div className="h-96 rounded-xl overflow-hidden">
                  <Map 
                    defaultState={{ 
                      center: [53.347626, 83.776287], 
                      zoom: 16,
                      controls: []
                    }}
                    width="100%"
                    height="100%"
                  >
                    <Placemark 
                      geometry={[53.347626, 83.776287]} 
                      options={{
                        preset: 'islands#blueHealthcareIcon',
                        iconColor: '#2176FF',
                        balloonContentHeader: 'Зубная Станция',
                        balloonContentBody: 'Семейная стоматология',
                        balloonContentFooter: 'ул. Панфиловцев, 14, Барнаул'
                      }}
                      properties={{
                        balloonContentHeader: 'Зубная Станция',
                        balloonContentBody: 'Семейная стоматология<br/>Телефон: +7-961-978-54-54',
                        balloonContentFooter: 'ул. Панфиловцев, 14, Барнаул'
                      }}
                    />
                    <ZoomControl options={{ float: 'right' }} />
                    <FullscreenControl />
                    <GeolocationControl options={{ float: 'left' }} />
                  </Map>
                </div>
              </YMaps>
            </div>
          </motion.section>

          {/* Directions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Как добраться</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {directions.map((direction, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="text-4xl mb-4 text-center">{direction.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-center">{direction.title}</h3>
                  <ul className="space-y-2">
                    {direction.details.map((detail, i) => (
                      <li key={i} className="text-gray-600">
                        <strong>{detail.split(':')[0]}:</strong> {detail.split(':').slice(1).join(':')}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Parking and Transport Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  🚗 Парковка
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 15 бесплатных мест у клиники</li>
                  <li>• Платная парковка ТЦ "Европа" (50₽/час)</li>
                  <li>• Остановка "Панфиловцев" (50м от входа)</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  🚌 Общественный транспорт
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Автобусы: №1, 15, 22 до ост. "Панфиловцев"</li>
                  <li>• Маршрутки: №5, 17, 45</li>
                  <li>• Такси: ~150₽ от центра</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Social Media Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Мы в соцсетях</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <a
                href="https://vk.com/zubst"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center group"
              >
                <span className="text-5xl mb-3">📱</span>
                <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">VK</span>
                <span className="text-xs text-gray-500 mt-1">ВКонтакте</span>
              </a>

              <a
                href="https://t.me/zub_st"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center group"
              >
                <Send className="w-12 h-12 mb-3 text-sky-500 group-hover:text-sky-600 transition-colors" />
                <span className="font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">Telegram</span>
                <span className="text-xs text-gray-500 mt-1">Мессенджер</span>
              </a>

              <a
                href="https://www.instagram.com/zubnayast?igsh=MTNwbGo3c3o4Y2NwZQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center group"
              >
                <span className="text-5xl mb-3">📸</span>
                <span className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">Instagram</span>
                <span className="text-xs text-gray-500 mt-1">Фото и видео</span>
              </a>

              <a
                href="https://wa.me/79619785454"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center group"
              >
                <MessageCircle className="w-12 h-12 mb-3 text-green-500 group-hover:text-green-600 transition-colors" />
                <span className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">WhatsApp</span>
                <span className="text-xs text-gray-500 mt-1">Чат</span>
              </a>

              <a
                href="https://2gis.ru/barnaul/geo/70000001085665549"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center group"
              >
                <span className="text-5xl mb-3">🗺️</span>
                <span className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">2GIS</span>
                <span className="text-xs text-gray-500 mt-1">На карте</span>
              </a>

              <a
                href="https://yandex.ru/maps/org/zubnaya_stantsiya/160523065239?si=bh6f5fxy24ttcc8uekgpxc2c7c"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center group"
              >
                <span className="text-5xl mb-3">📍</span>
                <span className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">Yandex</span>
                <span className="text-xs text-gray-500 mt-1">Яндекс Карты</span>
              </a>
            </div>
          </motion.section>

          {/* Contact Form */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Записаться на прием</h2>
                <p className="text-gray-600 mb-8">
                  Оставьте заявку, и мы свяжемся с вами в течение 5 минут для подтверждения записи
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Запись за 30 секунд</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Приём в день обращения</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Бесплатная консультация</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Подарок: набор для ухода</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-md">
                {submitStatus === 'success' ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Спасибо за заявку!</h3>
                    <p className="text-gray-600">
                      Мы свяжемся с вами в ближайшее время для подтверждения записи.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-service" className="block text-sm font-medium text-gray-700 mb-1">
                        Интересующая услуга
                      </label>
                      <select
                        id="contact-service"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                      >
                        <option value="">Выберите услугу</option>
                        <option value="consultation">Консультация</option>
                        <option value="therapy">Лечение зубов</option>
                        <option value="orthodontics">Исправление прикуса</option>
                        <option value="implantology">Имплантация</option>
                        <option value="prosthetics">Протезирование</option>
                        <option value="surgery">Удаление зубов</option>
                        <option value="pediatric">Детская стоматология</option>
                        <option value="prevention">Профилактика</option>
                        <option value="emergency">Экстренная помощь</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-date" className="block text-sm font-medium text-gray-700 mb-1">
                          Предпочтительная дата
                        </label>
                        <input
                          type="date"
                          id="contact-date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-time" className="block text-sm font-medium text-gray-700 mb-1">
                          Удобное время
                        </label>
                        <select
                          id="contact-time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                        >
                          <option value="">Выберите время</option>
                          <option value="morning">Утром (9:00-12:00)</option>
                          <option value="afternoon">Днем (12:00-16:00)</option>
                          <option value="evening">Вечером (16:00-20:00)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                        Дополнительная информация
                      </label>
                      <textarea
                        id="contact-message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                        placeholder="Опишите ваши пожелания или проблему..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {isSubmitting ? 'Отправка...' : 'Записаться на прием'}
                    </button>

                    {submitStatus === 'error' && (
                      <p className="text-red-500 text-sm text-center">
                        Произошла ошибка. Пожалуйста, попробуйте позже.
                      </p>
                    )}

                    <p className="text-sm text-gray-500 text-center">
                      Нажимая кнопку, вы соглашаетесь с{' '}
                      <a href="/privacy/" className="text-primary hover:underline">
                        политикой обработки персональных данных
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.section>

          {/* Legal Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-md"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Юридическая информация</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {legalInfo.map((info, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                  <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
                </div>
              ))}
            </div>
            <p>Лицензия № Л041-01151-22/01108315 от 27.03.2024 г.<br />
            выдана Министерством здравоохранения Алтайского края</p>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};