"use client";

import { useEffect, useRef, useState } from "react";
import { YouTubeVideo } from "@/lib/youtube";
import Image from "next/image";

interface AutoPlayVideoCardProps {
  video: YouTubeVideo;
  isVisible: boolean;
  onVideoEnd?: () => void;
}

const AutoPlayVideoCard = ({ video, isVisible, onVideoEnd }: AutoPlayVideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isVisible && !isPlaying) {
      // Start playing when visible
      setIsPlaying(true);
      setShowThumbnail(false);
    } else if (!isVisible && isPlaying) {
      // Stop playing when not visible
      setIsPlaying(false);
      setShowThumbnail(true);
    }
  }, [isVisible, isPlaying]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1d';
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)}mo`;
    return `${Math.ceil(diffDays / 365)}y`;
  };

  const truncateTitle = (title: string, maxLength: number = 80) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const embedUrl = `https://www.youtube.com/embed/${video.id.videoId}?autoplay=${isPlaying ? 1 : 0}&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${video.id.videoId}`;

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
      {/* Video Container */}
      <div className="relative aspect-[9/16] bg-gray-100">
        {showThumbnail && (
          <div className="absolute inset-0 z-10">
            <Image
              src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={video.snippet.title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ display: isPlaying ? 'block' : 'none' }}
        />
      </div>

      {/* Video Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 leading-tight">
              {truncateTitle(video.snippet.title)}
            </h3>
            <div className="flex items-center text-xs text-white/90 space-x-3">
              <span className="font-medium">{video.snippet.channelTitle}</span>
              <span>•</span>
              <span>{formatDate(video.snippet.publishedAt)}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-4 ml-4">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.774-.9L3 21l1.9-6.226A8.955 8.955 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z" />
              </svg>
            </button>
            
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoPlayVideoCard;
