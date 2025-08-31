import React, { useMemo, useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { useAppStore } from "../../store/useAppStore";
import { Video } from "../../types";

const MiniPlayer: React.FC<{
  video: Video;
  onClose: () => void;
}> = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [size, setSize] = useState({ width: 320, height: 180 }); // initial 16:9 ratio size
  const resizingRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const onMouseMove = (e: MouseEvent) => {
    if (!resizingRef.current) return;
    const { startX, startY, startWidth } = resizingRef.current;
    const deltaX = e.clientX - startX;

    let newWidth = startWidth + deltaX;
    newWidth = Math.max(200, Math.min(newWidth, 640)); // clamp width

    // Calculate height maintaining 16:9 aspect ratio
    const newHeight = newWidth * 9 / 16;

    setSize({ width: newWidth, height: newHeight });
  };

  const onMouseUp = () => {
    resizingRef.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      className="fixed bottom-4 right-4 bg-black bg-opacity-90 rounded-md shadow-lg text-white flex flex-col select-none z-50"
      style={{ width: size.width, height: size.height }}
    >
      <div className="flex items-center justify-between bg-gray-900 px-3 py-1 cursor-move">
        <span className="font-semibold truncate max-w-[calc(100%-40px)]">
          {video.title}
        </span>
        <button
          aria-label="Close mini player"
          onClick={onClose}
          className="text-white hover:text-red-400"
        >
          ✕
        </button>
      </div>
      <iframe
        title={`Mini player ${video.title}`}
        src={`https://www.youtube.com/embed/${video.id}?autoplay=${isPlaying ? "1" : "0"}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="flex-grow rounded-b-md"
        style={{ width: "100%", height: `calc(100% - 36px)` }} // header height subtracted
      />
      {/* Resize handle at bottom-right */}
      <div
        onMouseDown={onResizeMouseDown}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-600 opacity-75 hover:opacity-100 rounded-br-md"
      />
    </div>
  );
};

const RecentVideos: React.FC = () => {
  const { dailyActivities } = useAppStore();
  const [miniPlayerVideo, setMiniPlayerVideo] = useState<Video | null>(null);

  // Sorted most recent 5 activities
  const sortedActivities = useMemo(() => {
    return [...dailyActivities]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [dailyActivities]);

  const handleVideoClick = (video: Video) => {
    setMiniPlayerVideo(video);
  };

  return (
    <>
      {sortedActivities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No recently watched videos.</p>
          <p>Search for videos and add them to your playlists to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer"
              onClick={() => handleVideoClick(activity.video)}
            >
              <img
                src={activity.video.thumbnail}
                alt={activity.video.title}
                className="w-24 h-16 object-cover rounded"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{activity.video.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Watched {formatDistanceToNow(new Date(activity.createdAt))} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mini player overlay */}
      {miniPlayerVideo && (
        <MiniPlayer
          video={miniPlayerVideo}
          onClose={() => setMiniPlayerVideo(null)}
        />
      )}
    </>
  );
};

export default RecentVideos;
