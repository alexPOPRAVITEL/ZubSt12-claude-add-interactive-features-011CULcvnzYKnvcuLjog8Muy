import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';

interface Story {
  id: string;
  url: string;
  type: 'image' | 'video';
  order_index: number;
}

// Fallback stories if DB is empty or fails to load
const defaultStories: Story[] = [
  {
    id: 'default-1',
    url: 'https://files.salebot.pro/uploads/file_item/file/449726/GUbc5XlceeL9-5gSQR2xT52WCkDhJOBrx0AmU2sTseS9KQWSVF2Ac9fkTEaKEXJ5Kj7JHp3Pl1doAv238rV-6g__.jpeg',
    type: 'image',
    order_index: 0
  }
];

export const HeroInstagramStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>(defaultStories);
  const [loading, setLoading] = useState(true);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const storyDuration = 5000;

  useEffect(() => {
    const loadStories = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_stories')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setStories(data);
        } else {
          // Use default stories if no active stories in DB
          setStories(defaultStories);
        }
      } catch (error) {
        console.error('Error loading hero stories:', error);
        // Use default stories on error
        setStories(defaultStories);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  useEffect(() => {
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / storyDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
          setProgress(0);
        }, 100);
      }
    }, 16);

    return () => clearInterval(progressInterval);
  }, [currentStoryIndex]);

  useEffect(() => {
    if (stories[currentStoryIndex].type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentStoryIndex]);

  const currentStory = stories[currentStoryIndex];

  return (
    <div className="absolute inset-0 w-full h-full">
      <div className="absolute top-4 left-0 right-0 z-30 px-4 flex gap-2">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
          >
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width: index < currentStoryIndex ? '100%' : index === currentStoryIndex ? `${progress}%` : '0%'
              }}
              transition={{
                duration: 0.1,
                ease: 'linear'
              }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStory.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full"
        >
          {currentStory.type === 'video' ? (
            <video
              ref={videoRef}
              src={currentStory.url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <motion.img
              src={currentStory.url}
              alt={`Story ${currentStory.id}`}
              className="w-full h-full object-cover"
              animate={{
                scale: [1, 1.05, 1],
                x: ['-5%', '5%', '-5%']
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};
