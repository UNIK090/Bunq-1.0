import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Clock, TrendingUp, History, Star, Play, Plus, Download, Mic, Sparkles, Grid3X3, List, Sliders } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { searchVideos } from '../../services/youtubeApi';
import { Video } from '../../types';
import SearchFilters from './SearchFilters';
import SearchResultsGrid from './SearchResultsGrid';
import VoiceSearch from './VoiceSearch';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAIPoweredSuggestions } from '../../services/aiService';

interface SearchFilterOptions {
  duration: string;
  uploadDate: string;
  sortBy: string;
  videoDefinition: string;
  videoType: string;
}

const EnhancedSearchDashboard: React.FC = () => {
  const { darkMode, addVideoToPlaylist, setCurrentVideo, playlists } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<SearchFilterOptions>({
    duration: 'any',
    uploadDate: 'any',
    sortBy: 'relevance',
    videoDefinition: 'any',
    videoType: 'any'
  });
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]); // New state for AI suggestions

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

  // Fetch AI-powered suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      const suggestions = await fetchAIPoweredSuggestions(); // Fetch AI suggestions
      setAiSuggestions(suggestions);
    };

    getSuggestions();
  }, [searchTerm]); // Fetch suggestions when search term changes

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

  const handleVoiceTranscript = (transcript: string) => {
    setSearchTerm(transcript);
    handleSearch(transcript);
    setShowVoiceSearch(false);
  };

  const handleVoiceError = (error: string) => {
    toast.error(error);
    setShowVoiceSearch(false);
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

  const popularSearches = [
    "React Tutorial",
    "TypeScript Basics",
    "CSS Grid Layout",
    "JavaScript ES6",
    "Python Programming",
    "Machine Learning",
    "Web Development",
    "UI/UX Design"
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header Section */}
      <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Advanced Video Search
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Discover educational content with AI-powered search and voice commands
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-32 py-4 rounded-xl text-lg
                ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                placeholder-gray-500 dark:placeholder-gray-400 shadow-lg
              `}
              placeholder="Search for educational videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
              <button
                onClick={() => setShowVoiceSearch(!showVoiceSearch)}
                className={`p-2 rounded-lg transition-all duration-200
                  ${showVoiceSearch 
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                title="Voice Search"
              >
                <Mic className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-all duration-200
                  ${showFilters 
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                title="Filters"
              >
                <Sliders className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleSearch()}
                disabled={isLoading || !searchTerm.trim()}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Voice Search Modal */}
          <AnimatePresence>
            {showVoiceSearch && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-50"
              >
                <div className={`p-6 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <VoiceSearch 
                    onTranscript={handleVoiceTranscript}
                    onError={handleVoiceError}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
        {/* View Mode Toggle */}
        {searchResults.length > 0 && (
          <div className="flex justify-end mb-6">
            <div className={`flex rounded-lg p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with suggestions and history */}
          <div className="lg:col-span-1 space-y-6">
            {/* Popular Searches */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className="font-semibold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                Popular Searches
              </h3>
              <div className="space-y-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(search)}
                    className="w-full text-left p-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 
                      hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400
                      transition-all duration-200 border border-gray-200 dark:border-gray-700"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className="font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  AI Suggestions
                </h3>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(suggestion)}
                      className="w-full text-left p-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 
                        hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400
                        transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className="font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  Related Suggestions
                </h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(suggestion)}
                      className="w-full text-left p-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 
                        hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400
                        transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className="font-semibold mb-4 flex items-center">
                  <History className="h-5 w-5 mr-2 text-blue-500" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {searchHistory.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(term)}
                      className="w-full text-left p-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 
                        hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400
                        transition-all duration-200"
                    >
                      {term}
                    </button>
                  ))}
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
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchDashboard;
