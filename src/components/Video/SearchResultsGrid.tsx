import React, { useState } from 'react';
import { Video } from '../../types';
import { Search, Play, Pause, Check, Plus, Loader } from 'lucide-react';

interface SearchResultsGridProps {
  results: Video[];
  isLoading: boolean;
  onAddToPlaylist: (video: Video) => void;
  onWatchNow: (video: Video) => void;
  viewMode: 'grid' | 'list';
}

const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({ 
  results, 
  isLoading, 
  onAddToPlaylist, 
  onWatchNow,
  viewMode 
}) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null);
  const [addedVideos, setAddedVideos] = useState<Set<string>>(new Set());

  const handleAddToPlaylist = async (video: Video) => {
    setAddingToPlaylist(video.id);
    try {
      await onAddToPlaylist(video);
      setAddedVideos(prev => new Set(prev).add(video.id));
      
      // Remove the success indicator after 2 seconds
      setTimeout(() => {
        setAddedVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(video.id);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Error adding to playlist:', error);
    } finally {
      setAddingToPlaylist(null);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Searching videos...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-600 mb-4">
          <Search className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">No results found</h3>
        <p className="text-gray-500 dark:text-gray-400">Try a different search term or adjust your filters</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {results.map((video) => (
          <div key={video.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex">
            <div className="relative w-48 h-32 flex-shrink-0">
              {playingVideoId === video.id ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=0`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setPlayingVideoId(video.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </button>
                </>
              )}
              {video.duration && !playingVideoId && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              )}
            </div>
            <div className="p-4 flex-1">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2" title={video.title}>
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{video.channelTitle}</p>
              {video.duration && (
                <span className="inline-block bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded mb-3">
                  {video.duration}
                </span>
              )}
              <div className="flex space-x-3">
                <button
                  onClick={() => onWatchNow(video)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Watch Now
                </button>
                <button
                  onClick={() => handleAddToPlaylist(video)}
                  className="relative px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {addingToPlaylist === video.id ? (
                    <Loader className="animate-spin h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  ) : addedVideos.has(video.id) ? (
                    <Check className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  ) : null}
                  Add to Playlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((video) => (
          <div key={video.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              {playingVideoId === video.id ? (
                <iframe
                  width="100%"
                  height="192"
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=0`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-48 object-cover"
                />
              ) : (
                <>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => setPlayingVideoId(video.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </button>
                </>
              )}
              {video.duration && !playingVideoId && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              )}
            </div>
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2" title={video.title}>
              {video.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{video.channelTitle}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => onWatchNow(video)}
                className="flex-1 bg-primary-600 text-white py-2 px-3 text-xs rounded-md hover:bg-primary-700 transition-colors"
              >
                Watch Now
              </button>
              <button
                onClick={() => handleAddToPlaylist(video)}
                className="relative flex-1 bg-green-600 text-white py-2 px-3 text-xs rounded-md hover:bg-green-700 transition-colors"
              >
                {addingToPlaylist === video.id ? (
                  <Loader className="animate-spin h-3 w-3 absolute left-1 top-1/2 transform -translate-y-1/2" />
                ) : addedVideos.has(video.id) ? (
                  <Check className="h-3 w-3 absolute left-1 top-1/2 transform -translate-y-1/2" />
                ) : null}
                Add to Playlist
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultsGrid;
