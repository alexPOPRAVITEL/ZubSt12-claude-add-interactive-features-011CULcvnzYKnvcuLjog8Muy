import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  Award,
  Clock,
  TrendingUp,
  X,
  ChevronRight,
  Video
} from 'lucide-react';
import { supabase } from '../utils/supabase';

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  duration: string;
  level: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  duration: number;
  has_quiz: boolean;
}

interface Progress {
  lesson_id: string;
  completed: boolean;
  quiz_score: number | null;
}

export const TrainingPortal: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [showLessonModal, setShowLessonModal] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('training-user-email');
    if (savedEmail) {
      setUserEmail(savedEmail);
      setIsAuthenticated(true);
      loadCourses();
      loadProgress(savedEmail);
    }
  }, []);

  const handleLogin = () => {
    if (userEmail.includes('@')) {
      localStorage.setItem('training-user-email', userEmail);
      setIsAuthenticated(true);
      loadCourses();
      loadProgress(userEmail);
    } else {
      alert('Введите корректный email');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('training-user-email');
    setUserEmail('');
    setIsAuthenticated(false);
    setSelectedCourse(null);
  };

  const loadCourses = async () => {
    const { data, error } = await supabase
      .from('training_courses')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (!error && data) {
      setCourses(data);
    }
  };

  const loadProgress = async (email: string) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_email', email);

    if (!error && data) {
      setProgress(data);
    }
  };

  const loadCourseContent = async (courseId: string) => {
    const { data: modulesData } = await supabase
      .from('training_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (modulesData) {
      setModules(modulesData);

      const moduleIds = modulesData.map(m => m.id);
      const { data: lessonsData } = await supabase
        .from('training_lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('order_index', { ascending: true });

      if (lessonsData) {
        setLessons(lessonsData);
      }
    }
  };

  const openLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const completeLesson = async (lessonId: string) => {
    const { error } = await supabase
      .from('user_progress')
      .upsert([
        {
          user_email: userEmail,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
      ]);

    if (!error) {
      loadProgress(userEmail);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lesson_id === lessonId && p.completed);
  };

  const getCourseProgress = (courseId: string) => {
    const courseLessons = lessons.filter(l => {
      const module = modules.find(m => m.id === l.module_id);
      return module && modules.some(m => m.id === module.id);
    });

    const completed = courseLessons.filter(l => isLessonCompleted(l.id)).length;
    return courseLessons.length > 0 ? Math.round((completed / courseLessons.length) * 100) : 0;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Портал обучения</h1>
            <p className="text-gray-600">Зубная Станция</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email для входа
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Войти
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Используйте ваш рабочий email</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (selectedCourse) {
    const courseProgress = getCourseProgress(selectedCourse.id);

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                <span>Все курсы</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">{selectedCourse.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Прогресс: <span className="font-bold text-blue-600">{courseProgress}%</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Выйти
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {modules.map((module) => (
                <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                    <h2 className="text-xl font-bold">{module.title}</h2>
                    <p className="text-sm text-blue-100 mt-1">{module.description}</p>
                  </div>

                  <div className="p-4 space-y-2">
                    {lessons
                      .filter((l) => l.module_id === module.id)
                      .map((lesson) => {
                        const completed = isLessonCompleted(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => openLesson(lesson)}
                            className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-100"
                          >
                            <div className="flex items-center space-x-3">
                              {completed ? (
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              ) : (
                                <Play className="w-6 h-6 text-blue-600" />
                              )}
                              <div className="text-left">
                                <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                  <span className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{lesson.duration} мин</span>
                                  </span>
                                  {lesson.video_url && (
                                    <span className="flex items-center space-x-1">
                                      <Video className="w-3 h-3" />
                                      <span>Видео</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg mb-4">Ваш прогресс</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        Завершено
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {courseProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${courseProgress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Уроков пройдено</span>
                    <span className="font-bold">
                      {lessons.filter(l => isLessonCompleted(l.id)).length} / {lessons.length}
                    </span>
                  </div>
                </div>
              </div>

              {courseProgress === 100 && (
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-md p-6 text-white">
                  <Award className="w-12 h-12 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Поздравляем!</h3>
                  <p className="text-sm text-white/90">
                    Вы завершили курс. Ваш сертификат готов к выдаче.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {showLessonModal && selectedLesson && (
          <LessonModal
            lesson={selectedLesson}
            isCompleted={isLessonCompleted(selectedLesson.id)}
            onComplete={() => completeLesson(selectedLesson.id)}
            onClose={() => {
              setShowLessonModal(false);
              setSelectedLesson(null);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Портал обучения</h1>
              <p className="text-sm text-gray-600">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Доступные курсы</h2>
          <p className="text-gray-600">Выберите курс для начала обучения</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedCourse(course);
                loadCourseContent(course.id);
              }}
            >
              {course.image_url && (
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white" />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-600 rounded">
                    {course.level}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">Начать обучение</span>
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

const LessonModal: React.FC<{
  lesson: Lesson;
  isCompleted: boolean;
  onComplete: () => void;
  onClose: () => void;
}> = ({ lesson, isCompleted, onComplete, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {lesson.video_url && (
            <div className="mb-6 aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                src={lesson.video_url}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          <div className="prose max-w-none mb-6">
            <div className="text-gray-700 whitespace-pre-wrap">{lesson.content}</div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-gray-600">
              Длительность: {lesson.duration} минут
            </div>
            {!isCompleted && (
              <button
                onClick={() => {
                  onComplete();
                  onClose();
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Отметить как пройденный</span>
              </button>
            )}
            {isCompleted && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Урок пройден</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
