export interface MetroStation {
  id: string;
  name: string;
  path: string;
  icon: string; // Emoji or SVG path
  description: string;
  preview?: string; // Text for hover preview
  badge?: string; // Text for badge
  badgeColor?: string; // Tailwind class for badge color
  animation?: string; // CSS animation class
  isHub?: boolean; // Indicates a transfer station
  quickActions?: string[]; // Quick action buttons
  substations?: MetroStation[]; // For complex stations like "Услуги"
}

export interface MetroLine {
  id: string;
  name: string;
  color: {
    main: string;
    hover: string;
    active: string;
    flash?: string; // For emergency line
  };
  stations: MetroStation[];
}

export const metroNavigationData: MetroLine[] = [
  {
    id: 'blue',
    name: 'СИНЯЯ ЛИНИЯ "ЗНАКОМСТВО"',
    color: {
      main: '#2E86C1', // доверие, профессионализм
      hover: '#3498DB', // более яркий синий
      active: '#85C1E9', // светло-голубой
    },
    stations: [
      {
        id: 'about',
        name: 'О КЛИНИКЕ',
        path: '/about',
        icon: '🏥',
        description: 'Узнайте нашу историю',
        preview: '5 лет заботы о барнаульцах',
      },
      {
        id: 'team',
        name: 'КОМАНДА',
        path: '/team',
        icon: '👥',
        description: 'Познакомьтесь с нашей семьёй',
        preview: '8 специалистов, 1 цель',
      },
      {
        id: 'press',
        name: 'СМИ О НАС',
        path: '/press',
        icon: '📺',
        description: 'Что пишут журналисты',
        preview: '15 публикаций в местных СМИ',
      },
      {
        id: 'virtual-tour',
        name: 'ВИРТУАЛЬНЫЙ ТУР',
        path: '/virtual-tour',
        icon: '🎥',
        description: 'Прогуляйтесь по клинике',
        preview: '360° панорама кабинетов',
      },
    ],
  },
  {
    id: 'green',
    name: 'ЗЕЛЁНАЯ ЛИНИЯ "ЛЕЧЕНИЕ"',
    color: {
      main: '#28B463', // здоровье, рост
      hover: '#2ECC71', // яркий зелёный
      active: '#82E5AA', // мятный
    },
    stations: [
      {
        id: 'services',
        name: 'УСЛУГИ',
        path: '/services',
        icon: '🦷',
        description: 'Полный спектр лечения',
        preview: 'Терапия • Хирургия • Имплантация',
        isHub: true,
        substations: [
          {
            id: 'therapy',
            name: 'ТЕРАПИЯ',
            path: '/services#therapy',
            icon: '🩺',
            description: 'Лечение кариеса и пульпита',
          },
          {
            id: 'surgery',
            name: 'ХИРУРГИЯ',
            path: '/services#surgery',
            icon: '🔪',
            description: 'Удаление зубов и операции',
          },
          {
            id: 'orthopedics',
            name: 'ОРТОПЕДИЯ',
            path: '/services#orthopedics',
            icon: '👑',
            description: 'Коронки и протезы',
          },
          {
            id: 'implantation',
            name: 'ИМПЛАНТАЦИЯ',
            path: '/services#implantation',
            icon: '🦴',
            description: 'Восстановление зубов',
          },
          {
            id: 'pediatric',
            name: 'ДЕТСКАЯ',
            path: '/services#pediatric',
            icon: '👶',
            description: 'Лечение детских зубов',
          },
          {
            id: 'hygiene',
            name: 'ПРОФГИГИЕНА',
            path: '/services#hygiene',
            icon: '✨',
            description: 'Чистка и профилактика',
          },
        ],
      },
      {
        id: 'doctors',
        name: 'ВРАЧИ',
        path: '/doctors',
        icon: '👨‍⚕️',
        description: 'Выберите своего доктора',
        preview: 'Опыт от 5 до 15 лет',
        isHub: true,
        quickActions: ['Записаться к врачу'],
        badge: 'Записаться сейчас',
        badgeColor: 'bg-green-500',
      },
      {
        id: 'prices',
        name: 'ЦЕНЫ',
        path: '/prices',
        icon: '💰',
        description: 'Честные цены без сюрпризов',
        preview: 'от 1500₽ • Рассрочка 0%',
        isHub: true,
        quickActions: ['Калькулятор стоимости'],
        badge: 'Калькулятор',
        badgeColor: 'bg-blue-500',
      },
      {
        id: 'portfolio',
        name: 'НАШИ РАБОТЫ',
        path: '/portfolio',
        icon: '✨',
        description: 'Результаты лечения',
        preview: '100+ случаев до/после',
      },
    ],
  },
  {
    id: 'yellow',
    name: 'ЖЁЛТАЯ ЛИНИЯ "ВЫГОДА"',
    color: {
      main: '#F39C12', // энергия, оптимизм
      hover: '#E67E22', // оранжевый
      active: '#F8C471', // светло-жёлтый
    },
    stations: [
      {
        id: 'subscriptions',
        name: 'АБОНЕМЕНТЫ',
        path: '/subscriptions',
        icon: '🎫',
        description: 'Выгодные пакеты услуг',
        preview: 'Экономия до 30%',
        badge: '2+1 БЕСПЛАТНО',
        badgeColor: 'bg-red-500',
      },
      {
        id: 'promotions',
        name: 'АКЦИИ',
        path: '/promotions',
        icon: '🎁',
        description: 'Актуальные предложения',
        preview: '5 акций этого месяца',
        animation: 'blinking-beacon',
        badge: 'HOT',
        badgeColor: 'bg-red-500',
      },
      {
        id: 'loyalty',
        name: 'ПРОГРАММА ЛОЯЛЬНОСТИ',
        path: '/loyalty',
        icon: '⭐',
        description: 'Бонусы за лечение',
        preview: 'Накопительная система скидок',
        badge: 'GOLD СТАТУС',
        badgeColor: 'bg-yellow-500',
      },
      {
        id: 'marketplace',
        name: 'МАГАЗИН',
        path: '/marketplace',
        icon: '🛒',
        description: 'Товары для ухода',
        preview: 'Зубные щётки • Пасты • Ополаскиватели',
        badge: 'ДОСТАВКА БЕСПЛАТНО',
        badgeColor: 'bg-green-500',
      },
    ],
  },
  {
    id: 'orange',
    name: 'ОРАНЖЕВАЯ ЛИНИЯ "ОБЩЕНИЕ"',
    color: {
      main: '#E67E22', // общение, тепло
      hover: '#D35400', // тёмно-оранжевый
      active: '#F39C12', // жёлто-оранжевый
    },
    stations: [
      {
        id: 'reviews',
        name: 'ОТЗЫВЫ',
        path: '/reviews',
        icon: '⭐',
        description: 'Истории наших пациентов',
        preview: '248 отзывов • Рейтинг 4.9',
      },
      {
        id: 'blog',
        name: 'БЛОГ',
        path: '/blog',
        icon: '📝',
        description: 'Полезная информация',
        preview: 'Советы врачей • Новости стоматологии',
        badge: 'НОВАЯ СТАТЬЯ',
        badgeColor: 'bg-blue-500',
      },
      {
        id: 'contacts',
        name: 'КОНТАКТЫ',
        path: '/contacts',
        icon: '📞',
        description: 'Связаться с нами',
        preview: 'ул. Панфиловцев, 14 • +7 961 978 5454',
        isHub: true,
        quickActions: ['Построить маршрут'],
      },
      {
        id: 'newsletter',
        name: 'РАССЫЛКА',
        path: '/newsletter',
        icon: '📧',
        description: 'Новости и акции на email',
        preview: 'Подпишитесь на полезную рассылку',
        quickActions: ['Подписаться'],
      },
      {
        id: 'faq',
        name: 'ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ',
        path: '/faq',
        icon: '❓',
        description: 'Ответы на популярные вопросы',
        preview: 'Быстрые ответы на ваши вопросы',
      },
    ],
  },
  {
    id: 'red',
    name: 'КРАСНАЯ ЛИНИЯ "ЦИФРОВАЯ"',
    color: {
      main: '#E74C3C', // срочность, внимание
      hover: '#C0392B', // тёмно-красный
      active: '#F1948A', // розоватый
      flash: '#FF0000', // ярко-красный
    },
    stations: [
      {
        id: 'mobile-app',
        name: 'МОБИЛЬНОЕ ПРИЛОЖЕНИЕ',
        path: '/mobile-app',
        icon: '📱',
        description: 'Управляйте записями с телефона',
        preview: 'Запись • История • Бонусы',
        badge: 'СКАЧАТЬ',
        badgeColor: 'bg-blue-500',
      },
      {
        id: 'online-booking',
        name: 'ОНЛАЙН ЗАПИСЬ',
        path: '/contacts',
        icon: '🎯',
        description: 'Записаться за 30 секунд',
        preview: 'Выберите время и врача',
        animation: 'pulsating-button',
        isHub: true,
        badge: 'ГЛАВНАЯ ЦЕЛЬ',
        badgeColor: 'bg-red-500',
      },
      {
        id: 'fintablo',
        name: 'ФИНТАБЛО',
        path: '/fintablo',
        icon: '💼',
        description: 'Финансовый учет клиники',
        preview: 'Доходы • Расходы • Отчеты',
        badge: 'НОВОЕ',
        badgeColor: 'bg-purple-500',
      },
    ],
  },
];

// Маршруты для разных типов пользователей
export const userJourneys = {
  newPatient: ['about', 'services', 'doctors', 'prices', 'online-booking'],
  economical: ['services', 'prices', 'subscriptions', 'promotions', 'online-booking'],
  explorer: ['about', 'press', 'reviews', 'portfolio', 'blog'],
  family: ['services', 'loyalty', 'subscriptions', 'online-booking'],
};

// Пересадочные узлы
export const transferHubs = ['services', 'doctors', 'prices', 'contacts', 'online-booking'];