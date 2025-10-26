import { useEffect, useCallback } from 'react';
import { userTracker } from '../utils/userTracking';

export const useLearningAnalytics = () => {
  useEffect(() => {
    userTracker.initialize();

    return () => {
      userTracker.destroy();
    };
  }, []);

  const trackEvent = useCallback((eventType: string, eventData: Record<string, any> = {}) => {
    userTracker.trackEvent(eventType, eventData);
  }, []);

  const trackVideoEvent = useCallback((action: string, videoData: {
    stepId: string;
    lessonId: string;
    currentTime?: number;
    duration?: number;
    percentWatched?: number;
  }) => {
    trackEvent(`video_${action}`, videoData);
  }, [trackEvent]);

  const trackQuizEvent = useCallback((action: string, quizData: {
    stepId: string;
    lessonId: string;
    questionIndex?: number;
    answer?: any;
    score?: number;
    timeSpent?: number;
  }) => {
    trackEvent(`quiz_${action}`, quizData);
  }, [trackEvent]);

  const trackLessonEvent = useCallback((action: string, lessonData: {
    lessonId: string;
    moduleId?: string;
    courseId?: string;
    timeSpent?: number;
  }) => {
    trackEvent(`lesson_${action}`, lessonData);
  }, [trackEvent]);

  const trackNavigationEvent = useCallback((from: string, to: string) => {
    trackEvent('navigation', { from, to });
  }, [trackEvent]);

  return {
    trackEvent,
    trackVideoEvent,
    trackQuizEvent,
    trackLessonEvent,
    trackNavigationEvent,
    getSessionInfo: () => userTracker.getSessionInfo(),
    getTimeOnPage: () => userTracker.getTimeOnPage(),
  };
};
