import { useRef, useState, useEffect } from 'react';
import type { Document } from '~/lib/pocketbase';
import pb from '~/lib/pocketbase';
import {
  RiPlayFill,
  RiPauseFill,
  RiVolumeMuteFill,
  RiVolumeUpFill,
  RiFullscreenFill,
  RiFullscreenExitFill,
  RiDownload2Line,
  RiRepeatFill,
  RiShuffleFill,
  RiSkipBackFill,
  RiSkipForwardFill,
} from 'react-icons/ri';

// Declare fullscreen API types
declare global {
  interface Document {
    fullscreenElement: Element | null;
    webkitFullscreenElement: Element | null;
    mozFullScreenElement: Element | null;
    msFullscreenElement: Element | null;
    exitFullscreen: () => Promise<void>;
    webkitExitFullscreen: () => Promise<void>;
    mozCancelFullScreen: () => Promise<void>;
    msExitFullscreen: () => Promise<void>;
  }

  interface HTMLElement {
    requestFullscreen: () => Promise<void>;
    webkitRequestFullscreen: () => Promise<void>;
    mozRequestFullScreen: () => Promise<void>;
    msRequestFullscreen: () => Promise<void>;
  }
}

interface MediaPlayerProps {
  document: Document;
  type: 'video' | 'audio';
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  isFloating?: boolean;
}

/**
 * Enhanced media player component that supports both audio and video playback
 * Features:
 * - Custom controls with play/pause, volume, progress bar
 * - Video poster image support
 * - Floating audio player mode
 * - Download option
 * - Fullscreen support for videos
 */
export default function MediaPlayer({ 
  document, 
  type,
  onPlay,
  onPause,
  onTimeUpdate,
  isFloating = false
}: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const mediaUrl = type === 'video' 
    ? pb.files.getUrl(document, document.video!)
    : pb.files.getUrl(document, document.voice!);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!mediaRef.current) return;
    
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (!mediaRef.current) return;
    
    if (isMuted) {
      mediaRef.current.volume = volume;
      setIsMuted(false);
    } else {
      mediaRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const doc = document as any;
    
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement &&
        !doc.mozFullScreenElement && !doc.msFullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!mediaRef.current) return;
    
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    mediaRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
    setCurrentTime(newTime);
  };

  useEffect(() => {
    if (!mediaRef.current) return;

    const media = mediaRef.current;

    const handleTimeUpdate = () => {
      if (!media || isSeeking) return;
      const current = media.currentTime;
      const duration = media.duration;
      setCurrentTime(current);
      setProgress((current / duration) * 100);
      onTimeUpdate?.(current);
    };

    const handleLoadedMetadata = () => {
      setDuration(media.duration);
      setIsLoaded(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (isLooping) {
        media.currentTime = 0;
        media.play();
      }
    };

    // Add event listeners
    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('loadedmetadata', handleLoadedMetadata);
    media.addEventListener('play', handlePlay);
    media.addEventListener('pause', handlePause);
    media.addEventListener('ended', handleEnded);

    // Set initial volume
    media.volume = volume;

    // Cleanup
    return () => {
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('loadedmetadata', handleLoadedMetadata);
      media.removeEventListener('play', handlePlay);
      media.removeEventListener('pause', handlePause);
      media.removeEventListener('ended', handleEnded);
    };
  }, [onPlay, onPause, onTimeUpdate, isLooping, isSeeking, volume]);

  if (!mediaUrl) return null;

  const playerClassNames = `
    relative overflow-hidden
    ${type === 'video' ? 'aspect-video bg-black' : ''}
    ${isFloating ? 'fixed bottom-0 right-0 left-0 z-50 bg-white dark:bg-neutral-900 shadow-lg border-t border-neutral-200 dark:border-neutral-800' : ''}
  `.trim();

  const controlsClassNames = `
    absolute bottom-0 left-0 right-0
    ${type === 'video' ? 'p-4 bg-gradient-to-t from-black/80 to-transparent' : 'p-2'}
    ${showControls || !isPlaying || type === 'audio' ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-300
  `.trim();

  return (
    <div 
      ref={containerRef}
      className={`relative ${
        type === 'video' 
          ? 'aspect-video bg-black w-full max-w-full' 
          : isFloating 
            ? 'fixed bottom-0 left-0 right-0 h-16 md:h-20 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shadow-lg z-50'
            : 'w-full bg-gradient-to-r from-primary/5 to-primary/10'
      }`}
      dir="ltr"
    >
      {/* Media Element */}
      {type === 'video' ? (
        <>
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={mediaUrl}
            className="w-full h-full"
            poster={document.image ? pb.files.getUrl(document, document.image) : undefined}
          />
          {/* Video Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 space-y-2">
              {/* Progress Bar */}
              <div className="w-full flex items-center gap-2 px-2">
                <span className="text-xs text-white min-w-[40px]">
                  {formatTime(currentTime)}
                </span>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:h-0"
                  style={{
                    background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
                  }}
                />

                <span className="text-xs text-white min-w-[40px]">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 md:gap-4">
                  <button 
                    className="text-white hover:text-primary transition-colors"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <RiPauseFill size={24} /> : <RiPlayFill size={24} />}
                  </button>

                  <div className="hidden sm:flex items-center gap-2">
                    <button 
                      className="text-white hover:text-primary transition-colors"
                      onClick={toggleMute}
                    >
                      {isMuted ? <RiVolumeMuteFill size={20} /> : <RiVolumeUpFill size={20} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 md:w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <a 
                    href={mediaUrl}
                    download
                    className="text-white hover:text-primary transition-colors"
                  >
                    <RiDownload2Line size={20} />
                  </a>
                  <button 
                    className="text-white hover:text-primary transition-colors"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <RiFullscreenExitFill size={20} /> : <RiFullscreenFill size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={mediaUrl}
            className="hidden"
          />
          {/* Audio Player Controls */}
          <div className="w-full h-full flex items-center px-2 md:px-4 gap-2 md:gap-4">
            {/* Play Button */}
            <button 
              className="p-2 text-neutral-900 dark:text-white hover:text-primary transition-colors"
              onClick={togglePlay}
            >
              {isPlaying ? <RiPauseFill size={24} /> : <RiPlayFill size={24} />}
            </button>

            {/* Title and Progress */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-600 dark:text-neutral-400 min-w-[40px]">
                  {formatTime(currentTime)}
                </span>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:h-0"
                  style={{
                    background: `linear-gradient(to right, var(--primary-color) ${progress}%, rgb(229 231 235) ${progress}%)`
                  }}
                />

                <span className="text-xs text-neutral-600 dark:text-neutral-400 min-w-[40px]">
                  {formatTime(duration)}
                </span>
              </div>

              <div className="truncate">
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {document.title}
                </span>
                {document.expand?.author?.name && (
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 ms-2">
                    · {document.expand.author.name}
                  </span>
                )}
              </div>
            </div>

            {/* Volume and Download */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  className="text-neutral-900 dark:text-white hover:text-primary transition-colors"
                  onClick={toggleMute}
                >
                  {isMuted ? <RiVolumeMuteFill size={20} /> : <RiVolumeUpFill size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 md:w-20 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
                />
              </div>
              <a 
                href={mediaUrl}
                download
                className="text-neutral-900 dark:text-white hover:text-primary transition-colors"
              >
                <RiDownload2Line size={20} />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 