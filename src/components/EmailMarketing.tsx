import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Calendar, Heart, Lightbulb, Users } from 'lucide-react';

export const EmailMarketing: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const emailTopics = [
    {
      id: 'tips',
      title: 'Полезные советы',
      description: 'Как правильно ухаживать за зубами',
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
      frequency: '1 раз в неделю'
    },
    {
      id: 'promotions',
      title: 'Акции и скидки',
      description: 'Первыми узнавайте о специальных предложениях',
      icon: <Heart className="w-6 h-6 text-red-500" />,
      frequency: '2-3 раза в месяц'
    },
    {
      id: 'reminders',
      title: 'Напоминания',
      description: 'О профосмотрах и гигиене полости рта',
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
      frequency: 'По расписанию'
    },
    {
      id: 'family',
      title: 'Семейное здоровье',
      description: 'Советы по уходу за зубами всей семьи',
      icon: <Users className="w-6 h-6 text-green-500" />,
      frequency: '1 раз в месяц'
    }
  ];

  const newsletterExamples = [
    {
      title: '5 ошибок при чистке зубов',
      description: 'Узнайте, что вы делаете неправильно каждый день',
      date: 'Понедельник',
      category: 'Полезные советы'
    },
    {
      title: 'Скидка 30% на отбеливание',
      description: 'Только до конца месяца - профессиональное отбеливание',
      date: 'Среда',
      category: 'Акции'
    },
    {
      title: 'Время профосмотра!',
      description: 'Прошло 6 месяцев с последнего визита',
      date: 'Пятница',
      category: 'Напоминания'
    }
  ];

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || selectedTopics.length === 0) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setEmail('');
      setSelectedTopics([]);
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
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-8">
              Полезная рассылка о здоровье зубов
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Получайте персональные советы, напоминания о профосмотрах 
              и эксклюзивные предложения прямо на почту
            </p>
          </div>

          {/* Subscription Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Подписаться на рассылку</h2>
              
              {submitStatus === 'success' ? (
                <div className="bg-green-50 rounded-2xl p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Спасибо за подписку!</h3>
                  <p className="text-gray-600">
                    Первое письмо придёт в течение часа. Проверьте папку "Спам".
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ваш email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                      placeholder="example@mail.ru"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Что вас интересует? (выберите темы)
                    </label>
                    <div className="space-y-3">
                      {emailTopics.map((topic) => (
                        <label
                          key={topic.id}
                          className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                            selectedTopics.includes(topic.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic.id)}
                            onChange={() => handleTopicToggle(topic.id)}
                            className="sr-only"
                          />
                          <div className="mr-4">{topic.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{topic.title}</h4>
                            <p className="text-gray-600 text-sm mb-1">{topic.description}</p>
                            <p className="text-gray-500 text-xs">{topic.frequency}</p>
                          </div>
                          {selectedTopics.includes(topic.id) && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !email || selectedTopics.length === 0}
                    className={`w-full bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center ${
                      isSubmitting || !email || selectedTopics.length === 0 
                        ? 'opacity-50 cursor-not-allowed' 
                        : ''
                    }`}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Подписываем...' : 'Подписаться на рассылку'}
                  </button>

                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-sm text-center">
                      Произошла ошибка. Пожалуйста, попробуйте позже.
                    </p>
                  )}

                  <p className="text-sm text-gray-500 text-center">
                    Отписаться можно в любой момент одним кликом
                  </p>
                </form>
              )}
            </div>

            {/* Newsletter Examples */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Примеры наших писем</h3>
              <div className="space-y-4">
                {newsletterExamples.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md border-l-4 border-primary"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-primary font-medium">{example.category}</span>
                      <span className="text-sm text-gray-500">{example.date}</span>
                    </div>
                    <h4 className="font-semibold mb-2">{example.title}</h4>
                    <p className="text-gray-600 text-sm">{example.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-md"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Почему стоит подписаться</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">Полезный контент</h3>
                <p className="text-gray-600">Только проверенная информация от врачей</p>
              </div>
              
              <div className="text-center">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">Эксклюзивные акции</h3>
                <p className="text-gray-600">Скидки только для подписчиков</p>
              </div>
              
              <div className="text-center">
                <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">Персональные напоминания</h3>
                <p className="text-gray-600">О профосмотрах и важных процедурах</p>
              </div>
              
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">Никакого спама</h3>
                <p className="text-gray-600">Только важная и полезная информация</p>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};