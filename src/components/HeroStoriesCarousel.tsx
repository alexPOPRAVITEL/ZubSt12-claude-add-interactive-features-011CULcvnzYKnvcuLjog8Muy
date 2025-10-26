import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface Story {
  id: number;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface HeroStoriesCarouselProps {
  stories: Story[];
}

export const HeroStoriesCarousel: React.FC<HeroStoriesCarouselProps> = ({ stories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const currentStory = stories[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
    setIsPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
    setIsPlaying(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  const togglePlayPause = () => {
    if (currentStory.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (currentStory.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, currentStory.type]);

  return (
    <div
      className="relative w-full h-full"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-4 pt-4">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{ width: index === currentIndex ? '100%' : index < currentIndex ? '100%' : '0%' }}
              transition={{ duration: index === currentIndex ? 5 : 0 }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          {currentStory.type === 'image' ? (
            <img
              src={currentStory.url}
              alt={`Story ${currentIndex + 1}`}
              className="w-full h-full object-cover object-[center_20%]"
            />
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={currentStory.url}
                poster={currentStory.thumbnail}
                className="w-full h-full object-cover"
                onClick={togglePlayPause}
                playsInline
                autoPlay
                muted
                loop
              />
              {!isPlaying && (
                <button
                  onClick={togglePlayPause}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-10 h-10 text-primary ml-1" />
                  </div>
                </button>
              )}
              {isPlaying && (
                <button
                  onClick={togglePlayPause}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Pause className="w-10 h-10 text-white" />
                </button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
        aria-label="Previous story"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
        aria-label="Next story"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Story counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
        {currentIndex + 1} / {stories.length}
      </div>
    </div>
  );
};
