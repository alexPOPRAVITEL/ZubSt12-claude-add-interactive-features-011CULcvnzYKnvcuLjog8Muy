import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ExternalLink, MapPin, Clock, Phone, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: ChatOption[];
  links?: NavigationLink[];
}

interface ChatOption {
  text: string;
  action?: () => void;
}

interface NavigationLink {
  text: string;
  path: string;
  icon?: React.ReactNode;
}

const siteStructure = {
  home: { path: '/', name: 'Главная', keywords: ['главная', 'домой', 'начало'] },
  about: { path: '/about', name: 'О клинике', keywords: ['о клинике', 'о нас', 'информация', 'клиника'] },
  services: { path: '/services', name: 'Услуги', keywords: ['услуги', 'что делаете', 'лечение'] },
  doctors: { path: '/doctors', name: 'Врачи', keywords: ['врачи', 'доктора', 'специалисты', 'персонал'] },
  prices: { path: '/prices', name: 'Цены', keywords: ['цены', 'стоимость', 'тарифы', 'расценки'] },
  reviews: { path: '/reviews', name: 'Отзывы', keywords: ['отзывы', 'мнения', 'отзыв'] },
  promotions: { path: '/promotions', name: 'Акции', keywords: ['акции', 'скидки', 'предложения'] },
  contacts: { path: '/contacts', name: 'Контакты', keywords: ['контакты', 'связь', 'адрес', 'телефон'] },
  portfolio: { path: '/portfolio', name: 'Портфолио', keywords: ['портфолио', 'работы', 'примеры'] },
  blog: { path: '/blog', name: 'Блог', keywords: ['блог', 'статьи', 'новости'] },
  subscriptions: { path: '/subscriptions', name: 'Подписки', keywords: ['подписки', 'абонементы', 'пакеты'] },
  loyalty: { path: '/loyalty', name: 'Программа лояльности', keywords: ['программа лояльности', 'бонусы', 'скидки'] },
  faq: { path: '/faq', name: 'FAQ', keywords: ['faq', 'вопросы', 'частые вопросы', 'помощь'] },
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const currentPage = getCurrentPageName();
      setTimeout(() => {
        addBotMessage(
          `Привет! Я ваш виртуальный помощник на сайте Зубной Станции.\n\nВы сейчас на странице "${currentPage}". Чем могу помочь?`,
          [
            { text: 'Показать карту сайта' },
            { text: 'Записаться на приём' },
            { text: 'Узнать цены' },
            { text: 'Посмотреть акции' },
            { text: 'Контакты клиники' }
          ]
        );
      }, 500);
    }
  }, [isOpen]);

  const getCurrentPageName = (): string => {
    const page = Object.values(siteStructure).find(p => p.path === location.pathname);
    return page?.name || 'сайте';
  };

  const findPageByKeywords = (input: string): typeof siteStructure[keyof typeof siteStructure] | null => {
    const lowerInput = input.toLowerCase();
    for (const page of Object.values(siteStructure)) {
      if (page.keywords.some(keyword => lowerInput.includes(keyword))) {
        return page;
      }
    }
    return null;
  };

  const addBotMessage = (text: string, options?: ChatOption[], links?: NavigationLink[]) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        isBot: true,
        timestamp: new Date(),
        options,
        links
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 800);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setConversationContext(prev => [...prev, text.toLowerCase()]);
  };

  const handleNavigation = (path: string, pageName: string) => {
    navigate(path);
    addBotMessage(`Отлично! Перехожу на страницу "${pageName}".`, [
      { text: 'Что ещё на этой странице?' },
      { text: 'Вернуться к началу' },
      { text: 'Показать другие разделы' }
    ]);
  };

  const showSiteMap = () => {
    const links: NavigationLink[] = Object.values(siteStructure).map(page => ({
      text: page.name,
      path: page.path,
      icon: <FileText className="w-4 h-4" />
    }));

    addBotMessage(
      'Вот полная карта сайта. Куда хотите перейти?',
      [],
      links
    );
  };

  const handleOptionClick = (option: ChatOption) => {
    addUserMessage(option.text);
    if (option.action) {
      option.action();
    } else {
      handleBotResponse(option.text);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addUserMessage(inputText);
      handleBotResponse(inputText);
      setInputText('');
    }
  };

  const handleBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();

    if (input.includes('карта сайта') || input.includes('разделы') || input.includes('навигация')) {
      showSiteMap();
      return;
    }

    const foundPage = findPageByKeywords(input);
    if (foundPage) {
      addBotMessage(
        `Вы ищете информацию на странице "${foundPage.name}"?`,
        [
          {
            text: `Да, перейти на "${foundPage.name}"`,
            action: () => handleNavigation(foundPage.path, foundPage.name)
          },
          { text: 'Нет, это не то' },
          { text: 'Показать похожие разделы' }
        ]
      );
      return;
    }

    if (input.includes('записаться') || input.includes('запись') || input.includes('приём')) {
      addBotMessage(
        'Отлично! Записаться можно несколькими способами:',
        [
          { text: 'Позвонить: +7 961 978 5454', action: () => { window.location.href = 'tel:+79619785454'; } },
          { text: 'Онлайн-запись', action: () => navigate('/contacts') },
          { text: 'WhatsApp', action: () => { window.open('https://wa.me/79619785454', '_blank'); } },
          { text: 'Посмотреть врачей', action: () => navigate('/doctors') }
        ]
      );
      return;
    }

    if (input.includes('цен') || input.includes('стоимость') || input.includes('сколько')) {
      addBotMessage(
        'Информацию о ценах вы можете найти:',
        [
          { text: 'Перейти к прайс-листу', action: () => navigate('/prices') },
          { text: 'Посмотреть акции', action: () => navigate('/promotions') },
          { text: 'Посмотреть подписки', action: () => navigate('/subscriptions') }
        ]
      );
      return;
    }

    if (input.includes('врач') || input.includes('доктор') || input.includes('специалист')) {
      addBotMessage(
        'У нас работают опытные врачи разных специализаций.',
        [
          { text: 'Посмотреть всех врачей', action: () => navigate('/doctors') },
          { text: 'Записаться на приём' },
          { text: 'Узнать график работы' }
        ]
      );
      return;
    }

    if (input.includes('акци') || input.includes('скидк') || input.includes('предложени')) {
      addBotMessage(
        'У нас действуют специальные предложения!',
        [
          { text: 'Посмотреть все акции', action: () => navigate('/promotions') },
          { text: 'Программа лояльности', action: () => navigate('/loyalty') },
          { text: 'Подписки со скидками', action: () => navigate('/subscriptions') }
        ]
      );
      return;
    }

    if (input.includes('отзыв') || input.includes('мнени') || input.includes('репутаци')) {
      addBotMessage(
        'Отзывы наших пациентов помогут вам узнать о нас больше.',
        [
          { text: 'Читать отзывы', action: () => navigate('/reviews') },
          { text: 'Посмотреть портфолио работ', action: () => navigate('/portfolio') },
          { text: 'О нашей клинике', action: () => navigate('/about') }
        ]
      );
      return;
    }

    if (input.includes('контакт') || input.includes('адрес') || input.includes('телефон') || input.includes('где')) {
      addBotMessage(
        'Контактная информация:\n\nАдрес: ул. Панфиловцев, 14, Барнаул\nТелефон: +7 961 978 5454\nРежим работы: Пн-Пт 8:00-20:00, Сб 9:00-18:00',
        [
          { text: 'Открыть на карте', action: () => navigate('/contacts') },
          { text: 'Позвонить', action: () => { window.location.href = 'tel:+79619785454'; } },
          { text: 'Написать в WhatsApp', action: () => { window.open('https://wa.me/79619785454', '_blank'); } }
        ]
      );
      return;
    }

    if (input.includes('работа') || input.includes('график') || input.includes('время')) {
      addBotMessage(
        'Наш график работы:\n\nПонедельник-Пятница: 8:00-20:00\nСуббота: 9:00-18:00\nВоскресенье: выходной\n\nЭкстренные случаи принимаем круглосуточно!',
        [
          { text: 'Записаться на приём' },
          { text: 'Контакты' },
          { text: 'Экстренная ситуация' }
        ]
      );
      return;
    }

    if (input.includes('болит') || input.includes('экстренн') || input.includes('срочно') || input.includes('боль')) {
      addBotMessage(
        'Понимаю, что болит! Срочные действия:\n\n1. Позвоните: +7 961 978 5454\n2. Мы принимаем экстренных пациентов без записи\n3. Адрес: ул. Панфиловцев, 14',
        [
          { text: 'Позвонить немедленно', action: () => { window.location.href = 'tel:+79619785454'; } },
          { text: 'Показать на карте', action: () => navigate('/contacts') },
          { text: 'Что принять от боли' }
        ]
      );
      return;
    }

    if (input.includes('помощ') || input.includes('что делае') || input.includes('возможности')) {
      addBotMessage(
        'Я могу помочь вам:\n\n• Навигация по сайту\n• Информация о услугах и ценах\n• Запись на приём\n• Контактная информация\n• Ответы на частые вопросы',
        [
          { text: 'Показать карту сайта' },
          { text: 'Записаться на приём' },
          { text: 'FAQ - Частые вопросы', action: () => navigate('/faq') }
        ]
      );
      return;
    }

    if (input.includes('начал') || input.includes('домой') || input.includes('главна')) {
      handleNavigation('/', 'Главная');
      return;
    }

    addBotMessage(
      'Не совсем понял ваш вопрос. Попробуйте:\n\n• Выбрать из предложенных вариантов\n• Указать интересующий раздел\n• Посмотреть карту сайта',
      [
        { text: 'Показать карту сайта' },
        { text: 'Записаться на приём' },
        { text: 'Связаться с администратором', action: () => { window.location.href = 'tel:+79619785454'; } },
        { text: 'FAQ', action: () => navigate('/faq') }
      ]
    );
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="glass-button fixed bottom-6 left-6 md:bottom-8 md:left-8 z-40 w-14 h-14 flex items-center justify-center group"
        whileHover={{
          scale: 1.08,
          y: -4,
          rotate: [0, -3, 3, -3, 3, 0],
          transition: {
            scale: { duration: 0.3 },
            y: { duration: 0.3 },
            rotate: { duration: 0.5 }
          }
        }}
        whileTap={{
          scale: 0.92,
          y: 0,
          transition: { duration: 0.2 }
        }}
        initial={{ opacity: 0, x: -100, scale: 0 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.3
        }}
      >
        <MessageCircle className="w-7 h-7 text-white relative z-10 drop-shadow-lg" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></span>

        <div className="absolute bottom-full mb-3 left-0 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl">
          Помощник
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 md:bottom-24 md:left-8 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Виртуальный помощник</h3>
                <p className="text-sm opacity-90 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                  Онлайн - помогу с навигацией
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.isBot
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : 'bg-blue-500 text-white'
                    } p-3 rounded-2xl shadow-sm`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>

                    {message.options && message.options.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="block w-full text-left p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium border border-blue-200"
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    )}

                    {message.links && message.links.length > 0 && (
                      <div className="mt-3 space-y-1.5 max-h-60 overflow-y-auto">
                        {message.links.map((link, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              navigate(link.path);
                              addBotMessage(`Перехожу на "${link.text}"`);
                            }}
                            className="flex items-center gap-2 w-full text-left p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm border border-gray-200"
                          >
                            {link.icon}
                            <span className="flex-1">{link.text}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => handleBotResponse('Показать карту сайта')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Карта сайта
                </button>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => handleBotResponse('помощь')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Помощь
                </button>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Напишите вопрос или интересующий раздел..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="bg-blue-500 text-white p-2.5 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
