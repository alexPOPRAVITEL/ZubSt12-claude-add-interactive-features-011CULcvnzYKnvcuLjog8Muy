import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

export interface ProgressData {
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  stepId?: string;
  completed: boolean;
  timeSpent: number;
  score?: number;
  metadata?: Record<string, any>;
}

export interface UserProgress {
  id: string;
  completed: boolean;
  completedAt: string | null;
  timeSpent: number;
  score: number | null;
  attempts: number;
}

export const useLearningProgress = (userId: string | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = useCallback(async (progressData: ProgressData) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const { data: existing } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', progressData.courseId)
        .eq('module_id', progressData.moduleId || null)
        .eq('lesson_id', progressData.lessonId || null)
        .eq('step_id', progressData.stepId || null)
        .maybeSingle();

      if (existing) {
        const { error: updateError } = await supabase
          .from('learning_progress')
          .update({
            completed: progressData.completed,
            completed_at: progressData.completed ? new Date().toISOString() : null,
            time_spent: existing.time_spent + progressData.timeSpent,
            score: progressData.score ?? existing.score,
            attempts: existing.attempts + 1,
            metadata: { ...existing.metadata, ...progressData.metadata },
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('learning_progress')
          .insert({
            user_id: userId,
            course_id: progressData.courseId,
            module_id: progressData.moduleId,
            lesson_id: progressData.lessonId,
            step_id: progressData.stepId,
            completed: progressData.completed,
            completed_at: progressData.completed ? new Date().toISOString() : null,
            time_spent: progressData.timeSpent,
            score: progressData.score,
            attempts: 1,
            metadata: progressData.metadata || {},
          });

        if (insertError) throw insertError;
      }

      if (progressData.completed) {
        await checkAndAwardAchievements(userId);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to update progress:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getProgress = useCallback(async (
    courseId: string,
    lessonId?: string,
    stepId?: string
  ): Promise<UserProgress | null> => {
    if (!userId) return null;

    try {
      let query = supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (lessonId) query = query.eq('lesson_id', lessonId);
      if (stepId) query = query.eq('step_id', stepId);

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return data as UserProgress | null;
    } catch (err: any) {
      console.error('Failed to get progress:', err);
      return null;
    }
  }, [userId]);

  const getCourseProgress = useCallback(async (courseId: string) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) throw error;

      const totalSteps = data?.length || 0;
      const completedSteps = data?.filter(p => p.completed).length || 0;
      const totalTime = data?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;
      const avgScore = data && data.length > 0
        ? data.filter(p => p.score !== null).reduce((sum, p) => sum + (p.score || 0), 0) / data.filter(p => p.score !== null).length
        : 0;

      return {
        totalSteps,
        completedSteps,
        completionPercent: totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0,
        totalTime,
        avgScore,
      };
    } catch (err: any) {
      console.error('Failed to get course progress:', err);
      return null;
    }
  }, [userId]);

  const updateVideoProgress = useCallback(async (videoData: {
    stepId: string;
    videoUrl?: string;
    watchedSegments: number[];
    totalDuration: number;
    watchTime: number;
    lastPosition: number;
    completionPercent: number;
  }) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('learning_video_progress')
        .upsert({
          user_id: userId,
          step_id: videoData.stepId,
          video_url: videoData.videoUrl,
          watched_segments: videoData.watchedSegments,
          total_duration: videoData.totalDuration,
          watch_time: videoData.watchTime,
          last_position: videoData.lastPosition,
          completion_percent: videoData.completionPercent,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,step_id'
        });

      if (error) throw error;
    } catch (err: any) {
      console.error('Failed to update video progress:', err);
    }
  }, [userId]);

  const getVideoProgress = useCallback(async (stepId: string) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('learning_video_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('step_id', stepId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Failed to get video progress:', err);
      return null;
    }
  }, [userId]);

  return {
    updateProgress,
    getProgress,
    getCourseProgress,
    updateVideoProgress,
    getVideoProgress,
    loading,
    error,
  };
};

async function checkAndAwardAchievements(userId: string) {
  try {
    const { data: progressData } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId);

    if (!progressData) return;

    const completedLessons = progressData.filter(p => p.completed && p.lesson_id).length;
    const totalTime = progressData.reduce((sum, p) => sum + (p.time_spent || 0), 0);
    const avgScore = progressData.filter(p => p.score !== null).length > 0
      ? progressData.filter(p => p.score !== null).reduce((sum, p) => sum + (p.score || 0), 0) / progressData.filter(p => p.score !== null).length
      : 0;

    const achievementCriteria = [
      { name: 'first_step', check: completedLessons >= 1 },
      { name: 'quick_learner', check: completedLessons >= 5 },
      { name: 'dedicated', check: totalTime >= 36000 },
      { name: 'excellence', check: avgScore >= 90 },
    ];

    for (const achievement of achievementCriteria) {
      if (achievement.check) {
        const { data: achievementData } = await supabase
          .from('learning_achievements')
          .select('id')
          .eq('name', achievement.name)
          .maybeSingle();

        if (achievementData) {
          await supabase
            .from('learning_user_achievements')
            .upsert({
              user_id: userId,
              achievement_id: achievementData.id,
            }, {
              onConflict: 'user_id,achievement_id',
              ignoreDuplicates: true
            });
        }
      }
    }
  } catch (err) {
    console.error('Failed to check achievements:', err);
  }
}
