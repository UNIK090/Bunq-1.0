import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Clock, TrendingUp, History, Star, Play, Plus, Download } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { searchVideos } from '../../services/youtubeApi';
import { Video } from '../../types';
import SearchFilters from './SearchFilters';
import SearchResultsGrid from './SearchResultsGrid';
import PlaylistModal from './PlaylistModal';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFilterOptions {
  duration: string;
  uploadDate: string;
  sortBy: string;
  videoDefinition: string;
  videoType: string;
}

const SearchDashboard: React.FC = () => {
  const { darkMode, addVideoToPlaylist, setCurrentVideo, playlists } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilterOptions>({
    duration: 'any',
    uploadDate: 'any',
    sortBy: 'relevance',
    videoDefinition: 'any',
    videoType: 'any'
  });

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('youtubeSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('youtubeSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearch = useCallback(async (term: string = searchTerm) => {
    if (!term.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchVideos(term, filters);
      setSearchResults(results);
      
      // Add to search history
      if (!searchHistory.includes(term)) {
        setSearchHistory(prev => [term, ...prev.slice(0, 9)]);
      }

      // Generate suggestions based on results
      const newSuggestions = results.slice(0, 5).map(video => 
        video.title.split(' ').slice(0, 3).join(' ')
      );
      setSuggestions(newSuggestions);

    } catch (error) {
      console.error('Error searching videos:', error);
      toast.error('Error searching videos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filters, searchHistory]);

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleAddToPlaylist = (video: Video) => {
    if (playlists.length === 0) {
      toast.error('Please create a playlist first');
      return;
    }

    const defaultPlaylist = playlists[0];
    addVideoToPlaylist(defaultPlaylist.id, video);
    toast.success(`Added "${video.title}" to ${defaultPlaylist.name}`);
  };

  const handleWatchNow = (video: Video) => {
    setCurrentVideo(video);
    // Navigation to player will be handled by parent component
  };

  const handleFiltersChange = (newFilters: SearchFilterOptions) => {
    setFilters(newFilters);
    if (searchTerm) {
      handleSearch();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header Section */}
      <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Video Search</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Discover educational content from YouTube with advanced filtering
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-12 py-4 rounded-xl text-lg
                ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                placeholder-gray-500 dark:placeholder-gray-400
              `}
              placeholder="Search for educational videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors
                  ${showFilters 
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }
                `}
              >
                <Filter className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleSearch()}
                disabled={isLoading || !searchTerm.trim()}
                className="ml-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
          >
            <div className="max-w-7xl mx-auto p-6">
              <SearchFilters filters={filters} onChange={handleFiltersChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with suggestions and history */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="font-semibold mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Suggestions
                </h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(suggestion)}
                      className="w-full text-left p-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 
                        hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700
                        transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="font-semibold mb-3 flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {searchHistory.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(term)}
                      className="w-full text-left p-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 
                        hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700
                        transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* My Playlists Section */}
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className="font-semibold mb-3">My Playlists</h3>
            {playlists.length > 0 ? (
              <div className="flex justify-between">
                <button
                  onClick={() => {/* Logic to open modal with all videos */}}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All
                </button>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No playlists available.</p>
            )}
          </div>

          {/* Quick Stats */}
            {searchResults.length > 0 && (
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="font-semibold mb-3">Search Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Results</span>
                    <span className="font-medium">{searchResults.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Total duration</span>
                    <span className="font-medium">
                      {searchResults.reduce((total, video) => {
                        if (video.duration) {
                          const [min, sec] = video.duration.split(':').map(Number);
                          return total + (min * 60) + (sec || 0);
                        }
                        return total;
                      }, 0)} seconds
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Results Area */}
          <div className="lg:col-span-3">
            <SearchResultsGrid
              results={searchResults}
              isLoading={isLoading}
              onAddToPlaylist={handleAddToPlaylist}
              onWatchNow={handleWatchNow}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDashboard;
