"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AutoPlayVideoCard from "@/components/AutoPlayVideoCard";
import { YouTubeVideo } from "@/lib/youtube";

const AutoPlayClipsPage = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleVideoIndex, setVisibleVideoIndex] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const fetchVideos = async (pageToken?: string, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      
      setError(null);
      
      const params = new URLSearchParams({
        type: 'trending',
        maxResults: '10', // Load fewer videos at once for better performance
      });
      
      if (pageToken) {
        params.append('pageToken', pageToken);
      }

      const response = await fetch(`/api/videos?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      
      if (append) {
        setVideos(prev => [...prev, ...(data.items || [])]);
      } else {
        setVideos(data.items || []);
      }
      
      setNextPageToken(data.nextPageToken);
      setHasNextPage(!!data.nextPageToken);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreVideos = useCallback(() => {
    if (hasNextPage && !loadingMore && nextPageToken) {
      fetchVideos(nextPageToken, true);
    }
  }, [hasNextPage, loadingMore, nextPageToken]);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    // Set up intersection observer for auto-play
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          
          if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
            setVisibleVideoIndex(index);
          }
        });
      },
      {
        threshold: [0.7], // Video needs to be 70% visible to start playing
        rootMargin: '0px',
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Observe all video elements
    const currentRefs = videoRefs.current;
    if (observerRef.current) {
      currentRefs.forEach((ref) => {
        if (ref) {
          observerRef.current?.observe(ref);
        }
      });
    }

    return () => {
      if (observerRef.current) {
        currentRefs.forEach((ref) => {
          if (ref) {
            observerRef.current?.unobserve(ref);
          }
        });
      }
    };
  }, [videos]);

  useEffect(() => {
    // Load more videos when nearing the end
    if (videos.length > 0 && visibleVideoIndex >= videos.length - 3) {
      loadMoreVideos();
    }
  }, [visibleVideoIndex, videos.length, loadMoreVideos]);

  if (loading && videos.length === 0) {
    return (
      <div className="min-h-screen bg-white -mx-4 md:mx-0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-800">Loading clips...</p>
        </div>
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="min-h-screen bg-white -mx-4 md:mx-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchVideos()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white -mx-4 md:mx-0">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-gray-800 text-xl font-bold">Clips</h1>
          </div>
          
          <button
            onClick={() => {
              setVideos([]);
              setVisibleVideoIndex(0);
              setNextPageToken(undefined);
              fetchVideos();
            }}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title="Refresh"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Videos Container */}
      <div className="relative">
        {videos.map((video, index) => (
          <div
            key={`${video.id.videoId}-${index}`}
            ref={(el) => { videoRefs.current[index] = el; }}
            data-index={index}
            className="relative w-full h-screen snap-start"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-sm mx-auto relative">
                <AutoPlayVideoCard
                  video={video}
                  isVisible={visibleVideoIndex === index}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="h-screen flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-800 text-sm">Loading more clips...</p>
            </div>
          </div>
        )}

        {/* End of Content */}
        {!hasNextPage && videos.length > 0 && (
          <div className="h-screen flex items-center justify-center bg-white">
            <div className="text-center">
              <p className="text-gray-600 mb-4">That&apos;s all for now!</p>
              <button
                onClick={() => {
                  setVideos([]);
                  setVisibleVideoIndex(0);
                  setNextPageToken(undefined);
                  fetchVideos();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Video Counter */}
      <div className="fixed bottom-20 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 border border-gray-200 shadow-lg">
        <span className="text-gray-800 text-sm">
          {visibleVideoIndex + 1} / {videos.length}
        </span>
      </div>
    </div>
  );
};

export default AutoPlayClipsPage;
