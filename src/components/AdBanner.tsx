import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import AdCarousel from './AdCarousel';

export default async function AdBanner({ position }: { position?: string }) {
  try {
    let query: string;
    let params: any[] = [];

    if (position) {
      query = 'SELECT * FROM advertisements WHERE FIND_IN_SET(?, position) > 0 AND active = 1 AND (expires_at IS NULL OR expires_at > NOW()) AND (starts_at IS NULL OR starts_at <= NOW()) ORDER BY id DESC';
      params = [position];
    } else {
      query = 'SELECT * FROM advertisements WHERE active = 1 AND (expires_at IS NULL OR expires_at > NOW()) AND (starts_at IS NULL OR starts_at <= NOW()) ORDER BY id DESC';
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    return <AdCarousel ads={rows} />;
  } catch (error) {
    console.error('Failed to load ad banner:', error);
    // Silent fail so we don't break the page
    return null;
  }
}
