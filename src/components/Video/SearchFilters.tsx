import React from 'react';

interface SearchFilterOptions {
  duration: string;
  uploadDate: string;
  sortBy: string;
  videoDefinition: string;
  videoType: string;
}

interface SearchFiltersProps {
  filters: SearchFilterOptions;
  onChange: (newFilters: SearchFilterOptions) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onChange }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
        <select
          id="duration"
          name="duration"
          value={filters.duration}
          onChange={handleFilterChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="any">Any</option>
          <option value="short">Short (less than 4 minutes)</option>
          <option value="medium">Medium (4-20 minutes)</option>
          <option value="long">Long (more than 20 minutes)</option>
        </select>
      </div>

      <div>
        <label htmlFor="uploadDate" className="block text-sm font-medium text-gray-700">Upload Date</label>
        <select
          id="uploadDate"
          name="uploadDate"
          value={filters.uploadDate}
          onChange={handleFilterChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="any">Any</option>
          <option value="hour">Last Hour</option>
          <option value="day">Last 24 Hours</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div>
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By</label>
        <select
          id="sortBy"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="relevance">Relevance</option>
          <option value="date">Upload Date</option>
          <option value="viewCount">View Count</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div>
        <label htmlFor="videoDefinition" className="block text-sm font-medium text-gray-700">Video Definition</label>
        <select
          id="videoDefinition"
          name="videoDefinition"
          value={filters.videoDefinition}
          onChange={handleFilterChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="any">Any</option>
          <option value="hd">HD</option>
          <option value="sd">SD</option>
        </select>
      </div>

      <div>
        <label htmlFor="videoType" className="block text-sm font-medium text-gray-700">Video Type</label>
        <select
          id="videoType"
          name="videoType"
          value={filters.videoType}
          onChange={handleFilterChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="any">Any</option>
          <option value="video">Video</option>
          <option value="live">Live</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
