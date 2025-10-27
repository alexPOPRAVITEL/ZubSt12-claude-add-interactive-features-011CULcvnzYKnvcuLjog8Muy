import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react';
import { CourseNavigator } from '../components/Learning/CourseNavigator';
import { LessonViewer } from '../components/Learning/LessonViewer';
import { supabase } from '../utils/supabase';
import { useUser } from '../hooks/useUser';
import { motion } from 'framer-motion';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration_hours: number;
  difficulty: string;
}

interface UserStats {
  completedLessons: number;
  totalTime: number;
  avgScore: number;
  achievements: number;
}

export const LearningPlatform: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    loadCourses();
    loadUserStats();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);

      if (data && data.length > 0) {
        setSelectedCourse(data[0]);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const { data: progressData } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user.id);

      const { data: achievementsData } = await supabase
        .from('learning_user_achievements')
        .select('*')
        .eq('user_id', user.id);

      const completedLessons = progressData?.filter(p => p.completed && p.lesson_id).length || 0;
      const totalTime = progressData?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;
      const scores = progressData?.filter(p => p.score !== null).map(p => p.score) || [];
      const avgScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

      setUserStats({
        completedLessons,
        totalTime: Math.floor(totalTime / 3600),
        avgScore: Math.round(avgScore),
        achievements: achievementsData?.length || 0,
      });
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const handleLessonSelect = (lesson: any, module: any) => {
    setSelectedLesson(lesson);
    setSelectedModule(module);
  };

  const handleLessonComplete = () => {
    loadUserStats();
  };

  const formatTime = (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    return `${hours.toFixed(1)}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Platform</h1>
              <p className="text-gray-600">Continue your learning journey</p>
            </div>
          </div>

          {userStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lessons Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.completedLessons}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Spent</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.totalTime}h</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.avgScore}%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Achievements</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.achievements}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-600">Check back later for new learning content.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <motion.button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setSelectedLesson(null);
                      setSelectedModule(null);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selectedCourse?.id === course.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {course.thumbnail_url && (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(course.duration_hours)}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {course.difficulty}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {selectedCourse && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <CourseNavigator
                    courseId={selectedCourse.id}
                    currentLessonId={selectedLesson?.id}
                    onLessonSelect={handleLessonSelect}
                  />
                </div>

                <div className="lg:col-span-2">
                  {selectedLesson && selectedModule ? (
                    <LessonViewer
                      lessonId={selectedLesson.id}
                      courseId={selectedCourse.id}
                      moduleId={selectedModule.id}
                      onComplete={handleLessonComplete}
                    />
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Select a lesson to begin
                      </h3>
                      <p className="text-gray-600">
                        Choose a lesson from the course navigator to start learning
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
