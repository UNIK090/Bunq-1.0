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
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import toast from "react-hot-toast";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const AdvancedVideoPlayer: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentVideo,
    videoProgress,
    updateVideoProgress,
  } = useAppStore();

  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Track intervals watched
  const [watchedIntervals, setWatchedIntervals] = useState<[number, number][]>([]);

  // Network State Listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("✅ You are back online");
    };
    const handleOffline = () => {
      setIsOffline(true);
      toast.error("⚠️ You are offline - playback may fail");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // YouTube Player Init
  useEffect(() => {
    if (!currentVideo || isOffline) return;

    const videoId = currentVideo.id;
    const savedProgress = videoProgress[videoId];
    const startTime = savedProgress ? Math.max(0, savedProgress.timestamp - 2) : 0;

    if (ytPlayerRef.current?.loadVideoById) {
      const loadedId = ytPlayerRef.current.getVideoData()?.video_id;
      if (loadedId !== videoId) {
        ytPlayerRef.current.loadVideoById({ videoId, startSeconds: Math.floor(startTime) });
      }
      return;
    }

    const createPlayer = () => {
      if (!playerRef.current) return;
      ytPlayerRef.current = new window.YT.Player(playerRef.current, {
        height: "100%",
        width: "100%",
        videoId,
        playerVars: {
          autoplay: 1,
          start: Math.floor(startTime),
          playsinline: 1,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: (e: any) => {
            const code = e.data;
            const message =
              {
                2: "Invalid video ID",
                5: "HTML5 player error",
                100: "Video not found",
                101: "Embedding disabled",
                150: "Embedding disabled",
              }[code] || `Unknown error (code: ${code})`;
            setLoadError(message);
          },
        },
      });
    };

    const loadYTAPI = () => {
      if (window.YT?.Player) createPlayer();
      else {
        window.onYouTubeIframeAPIReady = createPlayer;
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        document.body.appendChild(tag);
      }
    };

    loadYTAPI();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      ytPlayerRef.current?.destroy();
      ytPlayerRef.current = null;
    };
  }, [currentVideo, isOffline]);

  const onPlayerReady = (event: any) => {
    setIsLoading(false);
    setDuration(event.target.getDuration());

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      if (!ytPlayerRef.current) return;
      const time = ytPlayerRef.current.getCurrentTime();
      setCurrentTime(time);
      trackWatchIntervals(time);
      if (currentVideo && Math.floor(time) % 15 === 0) {
        updateVideoProgress(currentVideo.id, time, ytPlayerRef.current.getDuration());
      }
    }, 1000);
  };

  const onPlayerStateChange = (event: any) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    if (event.data === window.YT.PlayerState.ENDED) {
      toast.success("🎉 Video completed!");
    }
  };

  // Track progress watcher
  const trackWatchIntervals = (time: number) => {
    setWatchedIntervals((prev) => {
      if (prev.length === 0) return [[time, time]];
      const last = prev[prev.length - 1];
      if (time >= last[0] && time <= last[1] + 2) {
        const newLast = [last[0], Math.max(last[1], time)];
        return [...prev.slice(0, -1), newLast];
      } else {
        return [...prev, [time, time]];
      }
    });
  };

  // Controls
  const togglePlayPause = () => {
    if (!ytPlayerRef.current) return;
    isPlaying ? ytPlayerRef.current.pauseVideo() : ytPlayerRef.current.playVideo();
  };

  const toggleMute = () => {
    if (!ytPlayerRef.current) return;
    isMuted ? ytPlayerRef.current.unMute() : ytPlayerRef.current.mute();
    setIsMuted(!isMuted);
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ytPlayerRef.current) return;
    const v = parseFloat(e.target.value);
    ytPlayerRef.current.setVolume(v * 100);
    setVolume(v);
    setIsMuted(v === 0);
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ytPlayerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    ytPlayerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  if (!currentVideo) return <div className="flex justify-center items-center h-full text-white">Loading video...</div>;

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white relative">
      {isOffline && (
        <div className="bg-yellow-500 text-yellow-900 py-1 px-4 fixed top-0 left-0 right-0 z-50 flex items-center gap-2 font-semibold">
          <WifiOff className="w-5 h-5 animate-pulse" /> You are offline
        </div>
      )}

      <header className="flex items-center p-4 bg-gradient-to-r from-purple-800 to-pink-800 gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-indigo-300">
          <ChevronLeft className="w-6 h-6" /> Back
        </button>
        <h1 className="text-xl font-extrabold truncate">{currentVideo.title}</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-2 space-y-2">
        <div ref={playerRef} className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-40">
              <div className="animate-spin border-4 border-indigo-400 border-t-transparent rounded-full w-12 h-12"></div>
            </div>
          )}
          {loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 text-red-400 p-6">
              <AlertTriangle className="w-16 h-16 animate-pulse mb-4" />
              <p className="font-bold mb-4">{loadError}</p>
              <button onClick={() => window.location.reload()} className="bg-indigo-600 px-5 py-2 rounded hover:bg-indigo-700">
                <RefreshCw className="inline mr-2 w-5 h-5" /> Retry
              </button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative w-full max-w-5xl h-3 bg-gray-700 rounded cursor-pointer" onClick={onSeek}>
          {watchedIntervals.map(([start, end], i) => {
            const left = (start / duration) * 100;
            const width = ((end - start) / duration) * 100;
            return <div key={i} className="absolute h-3 bg-green-500 opacity-60 rounded" style={{ left: `${left}%`, width: `${width}%` }} />;
          })}
          <div className="absolute h-3 bg-indigo-400 rounded" style={{ width: `${(currentTime / duration) * 100}%` }} />
        </div>

        {/* Controls */}
        <div className="w-full max-w-5xl flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-800 to-pink-800 rounded-lg shadow-lg space-x-4">
          <button onClick={togglePlayPause}>{isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}</button>
          <button onClick={toggleMute}>{isMuted ? <VolumeX className="w-6 h-6"/> : <Volume2 className="w-6 h-6" />}</button>
          <input type="range" min={0} max={1} step={0.01} value={volume} onChange={onVolumeChange} className="w-28"/>
          <button onClick={toggleFullscreen} className="ml-auto">{isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}</button>
        </div>

        <div className="w-full max-w-5xl flex justify-between px-4 text-xs text-gray-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </main>
    </div>
  );
};

export default AdvancedVideoPlayer;
