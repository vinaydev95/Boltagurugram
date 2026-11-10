import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import AdCarousel from './AdCarousel';

export default async function AdBanner({ 
  position, 
  articleDate 
}: { 
  position?: string; 
  articleDate?: Date | string | null;
}) {
  try {
    let query: string;
    let params: any[] = [];

    const dateCondition = articleDate ? 'AND COALESCE(starts_at, created_at) <= ?' : '';

    if (position) {
      query = `SELECT * FROM advertisements 
               WHERE (FIND_IN_SET(?, position) > 0 OR position IS NULL OR position = '') 
                 AND active = 1 
                 AND (expires_at IS NULL OR expires_at > NOW()) 
                 AND (starts_at IS NULL OR starts_at <= NOW()) 
                 ${dateCondition} 
               ORDER BY id DESC`;
      params = [position];
      if (articleDate) {
        params.push(articleDate instanceof Date ? articleDate : new Date(articleDate));
      }
    } else {
      query = `SELECT * FROM advertisements 
               WHERE active = 1 
                 AND (expires_at IS NULL OR expires_at > NOW()) 
                 AND (starts_at IS NULL OR starts_at <= NOW()) 
                 ${dateCondition} 
               ORDER BY id DESC`;
      if (articleDate) {
        params.push(articleDate instanceof Date ? articleDate : new Date(articleDate));
      }
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    return <AdCarousel ads={rows} />;
  } catch (error) {
    console.error('Failed to load ad banner:', error);
    // Silent fail so we don't break the page
    return null;
  }
}
