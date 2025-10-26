import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Users, Award, Send, CheckCircle } from 'lucide-react';
import { AppointmentModal } from './AppointmentModal';

export const TeamStories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    name: '',
    position: '',
    experience: '',
    phone: '',
    email: '',
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const doctors = [
    {
      name: 'Голева Наталья Федоровна',
      position: 'Главный врач, стоматолог-терапевт',
      badge: 'Основатель',
      badgeColor: 'bg-green-500',
      story: 'Моя история началась с мечты создать место, где каждый пациент чувствует себя как дома. В 2023 году эта мечта стала реальностью — родилась "Зубная Станция". Здесь мы лечим не просто зубы, мы дарим уверенность в себе.',
      achievements: [
        '500+ успешных лечений',
        'Основатель семейного подхода в Барнауле',
        'Регулярное повышение квалификации'
      ],
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600',
      isExisting: true
    },
    {
      name: 'Присоединяйся к нам!',
      position: 'Врач-ортодонт',
      badge: 'Новый член команды',
      badgeColor: 'bg-blue-500',
      story: 'Эта история еще пишется... Мы ищем талантливого ортодонта, который станет частью нашей семьи и поможет людям обрести красивые улыбки. Возможно, это будешь ты?',
      achievements: [
        'Возможность профессионального роста',
        'Современное оборудование',
        'Дружная команда единомышленников'
      ],
      image: 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=600',
      isExisting: false,
      jobPosition: 'orthodontist'
    },
    {
      name: 'Здесь можешь быть ты',
      position: 'Врач-имплантолог',
      badge: 'Ждем тебя',
      badgeColor: 'bg-purple-500',
      story: 'Представь: ты помогаешь людям вернуть уверенность в себе, работаешь с современными технологиями в дружной команде. Начни писать свою историю в "Зубной Станции" уже сегодня!',
      achievements: [
        'Работа с топовыми системами имплантов',
        'Поддержка в развитии навыков',
        'Конкурентная зарплата'
      ],
      image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600',
      isExisting: false,
      jobPosition: 'implantologist'
    },
    {
      name: 'Здесь можешь быть ты',
      position: 'Детский стоматолог',
      badge: 'Мечтаем о тебе',
      badgeColor: 'bg-pink-500',
      story: 'Дети — это наше будущее. Мы ищем врача, который умеет находить общий язык с маленькими пациентами и делать их визиты радостными. Может быть, это твоя история?',
      achievements: [
        'Работа с самыми милыми пациентами',
        'Специальная детская зона',
        'Благодарные родители'
      ],
      image: 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=600',
      isExisting: false,
      jobPosition: 'pediatric'
    }
  ];

  const teamTestimonials = [
    {
      quote: 'В "Зубной Станции" я нашла не просто работу, а место где могу реализовать свои профессиональные амбиции и помогать людям. Здесь ценят каждого сотрудника.',
      author: 'Наталья Ф., главный врач'
    },
    {
      quote: 'Современное оборудование, дружная команда, возможность постоянно учиться новому — это именно то, что нужно для профессионального роста.',
      author: 'Мария А., ассистент врача'
    },
    {
      quote: 'Семейная атмосфера в клинике передается и пациентам. Работать здесь — это не просто лечить зубы, это дарить людям радость и уверенность.',
      author: 'Анна С., администратор'
    }
  ];

  const handleDoctorAction = (doctor: any, actionType: 'appointment' | 'blog') => {
    if (doctor.isExisting) {
      if (actionType === 'appointment') {
        setSelectedDoctor(doctor.name);
        setIsModalOpen(true);
      } else {
        // Navigate to blog or doctor's page
        window.location.href = '/blog';
      }
    } else {
      // Open job application form
      setJobFormData({ ...jobFormData, position: doctor.jobPosition });
      setIsJobFormOpen(true);
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
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
          ...jobFormData,
          type: 'Заявка на работу'
        }),
      });

      if (!response.ok) throw new Error('Failed to submit application');

      setSubmitStatus('success');
      setTimeout(() => {
        setIsJobFormOpen(false);
        setSubmitStatus('idle');
        setJobFormData({
          name: '',
          position: '',
          experience: '',
          phone: '',
          email: '',
          motivation: ''
        });
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#002B49] mb-6">
            Наши истории
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
            Каждый врач "Зубной Станции" — это уникальная история профессионального роста, 
            заботы о пациентах и любви к своему делу. Мы создаем не просто клинику, 
            а сообщество единомышленников.
          </p>

          {/* Join Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              🌟 Хочешь попасть сюда и написать свою историю?
            </h2>
            <p className="text-xl opacity-90 mb-6">
              Присоединяйся к нашей команде! Мы всегда ищем талантливых врачей, 
              которые разделяют наши ценности и готовы расти вместе с нами.
            </p>
            <button
              onClick={() => setIsJobFormOpen(true)}
              className="bg-white text-primary px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Присоединиться к команде
            </button>
          </motion.div>
        </motion.div>

        {/* Team Photo Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <img
            src="https://files.salebot.pro/uploads/file_item/file/449726/GUbc5XlceeL9-5gSQR2xT_oyXgiToDKJ5MtbqJ58bYx4Qf2KRF5wprzRkDQcyh6l3dwpqI8XNAaBS2M820RjDA__.jpeg"
            alt="Команда Зубной Станции"
            className="w-full h-[400px] object-cover object-center rounded-2xl shadow-lg"
            loading="lazy"
          />
        </motion.section>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {doctors.map((doctor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className={`absolute top-4 right-4 ${doctor.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                  {doctor.badge}
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#002B49] mb-2">{doctor.name}</h3>
                <p className="text-primary font-medium mb-4">{doctor.position}</p>
                
                <p className="text-gray-600 italic mb-6 leading-relaxed">
                  "{doctor.story}"
                </p>

                <div className="mb-6">
                  {doctor.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-center mb-2">
                      <span className="text-green-500 mr-2 font-bold">
                        {doctor.isExisting ? '✓' : '⭐'}
                      </span>
                      <span className="text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  {doctor.isExisting ? (
                    <>
                      <button
                        onClick={() => handleDoctorAction(doctor, 'appointment')}
                        className="flex-1 bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-dark transition-colors duration-300"
                      >
                        Записаться
                      </button>
                      <button
                        onClick={() => handleDoctorAction(doctor, 'blog')}
                        className="flex-1 border-2 border-primary text-primary py-3 px-4 rounded-xl font-medium hover:bg-primary hover:text-white transition-colors duration-300"
                      >
                        Читать блог
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setJobFormData({ ...jobFormData, position: doctor.jobPosition || '' });
                        setIsJobFormOpen(true);
                      }}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Подать заявку
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-[#002B49]">
            Что говорят члены нашей команды
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamTestimonials.map((testimonial, index) => (
              <div key={index} className="text-center">
                <p className="text-lg text-gray-700 italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <p className="text-primary font-medium">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Job Application Modal */}
      {isJobFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-3xl font-bold text-[#002B49] mb-6 text-center">
              Готов написать свою историю в "Зубной Станции"?
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Отправь нам заявку и расскажи, какую историю ты хочешь создать вместе с нами
            </p>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Спасибо за заявку!</h3>
                <p className="text-gray-600">
                  Мы рассмотрим вашу кандидатуру и свяжемся с вами в ближайшее время.
                </p>
              </div>
            ) : (
              <form onSubmit={handleJobSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobFormData.name}
                    onChange={(e) => setJobFormData({ ...jobFormData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Интересующая позиция *
                  </label>
                  <select
                    required
                    value={jobFormData.position}
                    onChange={(e) => setJobFormData({ ...jobFormData, position: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                  >
                    <option value="">Выберите позицию</option>
                    <option value="orthodontist">Врач-ортодонт</option>
                    <option value="implantologist">Врач-имплантолог</option>
                    <option value="pediatric">Детский стоматолог</option>
                    <option value="therapist">Врач-терапевт</option>
                    <option value="surgeon">Врач-хирург</option>
                    <option value="assistant">Ассистент врача</option>
                    <option value="administrator">Администратор</option>
                    <option value="other">Другая позиция</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Опыт работы
                  </label>
                  <select
                    value={jobFormData.experience}
                    onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                  >
                    <option value="">Выберите опыт</option>
                    <option value="no-experience">Без опыта</option>
                    <option value="1-3">1-3 года</option>
                    <option value="3-5">3-5 лет</option>
                    <option value="5+">Более 5 лет</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      required
                      value={jobFormData.phone}
                      onChange={(e) => setJobFormData({ ...jobFormData, phone: e.target.value })}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={jobFormData.email}
                      onChange={(e) => setJobFormData({ ...jobFormData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Почему хотите работать именно у нас? *
                  </label>
                  <textarea
                    required
                    value={jobFormData.motivation}
                    onChange={(e) => setJobFormData({ ...jobFormData, motivation: e.target.value })}
                    placeholder="Расскажите о своей мотивации и планах..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsJobFormOpen(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-300"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 bg-green-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-600 transition-colors duration-300 flex items-center justify-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                  </button>
                </div>

                {submitStatus === 'error' && (
                  <p className="text-red-500 text-sm text-center">
                    Произошла ошибка. Пожалуйста, попробуйте позже.
                  </p>
                )}

                <p className="text-sm text-gray-500 text-center">
                  Прикрепить резюме можно в ответном письме или принести на собеседование
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDoctor('');
        }}
        selectedDoctor={selectedDoctor}
      />
    </div>
  );
};