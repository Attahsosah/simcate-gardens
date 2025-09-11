import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'default';
    const caption = searchParams.get('caption') || 'Image';

    // Create a simple SVG placeholder image
    const svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <text x="50%" y="45%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold">
          ${section.toUpperCase()}
        </text>
        <text x="50%" y="55%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" opacity="0.8">
          ${caption}
        </text>
        <text x="50%" y="75%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" opacity="0.6">
          Placeholder Image
        </text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating placeholder image:', error);
    return NextResponse.json(
      { error: 'Failed to generate placeholder image' },
      { status: 500 }
    );
  }
}

