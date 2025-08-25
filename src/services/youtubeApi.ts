import axios from 'axios';
import { Video } from '../types';

// This is a placeholder for the API key. In a real app, use environment variables.
// You would need to create a project in Google Cloud Console and enable the YouTube Data API.
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

const youtube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    part: 'snippet,contentDetails',
    maxResults: 12,
    key: API_KEY,
  },
});

export const searchVideos = async (query: string, filters: any = {}): Promise<Video[]> => {
  try {
    const searchParams: any = {
      q: query,
      type: 'video',
      part: 'snippet',
    };

    // Add filter parameters if provided
    if (filters.duration && filters.duration !== 'any') {
      searchParams.videoDuration = filters.duration;
    }
    if (filters.sortBy && filters.sortBy !== 'relevance') {
      searchParams.order = filters.sortBy;
    }
    if (filters.videoDefinition && filters.videoDefinition !== 'any') {
      searchParams.videoDefinition = filters.videoDefinition;
    }
    if (filters.videoType && filters.videoType !== 'any') {
      searchParams.videoType = filters.videoType;
    }

    const response = await youtube.get('/search', {
      params: searchParams,
    });

    const videos = response.data.items.map((item: any) => {
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high.url,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
      };
    });

    // Get video durations in a separate request
    const videoIds = videos.map((video: Video) => video.id).join(',');
    const detailsResponse = await youtube.get('/videos', {
      params: {
        id: videoIds,
        part: 'contentDetails',
      },
    });

    // Add duration to each video object
    detailsResponse.data.items.forEach((item: any) => {
      const video = videos.find((v: Video) => v.id === item.id);
      if (video) {
        video.duration = formatDuration(item.contentDetails.duration);
      }
    });

    return videos;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
  }
};

export const getVideoDetails = async (videoId: string): Promise<Video | null> => {
  try {
    const response = await youtube.get('/videos', {
      params: {
        id: videoId,
        part: 'snippet,contentDetails',
      },
    });

    if (response.data.items.length === 0) {
      return null;
    }

    const item = response.data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      duration: formatDuration(item.contentDetails.duration),
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

export const getPlaylists = async (): Promise<any[]> => {
  try {
    const response = await youtube.get('/playlists', {
      params: {
        part: 'snippet,contentDetails',
        mine: true, // Assuming we want the user's playlists
      },
    });

    return response.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      videoCount: item.contentDetails.itemCount,
    }));
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
};

// Helper function to format ISO 8601 duration to readable format
const formatDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  
  if (match) {
    if (match[1]) hours = parseInt(match[1].slice(0, -1));
    if (match[2]) minutes = parseInt(match[2].slice(0, -1));
    if (match[3]) seconds = parseInt(match[3].slice(0, -1));
  }
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
