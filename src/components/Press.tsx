import React from 'react';
import { motion } from 'framer-motion';
import { Award, Radio, Newspaper, Globe, Calendar, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Press: React.FC = () => {
  const publications = [
    {
      type: 'print',
      icon: <Newspaper className="w-8 h-8 text-primary" />,
      source: 'Газета "Алтайская правда"',
      date: '15 декабря 2024',
      title: 'Новая стоматология в Барнауле: семейный подход и современные технологии',
      genre: 'Интервью с главным врачом',
      topics: [
        'История создания клиники',
        'Философия семейного подхода',
        'Современное оборудование и методики',
        'Планы развития'
      ],
      excerpt: 'В интервью корреспонденту "Алтайской правды" главный врач клиники "Зубная Станция" Наталья Голева рассказала о том, как за короткое время клинике удалось завоевать доверие барнаульцев. "Мы изначально делали ставку на семейный подход, - говорит Наталья Федоровна. - У нас лечатся целые семьи: бабушки, родители, дети. Это создает особую атмосферу доверия и заботы." Особое внимание в интервью уделяется современному оборудованию клиники и доступным ценам для жителей Барнаула.',
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      type: 'radio',
      icon: <Radio className="w-8 h-8 text-primary" />,
      source: 'Радио "Барнаул FM"',
      date: '28 ноября 2024',
      title: 'Здоровый город',
      genre: 'Радиопрограмма',
      host: 'Александр Петров',
      guest: 'Голева Наталья Федоровна',
      duration: '15 минут',
      topics: [
        'Профилактика стоматологических заболеваний',
        'Современные методы безболезненного лечения',
        'Детская стоматология: как приучить ребенка не бояться стоматолога',
        'Мифы о стоматологии',
        'Ответы на вопросы слушателей'
      ],
      quote: 'Самое главное в детской стоматологии - это найти контакт с ребенком. Мы никогда не принуждаем, не торопим. Лучше потратить больше времени на знакомство, чем потом годами лечить страх перед стоматологами.',
      image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      type: 'internet',
      icon: <Globe className="w-8 h-8 text-primary" />,
      source: 'Портал "Алтай-инфо"',
      date: '10 октября 2024',
      title: 'Детская стоматология без слез: как в Барнауле лечат зубы малышам',
      genre: 'Репортаж',
      author: 'Светлана Иванова',
      description: 'Журналист провела день в клинике, наблюдая за работой детского стоматолога. В материале подробно описывается, как проходит прием маленьких пациентов, какие игровые методики используются, как родители готовят детей к лечению. Репортаж сопровождается фотографиями детского кабинета и интервью с родителями.',
      image: 'https://images.pexels.com/photos/6812540/pexels-photo-6812540.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      type: 'rating',
      icon: <Award className="w-8 h-8 text-primary" />,
      source: 'АМИК.РУ',
      date: '22 сентября 2024',
      title: 'ТОП-5 стоматологий Барнаула: выбор пациентов',
      position: '3 место из 50 клиник',
      criteria: [
        'Качество лечения (оценки пациентов)',
        'Доступность цен',
        'Современность оборудования',
        'Квалификация врачей',
        'Сервис и комфорт'
      ],
      comment: '"Зубная Станция" - яркий пример того, как молодая клиника может быстро завоевать признание пациентов. Высокие оценки получены за семейный подход, честные цены и профессионализм врачей.',
      image: 'https://images.pexels.com/photos/3845623/pexels-photo-3845623.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const achievements = [
    'ТОП-5 стоматологий Барнаула по версии пациентов (АМИК.РУ)',
    'Рейтинг 4.9 из 5 на всех площадках отзывов',
    '"Лучший дебют года" среди новых медицинских учреждений Алтайского края',
    '500+ довольных пациентов за первые 18 месяцев работы'
  ];

  const professionalEvents = [
    {
      title: 'Сибирский стоматологический форум',
      date: '15 ноября 2024',
      participant: 'Голева Наталья Федоровна',
      report: 'Семейная стоматология: индивидуальный подход к пациентам разных возрастов',
      topics: [
        'Особенности лечения детей разного возраста',
        'Работа с тревожными пациентами',
        'Создание доверительной атмосферы в клинике',
        'Междисциплинарный подход в семейной стоматологии'
      ]
    },
    {
      title: 'Мастер-класс по детской стоматологии',
      date: '3 октября 2024',
      organizer: '"Зубная Станция"',
      host: 'Детский стоматолог клиники',
      topic: 'Психологический подход в детской стоматологии',
      participants: '25 врачей из Барнаула и области'
    }
  ];

  const socialActivities = [
    {
      title: 'День защиты детей',
      date: '1 июня 2024',
      action: '"Здоровые зубки каждому ребенку"',
      participants: 'Дети из малообеспеченных семей',
      services: 'Бесплатные осмотры и лечение',
      result: 'Помощь 30 детям на сумму 150000 рублей'
    },
    {
      title: 'День пожилого человека',
      date: '1 октября 2024',
      action: '"Забота о старшем поколении"',
      participants: 'Пенсионеры района',
      services: 'Бесплатные консультации и профгигиена',
      result: 'Помощь 50 пенсионерам'
    }
  ];

  const educationalActivities = [
    {
      title: 'Лекции в школах',
      frequency: 'регулярно',
      topic: 'Гигиена полости рта и профилактика кариеса',
      audience: 'Школьники 1-11 классов',
      coverage: '500+ детей в год'
    },
    {
      title: 'Семинары для родителей',
      topic: 'Как сохранить здоровье зубов у детей',
      frequency: 'ежемесячно',
      venue: 'Клиника, детские сады'
    }
  ];

  const mediaPartners = {
    print: ['Газета "Алтайская правда"', 'Журнал "Медицина Барнаула"', 'Газета "Городская жизнь"'],
    radio: ['"Барнаул FM"', '"Радио России - Алтай"'],
    internet: ['АМИК.РУ', '"Алтай-инфо"', 'Barnaul22.ru']
  };

  const pressContacts = {
    name: 'Голева Наталья Федоровна',
    position: 'Пресс-секретарь',
    phone: '+7 (3852) 12-34-56',
    email: 'press@zubst.ru',
    hours: 'Пн-Пт 10:00-18:00'
  };

  const availableMaterials = [
    'Пресс-кит клиники (история, достижения, фото)',
    'Фотографии высокого разрешения',
    'Биографии врачей',
    'Статистика работы клиники',
    'Лицензии и сертификаты'
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-center mb-8">
            СМИ о нас
          </h1>
          
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Публикации, интервью и репортажи о "Зубной Станции" в средствах массовой информации
          </p>

          {/* Publications Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Публикации и упоминания</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {publications.map((publication, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-primary">{publication.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{publication.title}</h3>
                      <p className="text-gray-500 text-sm">{publication.source} • {publication.date}</p>
                      {publication.genre && <p className="text-primary font-medium text-sm mt-1">{publication.genre}</p>}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <img
                      src={publication.image}
                      alt={publication.title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                  
                  {publication.topics && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Основные темы:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {publication.topics.map((topic, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {publication.excerpt && (
                    <p className="text-gray-600 text-sm">{publication.excerpt}</p>
                  )}
                  
                  {publication.quote && (
                    <blockquote className="italic text-gray-600 border-l-4 border-primary pl-4 my-4">
                      "{publication.quote}"
                    </blockquote>
                  )}
                  
                  {publication.description && (
                    <p className="text-gray-600 text-sm">{publication.description}</p>
                  )}
                  
                  {publication.position && (
                    <div className="mt-4">
                      <p className="font-semibold text-primary">{publication.position}</p>
                      <h4 className="font-semibold mt-2 mb-1">Критерии оценки:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {publication.criteria?.map((criterion, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {criterion}
                          </li>
                        ))}
                      </ul>
                      {publication.comment && (
                        <blockquote className="italic text-gray-600 border-l-4 border-primary pl-4 mt-4">
                          {publication.comment}
                        </blockquote>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Achievements Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Достижения и награды</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">2024 год:</h3>
                <ul className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <Award className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <img
                  src="https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Награды и достижения"
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                />
              </div>
            </div>
          </motion.section>

          {/* Professional Events Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Участие в профессиональных мероприятиях</h2>
            <div className="space-y-8">
              {professionalEvents.map((event, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-gray-500 mb-4">{event.date}</p>
                      
                      {event.participant && (
                        <p className="mb-2">
                          <span className="font-medium">Участник:</span> {event.participant}
                        </p>
                      )}
                      
                      {event.organizer && (
                        <p className="mb-2">
                          <span className="font-medium">Организатор:</span> {event.organizer}
                        </p>
                      )}
                      
                      {event.host && (
                        <p className="mb-2">
                          <span className="font-medium">Ведущий:</span> {event.host}
                        </p>
                      )}
                      
                      {event.report && (
                        <p className="mb-2">
                          <span className="font-medium">Доклад:</span> "{event.report}"
                        </p>
                      )}
                      
                      {event.topic && (
                        <p className="mb-2">
                          <span className="font-medium">Тема:</span> "{event.topic}"
                        </p>
                      )}
                      
                      {event.participants && (
                        <p className="mb-2">
                          <span className="font-medium">Участники:</span> {event.participants}
                        </p>
                      )}
                      
                      {event.topics && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Основные тезисы:</h4>
                          <ul className="text-gray-600 space-y-1">
                            {event.topics.map((topic, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Social Activities Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Социальная деятельность</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Heart className="w-6 h-6 text-primary mr-2" />
                  Благотворительные акции
                </h3>
                <div className="space-y-6">
                  {socialActivities.map((activity, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                      <h4 className="font-semibold text-lg mb-2">{activity.title} - {activity.date}</h4>
                      <p className="text-primary font-medium mb-2">Акция: {activity.action}</p>
                      <p className="text-gray-600 text-sm mb-1">
                        <span className="font-medium">Участники:</span> {activity.participants}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        <span className="font-medium">Услуги:</span> {activity.services}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Результат:</span> {activity.result}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Users className="w-6 h-6 text-primary mr-2" />
                  Образовательная деятельность
                </h3>
                <div className="space-y-6">
                  {educationalActivities.map((activity, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                      <h4 className="font-semibold text-lg mb-2">{activity.title}</h4>
                      <p className="text-primary font-medium mb-2">Тема: {activity.topic}</p>
                      <p className="text-gray-600 text-sm mb-1">
                        <span className="font-medium">Частота:</span> {activity.frequency}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        <span className="font-medium">Аудитория:</span> {activity.audience}
                      </p>
                      {activity.coverage && (
                        <p className="text-gray-600 text-sm mb-1">
                          <span className="font-medium">Охват:</span> {activity.coverage}
                        </p>
                      )}
                      {activity.venue && (
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Место проведения:</span> {activity.venue}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Media Partners Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Медиа-партнеры</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Newspaper className="w-6 h-6 text-primary mr-2" />
                  Печатные издания
                </h3>
                <ul className="space-y-2">
                  {mediaPartners.print.map((partner, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Radio className="w-6 h-6 text-primary mr-2" />
                  Радиостанции
                </h3>
                <ul className="space-y-2">
                  {mediaPartners.radio.map((partner, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Globe className="w-6 h-6 text-primary mr-2" />
                  Интернет-порталы
                </h3>
                <ul className="space-y-2">
                  {mediaPartners.internet.map((partner, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Press Contacts Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 bg-white rounded-2xl p-8 shadow-md"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Контакты для СМИ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Пресс-секретарь</h3>
                <p className="mb-2">
                  <span className="font-medium">Имя:</span> {pressContacts.name}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Телефон:</span>{' '}
                  <a href={`tel:${pressContacts.phone}`} className="text-primary hover:underline">
                    {pressContacts.phone}
                  </a>
                </p>
                <p className="mb-2">
                  <span className="font-medium">Email:</span>{' '}
                  <a href={`mailto:${pressContacts.email}`} className="text-primary hover:underline">
                    {pressContacts.email}
                  </a>
                </p>
                <p className="mb-2">
                  <span className="font-medium">Время для интервью:</span> {pressContacts.hours}
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Доступные материалы</h3>
                <ul className="space-y-2">
                  {availableMaterials.map((material, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {material}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Хотите написать о нас?</h2>
            <p className="text-xl mb-8 opacity-90">
              Мы всегда открыты для сотрудничества с журналистами и блогерами
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:press@zubst.ru"
                className="bg-white text-primary px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-300"
              >
                Написать пресс-секретарю
              </a>
              <Link
                to="/contacts"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-colors duration-300"
              >
                Контактная информация
              </Link>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};