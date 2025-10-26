import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { useLearningAnalytics } from '../../hooks/useLearningAnalytics';
import { useLearningProgress } from '../../hooks/useLearningProgress';
import { useUser } from '../../hooks/useUser';

interface VideoPlayerProps {
  stepId: string;
  lessonId: string;
  videoContent: {
    url: string;
    thumbnail?: string;
    duration?: number;
  };
  onComplete?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  stepId,
  lessonId,
  videoContent,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [watchedSegments, setWatchedSegments] = useState<Set<number>>(new Set());
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [totalWatchTime, setTotalWatchTime] = useState(0);

  const { trackVideoEvent } = useLearningAnalytics();
  const { user } = useUser();
  const { updateVideoProgress, getVideoProgress } = useLearningProgress(user?.id || null);

  useEffect(() => {
    loadSavedProgress();

    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const currentSecond = Math.floor(videoRef.current.currentTime);
        setWatchedSegments(prev => new Set([...prev, currentSecond]));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (watchedSegments.size > 0) {
        saveProgress();
      }
    }, 10000);

    return () => {
      clearInterval(saveInterval);
      saveProgress();
    };
  }, [watchedSegments, currentTime, totalWatchTime]);

  const loadSavedProgress = async () => {
    const savedProgress = await getVideoProgress(stepId);
    if (savedProgress && videoRef.current) {
      videoRef.current.currentTime = savedProgress.last_position || 0;
      setWatchedSegments(new Set(savedProgress.watched_segments || []));
      setTotalWatchTime(savedProgress.watch_time || 0);
    }
  };

  const saveProgress = async () => {
    if (!videoRef.current) return;

    const completionPercent = (watchedSegments.size / duration) * 100;

    await updateVideoProgress({
      stepId,
      videoUrl: videoContent.url,
      watchedSegments: Array.from(watchedSegments),
      totalDuration: duration,
      watchTime: totalWatchTime + (sessionStartTime ? (Date.now() - sessionStartTime) / 1000 : 0),
      lastPosition: currentTime,
      completionPercent,
    });

    if (completionPercent >= 95 && onComplete) {
      onComplete();
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setSessionStartTime(Date.now());

      trackVideoEvent('play', {
        stepId,
        lessonId,
        currentTime: videoRef.current.currentTime,
        duration: videoRef.current.duration,
      });
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);

      if (sessionStartTime) {
        const sessionDuration = (Date.now() - sessionStartTime) / 1000;
        setTotalWatchTime(prev => prev + sessionDuration);
        setSessionStartTime(null);
      }

      trackVideoEvent('pause', {
        stepId,
        lessonId,
        currentTime: videoRef.current.currentTime,
        percentWatched: (watchedSegments.size / duration) * 100,
      });

      saveProgress();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);

    trackVideoEvent('seek', {
      stepId,
      lessonId,
      currentTime: newTime,
    });
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const completionPercent = duration > 0 ? (watchedSegments.size / duration) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden group">
        <video
          ref={videoRef}
          src={videoContent.url}
          poster={videoContent.thumbnail}
          className="w-full aspect-video"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            if (onComplete) onComplete();
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            className="relative h-1 bg-white/30 rounded-full cursor-pointer mb-3"
            onClick={handleSeek}
          >
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
            <div className="absolute top-0 left-0 h-full flex">
              {Array.from({ length: Math.ceil(duration) }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-full ${
                    watchedSegments.has(i) ? 'bg-blue-300/50' : ''
                  }`}
                  style={{ width: `${100 / duration}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-3">
              <button onClick={isPlaying ? handlePause : handlePlay}>
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <button onClick={toggleMute}>
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button>
                <Settings className="w-5 h-5" />
              </button>
              <button onClick={toggleFullscreen}>
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Watched</p>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(completionPercent)}%
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Watch Time</p>
          <p className="text-2xl font-bold text-green-600">
            {formatTime(totalWatchTime)}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Segments</p>
          <p className="text-2xl font-bold text-purple-600">
            {watchedSegments.size}/{Math.ceil(duration)}
          </p>
        </div>
      </div>
    </div>
  );
};
