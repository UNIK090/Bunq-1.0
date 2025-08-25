import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { searchVideos } from '../../services/youtubeApi';
import { useNavigate } from 'react-router-dom';
import { Video } from '../../types';
import toast from 'react-hot-toast';

const SearchVideos: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { playlists, searchResults, setSearchResults, setCurrentVideo, addVideoToPlaylist } = useAppStore();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | ''>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchVideos(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching videos:', error);
      toast.error('Error searching videos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToPlaylist = (video: Video) => {
    if (!selectedPlaylistId) {
      toast.error('Please select a playlist first');
      return;
    }

    addVideoToPlaylist(selectedPlaylistId, video);
    toast.success(`Added "${video.title}" to playlist`);
  };

  const handleWatchNow = (video: Video) => {
    if (!video.id) {
      console.error('Video ID is undefined. Cannot navigate to video player.');
      return;
    }
    setCurrentVideo(video);
    navigate('/player');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 pr-12 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            placeholder="Search for educational videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !searchTerm.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </button>
      </form>

      {/* Select playlist dropdown */}
      {searchResults.length > 0 && (
        <div className="mb-4">
          <label htmlFor="playlist-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select a playlist to add videos to:
          </label>
          <select
            id="playlist-select"
            value={selectedPlaylistId}
            onChange={(e) => setSelectedPlaylistId(e.target.value)}
            className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a playlist...</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
          {playlists.length === 0 && (
            <p className="mt-1 text-sm text-red-500">
              You don't have any playlists. Create a playlist first to save videos.
            </p>
          )}
        </div>
      )}

      {/* Search results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searchResults.map((video) => (
          <div key={video.id} className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-36 object-cover"
              />
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-gray-200 text-black dark:bg-black dark:bg-opacity-80 dark:text-white text-xs px-1 py-0.5 rounded">
                  {video.duration}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3">
              <h3 className="font-medium text-sm mb-1 line-clamp-2" title={video.title}>
                {video.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{video.channelTitle}</p>

              {/* Action buttons */}
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleWatchNow(video)}
                  className="flex-1 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-medium py-1 px-3 text-xs rounded-md"
                >
                  Watch Now
                </button>
                <button
                  onClick={() => handleAddToPlaylist(video)}
                  disabled={!selectedPlaylistId || playlists.length === 0}
                  className="flex-1 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 text-green-700 dark:text-green-200 font-medium py-1 px-3 text-xs rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Playlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <span className="ml-2 text-gray-500">Searching videos...</span>
        </div>
      )}

      {/* Empty state */}
      {searchResults.length === 0 && !isLoading && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No videos found for "{searchTerm}".</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different search term.</p>
        </div>
      )}

      {/* Initial state */}
      {searchResults.length === 0 && !isLoading && !searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Search for educational videos to add to your learning playlists.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Try searching for topics like "React hooks", "TypeScript tutorial", or "CSS grid".
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchVideos;