import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  RefreshCw,
  WifiOff,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  SkipForward,
  SkipBack,
  Sun,
  Moon,
  Crop,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import toast from "react-hot-toast";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const VideoPlayer: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentVideo,
    videoProgress,
    updateVideoProgress,
    notificationSettings,
    setCurrentVideo,
  } = useAppStore();

  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  
  const addDebugInfo = (msg: string) => setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  // Offline Detection
  useEffect(() => {
    const onlineHandler = () => {
      setIsOffline(false);
      addDebugInfo("Connection restored");
      toast.success("You are online");
    };
    const offlineHandler = () => {
      setIsOffline(true);
      addDebugInfo("Connection lost");
      toast.error("You are offline");
    };
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);
    
    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);

  // YouTube Player Initialization and Lifecycle
  useEffect(() => {
    if(!currentVideo || isOffline) return;

    const videoId = currentVideo.id;
    const savedProgress = videoProgress[videoId];
    const startSeconds = savedProgress ? Math.max(0, savedProgress.timestamp - 2) : 0;

    if (ytPlayerRef.current?.loadVideoById) {
      const loadedVideoId = ytPlayerRef.current.getVideoData()?.video_id;
      if (loadedVideoId !== videoId) {
        ytPlayerRef.current.loadVideoById({ videoId, startSeconds: Math.floor(startSeconds) });
      }
      return;
    }

    const createPlayer = () => {
      if (!playerRef.current) return;
      ytPlayerRef.current = new window.YT.Player(playerRef.current, {
        height: "100%", width: "100%", videoId,
        playerVars: { autoplay: 1, start: Math.floor(startSeconds), modestbranding: 1, rel: 0, playsinline: 1, origin: window.location.origin },
        events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange, onError: onPlayerError },
      });
    };

    const loadYTAPI = () => {
      if (window.YT?.Player) {
        createPlayer();
      } else {
        window.onYouTubeIframeAPIReady = createPlayer;
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        document.body.appendChild(tag);
      }
    };

    loadYTAPI();

    return () => {
      if(timerRef.current) clearInterval(timerRef.current);
      ytPlayerRef.current?.destroy();
      ytPlayerRef.current = null;
    };
  }, [currentVideo, isOffline]);

  function onPlayerReady(event: any) {
    setIsLoading(false);
    setLoadError(null);
    setDuration(event.target.getDuration());
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      if (!ytPlayerRef.current) return;
      const time = ytPlayerRef.current.getCurrentTime();
      setCurrentTime(time);
      if (currentVideo && Math.floor(time) % 15 === 0) {
        updateVideoProgress(currentVideo.id, time, ytPlayerRef.current.getDuration());
      }
    }, 1000);
  }

  function onPlayerStateChange(event: any) {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    addDebugInfo(`PlayerState: ${event.data}`);

    if (event.data === window.YT.PlayerState.ENDED) {
      const justCompleted = saveProgress(true);
      if (justCompleted && notificationSettings?.completionNotifications) {
        toast.success('🎉 Video completed! Great job!');
      }
    }
  }

  function onPlayerError(event: any) {
    const code = event.data;
    setLoadError(getYTErrorMessage(code));
  }

  function getYTErrorMessage(code: number) {
    return {
      2: "Invalid video ID.",
      5: "HTML5 player error.",
      100: "Video not found/removed.",
      101: "Embedding not allowed.",
      150: "Embedding not allowed.",
    }[code] || `Unknown error (${code})`;
  }

  function saveProgress(completed = false): boolean {
    if (!currentVideo || !ytPlayerRef.current) return false;
    const time = ytPlayerRef.current.getCurrentTime();
    const dur = ytPlayerRef.current.getDuration();
    const prev = videoProgress[currentVideo.id];
    const wasDone = prev?.completed || false;
    const nowDone = completed || time >= dur * 0.95;
    updateVideoProgress(currentVideo.id, time, dur);
    return !wasDone && nowDone;
  }

  // Controls handlers
  function togglePlay() {
    if(!ytPlayerRef.current) return;
    if(isPlaying) ytPlayerRef.current.pauseVideo();
    else ytPlayerRef.current.playVideo();
  }
  function toggleMute() {
    if(!ytPlayerRef.current) return;
    if(isMuted) ytPlayerRef.current.unMute();
    else ytPlayerRef.current.mute();
    setIsMuted(!isMuted);
  }
  function adjustVolume(e: React.ChangeEvent<HTMLInputElement>) {
    if(!ytPlayerRef.current) return;
    const val = parseFloat(e.target.value);
    ytPlayerRef.current.setVolume(val * 100);
    setVolume(val);
    setIsMuted(val === 0);
  }
  function changePlaybackRate(rate: number) {
    if(!ytPlayerRef.current) return;
    ytPlayerRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
    toast(`Playback speed: ${rate}x`);
  }
  function toggleFullscreen() {
    if(!playerRef.current) return;
    if(!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume((v) => Math.min(1, v + 0.1));
          ytPlayerRef.current?.setVolume((volume + 0.1) * 100);
          setIsMuted(false);
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 0.1));
          ytPlayerRef.current?.setVolume((volume - 0.1) * 100);
          setIsMuted(volume - 0.1 <= 0);
          break;
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [volume, isPlaying, isMuted]);

  // Progress bar seek
  function seekVideo(e: React.MouseEvent<HTMLDivElement>) {
    if(!ytPlayerRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPos = e.clientX - rect.left;
    const newTime = (clickPos / rect.width) * duration;
    ytPlayerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  }

  if (!currentVideo) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-900 text-white text-xl font-bold">
        Loading video details...
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "dark" : ""} h-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      {isOffline && (
        <div className="bg-yellow-400 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-200 px-4 py-2 flex justify-center items-center gap-2 font-bold">
          <WifiOff className="w-5 h-5 animate-pulse" />
          You are offline — playback may be limited.
        </div>
      )}
      <header className="p-4 flex items-center gap-6 bg-gradient-to-r from-purple-700 to-pink-700 shadow-lg">
        <button
          onClick={() => {
            saveProgress();
            navigate(-1);
          }}
          className="flex items-center gap-1 font-semibold tracking-wide rounded-lg px-3 py-2 bg-indigo-800 hover:bg-indigo-900 transition"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" /> Back
        </button>
        <h1 className="text-2xl font-extrabold truncate max-w-xl">{currentVideo.title}</h1>
        <div className="ml-auto flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode((mode) => !mode)}
            title="Toggle dark/light mode"
            aria-label="Toggle dark mode"
            className="p-2 hover:bg-indigo-600 rounded transition"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          <button
            onClick={() => setShowDebug((show) => !show)}
            title="Toggle debug console"
            aria-label="Toggle debug console"
            className="p-2 hover:bg-indigo-600 rounded transition"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-4">
        <div ref={playerRef} className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden shadow-xl bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
              <div className="loader-neon"></div>
            </div>
          )}
          {loadError && (
            <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-red-400 p-8 z-50 space-y-6 rounded-lg">
              <AlertTriangle className="w-12 h-12 animate-pulse" />
              <p className="text-xl font-bold">{loadError}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg font-extrabold text-lg"
              >
                Retry
              </button>
            </div>
          )}
          {/* YouTube iframe inserted by API */}
        </div>

        {/* Controls */}
        <section className="w-full max-w-5xl mt-6 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg px-6 py-4 text-white shadow-neon flex flex-col space-y-4">
          
          {/* Progress bar */}
          <div
            ref={progressBarRef}
            className="relative h-4 bg-indigo-800 rounded-full cursor-pointer group"
            onClick={seekVideo}
            onMouseMove={(e) => {
              if(!progressBarRef.current) return;
              const rect = progressBarRef.current.getBoundingClientRect();
              const pos = e.clientX - rect.left;
              const timeHover = (pos / rect.width) * duration;
              setHoverTime(timeHover);
            }}
            onMouseLeave={() => setHoverTime(null)}
          >
            <div
              className="h-4 bg-gradient-to-r from-purple-400 via-pink-600 to-indigo-400 rounded-full transition-all duration-200 shadow-glow"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            {hoverTime !== null && (
              <div
                className="absolute bottom-full mb-2 px-2 py-1 rounded bg-indigo-700 text-sm font-mono pointer-events-none select-none"
                style={{
                  left: `${(hoverTime / duration) * 100}%`,
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          {/* Time & controls row */}
          <div className="flex items-center justify-between">
            <span className="font-mono">{formatTime(currentTime)}</span>

            <div className="flex items-center space-x-6">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="p-3 rounded-full bg-pink-600 shadow-glow hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              {/* Mute & Volume */}
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="p-2 rounded-full bg-purple-700 hover:bg-purple-600 shadow-glow"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={adjustVolume}
                aria-label="Volume"
                className="w-32 accent-pink-500"
              />

              {/* Playback Speed */}
              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(Number(e.target.value))}
                aria-label="Playback speed"
                className="bg-indigo-700 rounded-md py-1 px-2 text-white shadow-inner"
              >
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}x
                  </option>
                ))}
              </select>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                className="p-2 rounded-full bg-indigo-700 hover:bg-indigo-600 shadow-glow"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>

            <span className="font-mono">{formatTime(duration)}</span>
          </div>
        </section>

        {/* Description panel */}
        <section className="max-w-5xl w-full mt-5 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg overflow-auto">
          <h2 className="text-2xl font-bold mb-3">Description</h2>
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
            {currentVideo.description || "No description available."}
          </p>
        </section>

        {/* Debug Console */}
        {showDebug && (
          <section className="max-w-5xl w-full mt-5 bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg p-4 font-mono text-xs max-h-40 overflow-y-auto shadow-inner">
            <h3 className="font-bold mb-2">Debug Console:</h3>
            {debugInfo.map((line, i) => (
              <div key={`${line}-${i}`}>{line}</div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default VideoPlayer;

/* 
Add the following Tailwind utilities for glowing shadows and loader animation:

.shadow-glow {
  box-shadow:
    0 0 6px #db2777,
    0 0 12px #db2777,
    0 0 24px #db2777;
}

.loader-neon {
  border: 4px solid rgba(219, 39, 119, 0.2);
  border-top: 4px solid #db2777;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
*/
