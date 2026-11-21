'use client';

import { useEffect, useRef } from 'react';

export default function ArticleView({ slug }: { slug: string }) {
  const recordedSlug = useRef<string | null>(null);

  useEffect(() => {
    if (recordedSlug.current === slug) return;
    recordedSlug.current = slug;

    // Count readers independently of the article's cached server render.
    fetch(`/api/articles/${encodeURIComponent(slug)}/view`, {
      method: 'POST',
      cache: 'no-store',
      keepalive: true,
    }).catch(() => {
      // View tracking is best effort and must not interrupt reading.
    });
  }, [slug]);

  return null;
}
