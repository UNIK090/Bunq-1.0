import React from 'react';
import { Video } from '../../types';

interface PlaylistModalProps {
  videos: Video[];
  onClose: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ videos, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Playlist Videos</h2>
        <button onClick={onClose} className="text-red-500 mb-4">Close</button>
        <div className="space-y-4">
          {videos.map(video => (
            <div key={video.id} className="flex items-center">
              <img src={video.thumbnail} alt={video.title} className="w-16 h-16 rounded" />
              <div className="ml-4">
                <h3 className="font-medium">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.channelTitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;
