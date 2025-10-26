import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';

export const PatientReviews: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    rating: '',
    review: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const reviews = [
    {
      id: 1,
      name: 'Мария К.',
      date: '15 января 2025',
      text: 'Проходила лечение у Натальи Федоровны. Очень довольна результатом! Врач профессиональный, внимательный, все объяснила подробно. Лечение прошло безболезненно. Клиника чистая, современная. Однозначно рекомендую!',
      rating: 5,
      service: 'Лечение кариеса',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'
    },
    {
      id: 2,
      name: 'Алексей В.',
      date: '10 января 2025',
      text: 'Делал имплантацию зуба. Операция прошла быстро и без осложнений. Врач-имплантолог - настоящий профессионал! Все этапы объяснили заранее, никаких неожиданностей не было. Цены адекватные для Барнаула. Спасибо за качественную работу!',
      rating: 5,
      service: 'Имплантация',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'
    },
    {
      id: 3,
      name: 'Елена С.',
      date: '28 декабря 2024',
      text: 'Привела дочку на лечение зубов. Ребенок не боялся, врач нашла подход. Все сделали аккуратно и быстро. Цены приемлемые, персонал дружелюбный. Будем обращаться еще!',
      rating: 5,
      service: 'Детская стоматология',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'
    },
    {
      id: 4,
      name: 'Дмитрий П.',
      date: '20 декабря 2024',
      text: 'Ставил брекеты. Ортодонт подробно рассказал о процессе лечения, составил план. Коррекции проходят по графику, результат уже заметен. Очень доволен выбором клиники!',
      rating: 5,
      service: 'Ортодонтия',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'
    },
    {
      id: 5,
      name: 'Ирина М.',
      date: '15 декабря 2024',
      text: 'Делала профессиональную чистку зубов. Процедура комфортная, результат отличный. Гигиенист работает аккуратно, дает рекомендации по уходу. Рекомендую для профилактики!',
      rating: 5,
      service: 'Профессиональная гигиена',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'
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
          type: 'Отзыв'
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      setSubmitStatus('success');
      setFormData({
        name: '',
        phone: '',
        service: '',
        rating: '',
        review: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
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
            Отзывы пациентов
          </h1>
          
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Что говорят о нас наши пациенты
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.9</div>
              <div className="text-gray-600 mb-2">Средняя оценка</div>
              <div className="flex justify-center">{renderStars(5)}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-gray-600">Положительных отзывов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray-600">Рекомендуют друзьям</div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{review.name}</h3>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="text-gray-700 mb-4">{review.text}</p>
                <div className="text-sm text-primary font-medium">
                  Услуга: {review.service}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Review Form */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Оставить отзыв</h2>
            
            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="text-green-500 text-xl mb-2">✓</div>
                <h3 className="text-xl font-semibold mb-2">Спасибо за отзыв!</h3>
                <p className="text-gray-600">
                  Ваш отзыв поможет другим пациентам сделать правильный выбор.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      id="review-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="review-phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      id="review-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="review-service" className="block text-sm font-medium text-gray-700 mb-1">
                    Услуга
                  </label>
                  <select
                    id="review-service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                  >
                    <option value="">Выберите услугу</option>
                    <option value="therapy">Терапевтическая стоматология</option>
                    <option value="orthodontics">Ортодонтия</option>
                    <option value="implantology">Имплантология</option>
                    <option value="surgery">Хирургическая стоматология</option>
                    <option value="prosthetics">Ортопедия</option>
                    <option value="pediatric">Детская стоматология</option>
                    <option value="prevention">Профилактика и гигиена</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Оценка *</label>
                  <div className="flex space-x-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={formData.rating === rating.toString()}
                          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                          className="sr-only"
                        />
                        <div className="flex">
                          {Array.from({ length: rating }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-8 h-8 ${
                                formData.rating === rating.toString()
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 hover:text-yellow-400'
                              }`}
                            />
                          ))}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-1">
                    Текст отзыва *
                  </label>
                  <textarea
                    id="review-text"
                    required
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                    placeholder="Расскажите о своем опыте лечения в клинике..."
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
                  {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                </button>

                {submitStatus === 'error' && (
                  <p className="text-red-500 text-sm text-center">
                    Произошла ошибка. Пожалуйста, попробуйте позже.
                  </p>
                )}
              </form>
            )}
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};