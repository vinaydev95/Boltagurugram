import { MetadataRoute } from 'next';
import { getAllArticleSlugsForSitemapDB, getCategoriesDB } from '@/lib/db-queries';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://boltagurugram.com';

  const [articles, categories] = await Promise.all([
    getAllArticleSlugsForSitemapDB(),
    getCategoriesDB(),
  ]);

  const articleEntries: MetadataRoute.Sitemap = (articles || []).map((art: any) => ({
    url: `${baseUrl}/article/${art.slug}`,
    lastModified: art.updated_at ? new Date(art.updated_at) : new Date(art.created_at || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = (categories || []).map((cat: any) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  return [...staticEntries, ...categoryEntries, ...articleEntries];
}
