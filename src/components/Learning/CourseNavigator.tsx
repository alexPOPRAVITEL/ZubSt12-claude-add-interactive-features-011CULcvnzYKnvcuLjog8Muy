import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, Lock, PlayCircle, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../utils/supabase';

interface Module {
  id: string;
  title: string;
  description: string;
  position: number;
  estimated_time: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  position: number;
  duration_minutes: number;
}

interface Progress {
  [key: string]: {
    completed: boolean;
    started: boolean;
  };
}

interface CourseNavigatorProps {
  courseId: string;
  currentLessonId?: string;
  onLessonSelect: (lesson: Lesson, module: Module) => void;
}

export const CourseNavigator: React.FC<CourseNavigatorProps> = ({
  courseId,
  currentLessonId,
  onLessonSelect,
}) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<Progress>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseStructure();
    loadProgress();
  }, [courseId]);

  const loadCourseStructure = async () => {
    try {
      const { data: modulesData, error: modulesError } = await supabase
        .from('learning_modules')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('position');

      if (modulesError) throw modulesError;

      const modulesWithLessons = await Promise.all(
        (modulesData || []).map(async (module) => {
          const { data: lessonsData } = await supabase
            .from('learning_lessons')
            .select('*')
            .eq('module_id', module.id)
            .eq('is_published', true)
            .order('position');

          return {
            ...module,
            lessons: lessonsData || [],
          };
        })
      );

      setModules(modulesWithLessons);

      if (modulesWithLessons.length > 0) {
        setExpandedModules(new Set([modulesWithLessons[0].id]));
      }
    } catch (error) {
      console.error('Failed to load course structure:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { data: progressData } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      const progressMap: Progress = {};
      progressData?.forEach((p) => {
        if (p.lesson_id) {
          progressMap[p.lesson_id] = {
            completed: p.completed,
            started: p.time_spent > 0,
          };
        }
      });

      setProgress(progressMap);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getLessonStatus = (lessonId: string): 'locked' | 'available' | 'in-progress' | 'completed' => {
    const lessonProgress = progress[lessonId];
    if (!lessonProgress) return 'available';
    if (lessonProgress.completed) return 'completed';
    if (lessonProgress.started) return 'in-progress';
    return 'available';
  };

  const getModuleProgress = (module: Module): number => {
    const completed = module.lessons.filter(l => progress[l.id]?.completed).length;
    return module.lessons.length > 0 ? Math.round((completed / module.lessons.length) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Course Content</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {modules.map((module) => (
          <div key={module.id} className="transition-all duration-200">
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    expandedModules.has(module.id) ? 'rotate-90' : ''
                  }`}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{module.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {module.lessons.length} lessons · {module.estimated_time}min
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-blue-600">
                  {getModuleProgress(module)}%
                </span>
              </div>
            </button>

            <AnimatePresence>
              {expandedModules.has(module.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gray-50 px-4 py-2 space-y-1">
                    {module.lessons.map((lesson) => {
                      const status = getLessonStatus(lesson.id);
                      const isActive = currentLessonId === lesson.id;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => status !== 'locked' && onLessonSelect(lesson, module)}
                          disabled={status === 'locked'}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            isActive
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-white'
                          } ${status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex-shrink-0">
                            {status === 'completed' && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {status === 'in-progress' && (
                              <PlayCircle className="w-5 h-5 text-blue-500" />
                            )}
                            {status === 'locked' && (
                              <Lock className="w-5 h-5 text-gray-400" />
                            )}
                            {status === 'available' && (
                              <Circle className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`text-sm font-medium ${
                              isActive ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {lesson.title}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {lesson.duration_minutes}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
