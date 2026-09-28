'use client';

import AdCarousel from './AdCarousel';

export default function ArticleContentWithAd({ 
  content, 
  midAds 
}: { 
  content: string; 
  midAds: any[];
}) {
  // Split the HTML content roughly in the middle by paragraph tags
  const paragraphs = content.split(/(<\/p>)/i);
  
  if (paragraphs.length < 4 || midAds.length === 0) {
    // If content is too short or no mid ads, just render everything together
    return (
      <div className="article-body" style={{ lineHeight: '1.8', color: '#374151' }} dangerouslySetInnerHTML={{ __html: content }} />
    );
  }

  // Reconstruct paragraphs (each pair of split = content + closing tag)
  const reconstructed: string[] = [];
  for (let i = 0; i < paragraphs.length; i += 2) {
    if (i + 1 < paragraphs.length) {
      reconstructed.push(paragraphs[i] + paragraphs[i + 1]);
    } else {
      reconstructed.push(paragraphs[i]);
    }
  }

  // Find the midpoint
  const midIndex = Math.floor(reconstructed.length / 2);
  const firstHalf = reconstructed.slice(0, midIndex).join('');
  const secondHalf = reconstructed.slice(midIndex).join('');

  return (
    <>
      {/* First half of article */}
      <div className="article-body" style={{ lineHeight: '1.8', color: '#374151' }} dangerouslySetInnerHTML={{ __html: firstHalf }} />
      
      {/* Mid-article advertisement */}
      <AdCarousel ads={midAds} />
      
      {/* Second half of article */}
      <div className="article-body" style={{ lineHeight: '1.8', color: '#374151' }} dangerouslySetInnerHTML={{ __html: secondHalf }} />
    </>
  );
}
