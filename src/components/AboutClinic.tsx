import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Users, Award, Clock, MapPin, Phone, Mail } from 'lucide-react';

export const AboutClinic: React.FC = () => {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#002B49] mb-6">
            От мечты к реальности
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            История создания клиники, где каждый пациент чувствует себя как дома
          </p>
        </motion.section>

        {/* Director Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold text-[#002B49] mb-2">
                  Голева Наталья Федоровна
                </h2>
                <p className="text-primary text-lg mb-4">Главный врач и директор клиники</p>
                <p className="text-gray-700 mb-4">
                  "Моя история началась с простой мечты - создать место, где люди не боятся лечить зубы. 
                  Где врач не просто лечит, а объясняет, поддерживает и дает время на принятие решения. 
                  В 2023 году эта мечта стала реальностью."
                </p>
                <p className="text-gray-700">
                  "Почему я выбрала стоматологию? Потому что улыбка - это первое, что видят люди. 
                  И когда человек начинает улыбаться без стеснения после лечения - это дорогого стоит."
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Голева Наталья Федоровна"
                  className="w-full h-80 object-cover rounded-xl shadow-md"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Philosophy Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Наша философия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Делаем стоматологию человечной</h3>
              <p className="text-gray-600">
                Никого не заставляем лечиться. Объясняем всё простыми словами. 
                Даём время на принятие решения. Лечим так, как лечили бы себе.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Барнаул заслуживает лучшего</h3>
              <p className="text-gray-600">
                Наш родной город заслуживает современную стоматологию европейского уровня. 
                Мы связаны с местным сообществом и планируем развиваться здесь.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Семья важнее бизнеса</h3>
              <p className="text-gray-600">
                У нас лечатся целые семьи: бабушки, родители, дети. 
                Это создает особую атмосферу доверия и заботы, которую не купишь за деньги.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Постоянно учимся новому</h3>
              <p className="text-gray-600">
                Медицина не стоит на месте. Регулярно проходим обучение, 
                изучаем новые методы, внедряем современные технологии.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Safety System Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Система безопасности в "Зубной Станции"</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Система стерилизации"
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">"Не навреди" - превыше всего</h3>
                <p className="text-gray-700 mb-6">
                  Безопасность пациентов - это основа нашей работы. Мы соблюдаем строжайшие 
                  протоколы стерилизации и честно говорим о ценах и сроках лечения:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">1</div>
                    <div>
                      <h4 className="font-semibold">Честные цены без доплат</h4>
                      <p className="text-gray-600">Все цены фиксируются в договоре</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">2</div>
                    <div>
                      <h4 className="font-semibold">Гарантия 5 лет на большинство работ</h4>
                      <p className="text-gray-600">Мы уверены в качестве нашего лечения</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">3</div>
                    <div>
                      <h4 className="font-semibold">Рассрочка без процентов и справок</h4>
                      <p className="text-gray-600">Доступное лечение для каждой семьи</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mt-6">
                  Система "Семейная карта" со скидками до 20% делает качественную стоматологию 
                  доступной для всех жителей Барнаула.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Achievements Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Наши достижения с 2023 года</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1247</div>
              <div className="text-gray-600">счастливых пациентов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2500+</div>
              <div className="text-gray-600">процедур без боли</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600">пациентов возвращаются</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.9</div>
              <div className="text-gray-600">рейтинг на всех площадках</div>
            </div>
          </div>
        </motion.section>

        {/* Advantages Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают "Зубную Станцию"</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Лечим всю семью в одном месте</h3>
              <p className="text-gray-600">
                От малышей до бабушек и дедушек. Детская игровая зона, семейные скидки, 
                удобная парковка в центре Барнаула.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <Clock className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Рассрочка без процентов и справок</h3>
              <p className="text-gray-600">
                Качественное лечение доступно каждой семье. Оформление за 5 минут, 
                только паспорт. До 12 месяцев без переплат.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <Phone className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Система "Семейная карта"</h3>
              <p className="text-gray-600">
                Скидки до 20% для всей семьи. Накопительная система бонусов. 
                Персональные напоминания о профосмотрах.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <Mail className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Гарантия 5 лет на большинство работ</h3>
              <p className="text-gray-600">
                Мы уверены в качестве нашего лечения. Используем материалы премиум-класса 
                и даем расширенную гарантию.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};