"use client";

import { Suspense, useState, useEffect } from "react";
import VideoCard from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import { YouTubeVideo } from "@/lib/youtube";

const ClipsPage = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'search'>('trending');

  const fetchVideos = async (query?: string, type: 'trending' | 'search' = 'trending') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        type,
        maxResults: '12',
      });
      
      if (query) {
        params.append('q', query);
      }

      const response = await fetch(`/api/videos?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      setVideos(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(undefined, 'trending');
  }, []);

  const handleVideoClick = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('search');
      fetchVideos(searchQuery, 'search');
    }
  };

  const handleTrendingClick = () => {
    setActiveTab('trending');
    setSearchQuery('');
    fetchVideos(undefined, 'trending');
  };

  return (
    <div className="flex gap-6 pt-6">
      {/* LEFT */}
      <div className="hidden xl:block w-[20%]">
        {/* Left sidebar content can go here later */}
      </div>
      
      {/* CENTER */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Clips</h1>
            
            {/* Tabs */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={handleTrendingClick}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'trending'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🔥 Trending
              </button>
              <div className="flex-1">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search for videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>
            
            <p className="text-gray-600">
              {activeTab === 'trending' ? 'Discover trending videos' : `Search results for "${searchQuery}"`}
            </p>
          </div>
          
          {/* Videos Grid */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading clips...</p>
              </div>
            )}
            
            {error && (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => fetchVideos(searchQuery || undefined, activeTab)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {!loading && !error && videos.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No videos found</p>
              </div>
            )}
            
            {!loading && !error && videos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {videos.map((video, index) => (
                  <VideoCard
                    key={`${video.id.videoId}-${index}`}
                    video={video}
                    onClick={handleVideoClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* RIGHT */}
      <div className="hidden lg:block w-[30%]">
        {/* Right sidebar content can go here later */}
      </div>
      
      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ClipsPage;
