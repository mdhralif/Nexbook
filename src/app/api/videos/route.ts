import { NextRequest, NextResponse } from 'next/server';
import { YouTubeService } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'trending';
    const maxResults = parseInt(searchParams.get('maxResults') || '12');
    const pageToken = searchParams.get('pageToken') || undefined;
    const type = searchParams.get('type') || 'search';

    let videos;
    
    if (type === 'trending') {
      videos = await YouTubeService.getTrendingVideos(maxResults, pageToken);
    } else {
      videos = await YouTubeService.searchVideos(query, maxResults, pageToken);
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
