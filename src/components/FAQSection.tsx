import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const FAQSection: React.FC = () => {
  const [faqEntries, setFaqEntries] = useState<FaqEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Все вопросы', icon: '📋' },
    { id: 'general', label: 'Общие вопросы о клинике', icon: '🏥' },
    { id: 'services', label: 'Услуги и лечение', icon: '🦷' },
    { id: 'pricing', label: 'Цены и оплата', icon: '💰' },
    { id: 'appointment', label: 'Запись на прием', icon: '📅' },
    { id: 'prevention', label: 'Профилактика и уход', icon: '✨' },
    { id: 'children', label: 'Детская стоматология', icon: '👶' },
    { id: 'emergency', label: 'Экстренные случаи', icon: '🚨' }
  ];

  useEffect(() => {
    loadFaqEntries();
  }, []);

  const loadFaqEntries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('faq_entries')
        .select('*')
        .eq('is_published', true)
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFaqEntries(data || []);
    } catch (error) {
      console.error('Error loading FAQ entries:', error);
      setFaqEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = faqEntries.filter(entry => {
    const matchesSearch = entry.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || entry.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedEntries = categories.reduce((acc, category) => {
    if (category.id === 'all') return acc;
    
    const categoryEntries = filteredEntries.filter(entry => entry.category === category.id);
    if (categoryEntries.length > 0) {
      acc[category.id] = {
        ...category,
        entries: categoryEntries
      };
    }
    return acc;
  }, {} as Record<string, any>);

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  // Generate Schema Markup for FAQ
  const generateSchemaMarkup = () => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": filteredEntries.map(entry => ({
        "@type": "Question",
        "name": entry.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": entry.answer
        }
      }))
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    );
  };

  return (
    <div className="py-16">
      {/* Schema Markup */}
      {filteredEntries.length > 0 && generateSchemaMarkup()}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">
              Часто задаваемые вопросы
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Ответы на популярные вопросы о стоматологических услугах и лечении в "Зубной Станции"
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск по вопросам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary text-lg"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* FAQ Content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'Вопросы не найдены' : 'Пока нет вопросов в этой категории'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Попробуйте изменить поисковый запрос или выбрать другую категорию'
                  : 'Мы работаем над наполнением этого раздела'}
              </p>
              <a
                href="tel:+79619785454"
                className="inline-block bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
              >
                Задать вопрос по телефону
              </a>
            </div>
          ) : activeCategory === 'all' ? (
            // Show all entries grouped by category
            <div className="space-y-8">
              {Object.values(groupedEntries).map((group: any, groupIndex) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-md"
                >
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <span className="mr-3 text-3xl">{group.icon}</span>
                    {group.label}
                  </h2>
                  <div className="space-y-4">
                    {group.entries.map((entry: FaqEntry, entryIndex: number) => (
                      <div key={entry.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <button
                          onClick={() => toggleQuestion(entry.id)}
                          className="w-full text-left flex justify-between items-start py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors"
                        >
                          <h3 className="text-lg font-medium text-gray-900 pr-4">
                            {entry.question}
                          </h3>
                          {openQuestion === entry.id ? (
                            <ChevronUp className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          )}
                        </button>
                        <AnimatePresence>
                          {openQuestion === entry.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                  {entry.answer}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Show entries for selected category
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="space-y-4">
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                  >
                    <button
                      onClick={() => toggleQuestion(entry.id)}
                      className="w-full text-left flex justify-between items-start py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-gray-900 pr-4">
                        {entry.question}
                      </h3>
                      {openQuestion === entry.id ? (
                        <ChevronUp className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      )}
                    </button>
                    <AnimatePresence>
                      {openQuestion === entry.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {entry.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Не нашли ответ на свой вопрос?</h2>
            <p className="text-xl mb-8 opacity-90">
              Свяжитесь с нами, и мы с радостью ответим на все ваши вопросы
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="tel:+79619785454"
                className="bg-white text-primary px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Позвонить нам
              </a>
              <a
                href="https://wa.me/79619785454"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#1EBE5D] transition-colors"
              >
                Написать в WhatsApp
              </a>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};