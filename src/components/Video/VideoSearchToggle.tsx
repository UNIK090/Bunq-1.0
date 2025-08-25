import React from 'react';
import { Search, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const VideoSearchToggle: React.FC = () => {
  const { isSearching, setIsSearching } = useAppStore();

  return (
    <button
      onClick={() => setIsSearching(!isSearching)}
      className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
    >
      {isSearching ? (
        <>
          <X className="h-5 w-5 mr-2" />
          Close Search
        </>
      ) : (
        <>
          <Search className="h-5 w-5 mr-2" />
          Search Videos
        </>
      )}
    </button>
  );
};

export default VideoSearchToggle;