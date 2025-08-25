import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { formatTime } from '../../utils/formatters';

interface Annotation {
  id: string;
  timestamp: number;
  text: string;
  color: string;
  createdAt: Date;
}

interface VideoAnnotationsProps {
  videoId: string;
  currentTime: number;
  onSeekToTime: (time: number) => void;
}

const VideoAnnotations: React.FC<VideoAnnotationsProps> = ({
  videoId,
  currentTime,
  onSeekToTime,
}) => {
  const { annotations, addAnnotation, updateAnnotation, deleteAnnotation } = useAppStore();
  const [newAnnotation, setNewAnnotation] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [isAdding, setIsAdding] = useState(false);

  const videoAnnotations = annotations[videoId] || [];

  const handleAddAnnotation = () => {
    if (newAnnotation.trim()) {
      addAnnotation(videoId, {
        id: Date.now().toString(),
        timestamp: Math.floor(currentTime),
        text: newAnnotation.trim(),
        color: selectedColor,
        createdAt: new Date(),
      });
      setNewAnnotation('');
      setIsAdding(false);
    }
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    deleteAnnotation(videoId, annotationId);
  };

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Video Notes
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {isAdding ? 'Cancel' : 'Add Note'}
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              At {formatTime(currentTime)}
            </label>
            <textarea
              value={newAnnotation}
              onChange={(e) => setNewAnnotation(e.target.value)}
              placeholder="Add your note here..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color
            </label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color ? 'border-gray-800 dark:border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleAddAnnotation}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save Note
          </button>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {videoAnnotations.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No notes yet. Add your first note at any timestamp!
          </p>
        ) : (
          videoAnnotations
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((annotation) => (
              <div
                key={annotation.id}
                className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => onSeekToTime(annotation.timestamp)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                      >
                        {formatTime(annotation.timestamp)}
                      </button>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: annotation.color }}
                      />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {annotation.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(annotation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnotation(annotation.id)}
                    className="text-red-500 hover:text-red-700 text-sm ml-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default VideoAnnotations;
