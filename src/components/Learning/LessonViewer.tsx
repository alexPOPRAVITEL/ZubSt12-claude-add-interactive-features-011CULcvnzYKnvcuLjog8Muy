import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../utils/supabase';
import { useLearningAnalytics } from '../../hooks/useLearningAnalytics';
import { useLearningProgress } from '../../hooks/useLearningProgress';
import { useUser } from '../../hooks/useUser';
import { VideoPlayer } from './VideoPlayer';
import { QuizEngine } from './QuizEngine';
import { TextContent } from './TextContent';

interface Step {
  id: string;
  step_number: number;
  type: 'video' | 'text' | 'quiz' | 'practice' | 'interactive';
  title: string;
  content: any;
  estimated_time: number;
}

interface LessonViewerProps {
  lessonId: string;
  courseId: string;
  moduleId: string;
  onComplete?: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lessonId,
  courseId,
  moduleId,
  onComplete,
  onNavigate,
}) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lessonStartTime, setLessonStartTime] = useState(Date.now());
  const [stepStartTime, setStepStartTime] = useState(Date.now());

  const { trackLessonEvent } = useLearningAnalytics();
  const { user } = useUser();
  const { updateProgress } = useLearningProgress(user?.id || null);

  useEffect(() => {
    loadLessonSteps();
    setLessonStartTime(Date.now());
    trackLessonEvent('start', { lessonId, moduleId, courseId });

    return () => {
      const timeSpent = Math.floor((Date.now() - lessonStartTime) / 1000);
      trackLessonEvent('end', { lessonId, moduleId, courseId, timeSpent });
    };
  }, [lessonId]);

  useEffect(() => {
    setStepStartTime(Date.now());
  }, [currentStepIndex]);

  const loadLessonSteps = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_steps')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('step_number');

      if (error) throw error;
      setSteps(data || []);
    } catch (error) {
      console.error('Failed to load lesson steps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = async () => {
    const timeSpent = Math.floor((Date.now() - stepStartTime) / 1000);
    const currentStep = steps[currentStepIndex];

    await updateProgress({
      courseId,
      moduleId,
      lessonId,
      stepId: currentStep.id,
      completed: true,
      timeSpent,
    });

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      const totalTimeSpent = Math.floor((Date.now() - lessonStartTime) / 1000);
      await updateProgress({
        courseId,
        moduleId,
        lessonId,
        completed: true,
        timeSpent: totalTimeSpent,
      });

      trackLessonEvent('complete', {
        lessonId,
        moduleId,
        courseId,
        timeSpent: totalTimeSpent,
      });

      if (onComplete) onComplete();
    }
  };

  const handleStepNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (direction === 'next' && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">No content available for this lesson.</p>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{currentStep.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{currentStep.estimated_time} min</span>
          </div>
        </div>

        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep.type === 'video' && (
              <VideoPlayer
                stepId={currentStep.id}
                lessonId={lessonId}
                videoContent={currentStep.content}
                onComplete={handleStepComplete}
              />
            )}

            {currentStep.type === 'text' && (
              <TextContent
                content={currentStep.content}
                onComplete={handleStepComplete}
              />
            )}

            {currentStep.type === 'quiz' && (
              <QuizEngine
                stepId={currentStep.id}
                lessonId={lessonId}
                quizContent={currentStep.content}
                onComplete={handleStepComplete}
              />
            )}

            {currentStep.type === 'practice' && (
              <div className="min-h-[400px]">
                <p className="text-gray-600">Practice exercise coming soon...</p>
                <button
                  onClick={handleStepComplete}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark as Complete
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
        <button
          onClick={() => handleStepNavigation('prev')}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {currentStepIndex < steps.length - 1 ? (
          <button
            onClick={() => handleStepNavigation('next')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleStepComplete}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Lesson
          </button>
        )}
      </div>
    </div>
  );
};
