import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

export interface YouTubeResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
}

export class YouTubeService {
  static async searchVideos(
    query: string = 'trending',
    maxResults: number = 12,
    pageToken?: string
  ): Promise<YouTubeResponse> {
    try {
      const response = await axios.get(`${YOUTUBE_BASE_URL}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults,
          pageToken,
          key: YOUTUBE_API_KEY,
          order: 'relevance',
          safeSearch: 'moderate',
          videoDuration: 'short', // For clips/short videos
        },
      });

      return response.data;
    } catch (error) {
      console.error('YouTube API Error:', error);
      throw new Error('Failed to fetch videos');
    }
  }

  static async getTrendingVideos(
    maxResults: number = 12,
    pageToken?: string
  ): Promise<YouTubeResponse> {
    try {
      const response = await axios.get(`${YOUTUBE_BASE_URL}/videos`, {
        params: {
          part: 'snippet',
          chart: 'mostPopular',
          maxResults,
          pageToken,
          key: YOUTUBE_API_KEY,
          videoCategoryId: '24', // Entertainment category
          regionCode: 'US',
        },
      });

      // Transform the response to match search format
      const transformedItems = response.data.items.map((item: any) => ({
        id: { videoId: item.id },
        snippet: item.snippet,
      }));

      return {
        items: transformedItems,
        nextPageToken: response.data.nextPageToken,
      };
    } catch (error) {
      console.error('YouTube API Error:', error);
      throw new Error('Failed to fetch trending videos');
    }
  }

  static getVideoUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  static getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
