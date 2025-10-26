import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, CreditCard as Edit2, Trash2, Save, X, GraduationCap, Video, FileText, Award, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  duration: string;
  level: string;
  is_active: boolean;
  order_index: number;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string;
  video_url: string;
  duration: number;
  order_index: number;
  has_quiz: boolean;
}

export const TrainingManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data, error } = await supabase
      .from('training_courses')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data) {
      setCourses(data);
    }
  };

  const loadModules = async (courseId: string) => {
    const { data, error } = await supabase
      .from('training_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (!error && data) {
      setModules(data);
    }
  };

  const loadLessons = async (moduleId: string) => {
    const { data, error } = await supabase
      .from('training_lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true });

    if (!error && data) {
      setLessons(data);
    }
  };

  const saveCourse = async (course: Partial<Course>) => {
    if (course.id) {
      await supabase
        .from('training_courses')
        .update(course)
        .eq('id', course.id);
    } else {
      await supabase
        .from('training_courses')
        .insert([{ ...course, order_index: courses.length }]);
    }
    loadCourses();
    setShowCourseForm(false);
    setEditingCourse(null);
  };

  const deleteCourse = async (id: string) => {
    if (confirm('Удалить курс и все его модули?')) {
      await supabase.from('training_courses').delete().eq('id', id);
      loadCourses();
    }
  };

  const saveModule = async (module: Partial<Module>) => {
    if (!selectedCourse) return;

    if (module.id) {
      await supabase
        .from('training_modules')
        .update(module)
        .eq('id', module.id);
    } else {
      await supabase
        .from('training_modules')
        .insert([{ ...module, course_id: selectedCourse, order_index: modules.length }]);
    }
    loadModules(selectedCourse);
    setShowModuleForm(false);
    setEditingModule(null);
  };

  const deleteModule = async (id: string) => {
    if (confirm('Удалить модуль и все его уроки?')) {
      await supabase.from('training_modules').delete().eq('id', id);
      if (selectedCourse) loadModules(selectedCourse);
    }
  };

  const saveLesson = async (lesson: Partial<Lesson>) => {
    if (!selectedModule) return;

    if (lesson.id) {
      await supabase
        .from('training_lessons')
        .update(lesson)
        .eq('id', lesson.id);
    } else {
      await supabase
        .from('training_lessons')
        .insert([{ ...lesson, module_id: selectedModule, order_index: lessons.length }]);
    }
    loadLessons(selectedModule);
    setShowLessonForm(false);
    setEditingLesson(null);
  };

  const deleteLesson = async (id: string) => {
    if (confirm('Удалить урок?')) {
      await supabase.from('training_lessons').delete().eq('id', id);
      if (selectedModule) loadLessons(selectedModule);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Система обучения</h1>
        </div>
        <button
          onClick={() => {
            setEditingCourse(null);
            setShowCourseForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Новый курс</span>
        </button>
      </div>

      {/* Список курсов */}
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={() => {
                    const newExpanded = expandedCourse === course.id ? null : course.id;
                    setExpandedCourse(newExpanded);
                    if (newExpanded) {
                      setSelectedCourse(course.id);
                      loadModules(course.id);
                    }
                  }}
                >
                  {expandedCourse === course.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>⏱ {course.duration}</span>
                    <span>📊 {course.level}</span>
                    <span className={course.is_active ? 'text-green-600' : 'text-red-600'}>
                      {course.is_active ? '✓ Активен' : '✗ Неактивен'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingCourse(course);
                    setShowCourseForm(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedCourse(course.id);
                    setEditingModule(null);
                    setShowModuleForm(true);
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                  + Модуль
                </button>
              </div>
            </div>

            {/* Модули курса */}
            {expandedCourse === course.id && (
              <div className="bg-gray-50 p-4 space-y-3">
                {modules.filter(m => m.course_id === course.id).map((module) => (
                  <div key={module.id} className="bg-white rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <button
                          onClick={() => {
                            const newExpanded = expandedModule === module.id ? null : module.id;
                            setExpandedModule(newExpanded);
                            if (newExpanded) {
                              setSelectedModule(module.id);
                              loadLessons(module.id);
                            }
                          }}
                        >
                          {expandedModule === module.id ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <FileText className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <h4 className="font-medium">{module.title}</h4>
                          <p className="text-xs text-gray-600">{module.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingModule(module);
                            setSelectedCourse(course.id);
                            setShowModuleForm(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteModule(module.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedModule(module.id);
                            setEditingLesson(null);
                            setShowLessonForm(true);
                          }}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                        >
                          + Урок
                        </button>
                      </div>
                    </div>

                    {/* Уроки модуля */}
                    {expandedModule === module.id && (
                      <div className="mt-3 ml-8 space-y-2">
                        {lessons.filter(l => l.module_id === module.id).map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <Video className="w-4 h-4 text-purple-600" />
                              <span className="text-sm">{lesson.title}</span>
                              <span className="text-xs text-gray-500">({lesson.duration} мин)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setEditingLesson(lesson);
                                  setSelectedModule(module.id);
                                  setShowLessonForm(true);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteLesson(lesson.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Форма курса */}
      {showCourseForm && (
        <CourseForm
          course={editingCourse}
          onSave={saveCourse}
          onClose={() => {
            setShowCourseForm(false);
            setEditingCourse(null);
          }}
        />
      )}

      {/* Форма модуля */}
      {showModuleForm && (
        <ModuleForm
          module={editingModule}
          onSave={saveModule}
          onClose={() => {
            setShowModuleForm(false);
            setEditingModule(null);
          }}
        />
      )}

      {/* Форма урока */}
      {showLessonForm && (
        <LessonForm
          lesson={editingLesson}
          onSave={saveLesson}
          onClose={() => {
            setShowLessonForm(false);
            setEditingLesson(null);
          }}
        />
      )}
    </div>
  );
};

const CourseForm: React.FC<{
  course: Course | null;
  onSave: (course: Partial<Course>) => void;
  onClose: () => void;
}> = ({ course, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Course>>(
    course || {
      title: '',
      description: '',
      image_url: '',
      duration: '',
      level: 'Базовый',
      is_active: true,
    }
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {course ? 'Редактировать курс' : 'Новый курс'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL изображения</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Длительность</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Например: 2 недели"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Уровень</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option>Базовый</option>
                <option>Средний</option>
                <option>Продвинутый</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Активен</label>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={() => onSave(formData)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-5 h-5 inline mr-2" />
              Сохранить
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Отмена
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ModuleForm: React.FC<{
  module: Module | null;
  onSave: (module: Partial<Module>) => void;
  onClose: () => void;
}> = ({ module, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Module>>(
    module || { title: '', description: '' }
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-xl w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {module ? 'Редактировать модуль' : 'Новый модуль'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg h-24"
            />
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={() => onSave(formData)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-5 h-5 inline mr-2" />
              Сохранить
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Отмена
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LessonForm: React.FC<{
  lesson: Lesson | null;
  onSave: (lesson: Partial<Lesson>) => void;
  onClose: () => void;
}> = ({ lesson, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Lesson>>(
    lesson || {
      title: '',
      content: '',
      video_url: '',
      duration: 0,
      has_quiz: false,
    }
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {lesson ? 'Редактировать урок' : 'Новый урок'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Контент (Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg h-48 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL видео (опционально)</label>
            <input
              type="text"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Длительность (минут)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.has_quiz}
              onChange={(e) => setFormData({ ...formData, has_quiz: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Есть тест после урока</label>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={() => onSave(formData)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-5 h-5 inline mr-2" />
              Сохранить
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Отмена
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
