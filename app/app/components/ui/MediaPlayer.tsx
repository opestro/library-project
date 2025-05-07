import { useState, useEffect, useRef } from 'react';
import { RiPlayFill, RiPauseFill, RiVolumeMuteFill, RiVolumeUpFill, RiFullscreenFill, RiFullscreenExitFill, RiRepeatFill, RiDownloadFill } from 'react-icons/ri';
import pb from '../../lib/pocketbase';
import type { Document } from '../../lib/pocketbase';

interface MediaPlayerProps {
  document: Document;
  type: 'audio' | 'video';
}

/**
 * An advanced media player component with custom controls and tracking
 * Features:
 * - Custom play/pause controls
 * - Progress tracking with seek functionality
 * - Volume control with mute toggle
 * - Fullscreen support for videos
 * - Download option
 * - Time display
 * - Auto-hide controls for video
 * 
 * @param document - The document object containing media files
 * @param type - The type of media player to render ('audio' | 'video')
 */
export default function MediaPlayer({ document, type }: MediaPlayerProps) {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Get the media URL based on type
  const mediaUrl = type === 'video' 
    ? document.video ? pb.files.getUrl(document, document.video) : null
    : document.voice ? pb.files.getUrl(document, document.voice) : null;

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted) {
        mediaRef.current.volume = 0;
        setVolume(0);
      } else {
        mediaRef.current.volume = 1;
        setVolume(1);
      }
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    const container = mediaRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement && container.requestFullscreen) {
      container.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(console.error);
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(console.error);
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && mediaRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      mediaRef.current.currentTime = pos * duration;
    }
  };

  // Handle media events
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleTimeUpdate = () => {
      setCurrentTime(media.currentTime);
      setProgress((media.currentTime / media.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(media.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('loadedmetadata', handleLoadedMetadata);
    media.addEventListener('play', handlePlay);
    media.addEventListener('pause', handlePause);
    media.addEventListener('ended', handleEnded);

    return () => {
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('loadedmetadata', handleLoadedMetadata);
      media.removeEventListener('play', handlePlay);
      media.removeEventListener('pause', handlePause);
      media.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle auto-hide controls for video
  useEffect(() => {
    if (type === 'video') {
      const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
          if (isPlaying) {
            setShowControls(false);
          }
        }, 3000);
      };

      const container = mediaRef.current?.parentElement;
      if (container) {
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', () => setShowControls(false));

        return () => {
          container.removeEventListener('mousemove', handleMouseMove);
          container.removeEventListener('mouseleave', () => setShowControls(false));
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
          }
        };
      }
    }
  }, [type, isPlaying]);

  if (!mediaUrl) return null;

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-lg group">
      {type === 'video' ? (
        <>
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            className="w-full aspect-video cursor-pointer"
            onClick={togglePlay}
            preload="metadata"
            poster={document.image ? pb.files.getUrl(document, document.image) : undefined}
          >
            <source src={mediaUrl} type="video/mp4" />
            عذراً، متصفحك لا يدعم تشغيل الفيديو.
          </video>

          {/* Video Overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </>
      ) : (
        <div className="p-6 bg-white dark:bg-neutral-900">
          <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            preload="metadata"
          >
            <source src={mediaUrl} type="audio/mpeg" />
            عذراً، متصفحك لا يدعم تشغيل الصوت.
          </audio>

          {/* Audio Visualization Placeholder */}
          <div className="h-24 mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
            <div className="flex items-center gap-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary"
                  style={{
                    height: `${Math.random() * 100}%`,
                    opacity: isPlaying ? 1 : 0.5,
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 transition-opacity duration-300 ${
          type === 'video' ? (showControls || !isPlaying ? 'opacity-100' : 'opacity-0') : ''
        }`}
      >
        {/* Progress Bar */}
        <div 
          ref={progressRef}
          className="h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-primary rounded-full relative group-hover:bg-primary-dark transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="text-white hover:text-primary transition-colors"
            aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
          >
            {isPlaying ? <RiPauseFill size={24} /> : <RiPlayFill size={24} />}
          </button>

          {/* Time Display */}
          <div className="text-sm text-white">
            <span>{formatTime(currentTime)}</span>
            <span className="mx-1">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-white hover:text-primary transition-colors"
              aria-label={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <RiVolumeMuteFill size={24} /> : <RiVolumeUpFill size={24} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 accent-primary"
            />
          </div>

          <div className="flex-grow" />

          {/* Download Button */}
          <a
            href={mediaUrl}
            download
            className="text-white hover:text-primary transition-colors"
            aria-label="تحميل"
          >
            <RiDownloadFill size={20} />
          </a>

          {/* Fullscreen Button (Video Only) */}
          {type === 'video' && (
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-primary transition-colors"
              aria-label={isFullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}
            >
              {isFullscreen ? <RiFullscreenExitFill size={20} /> : <RiFullscreenFill size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 