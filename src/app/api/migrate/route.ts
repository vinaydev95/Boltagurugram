import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // 1. Add image_url column if it doesn't exist
    try {
      await pool.query('ALTER TABLE articles ADD COLUMN image_url VARCHAR(500) NULL AFTER content');
    } catch (err: any) {
      if (err.code !== 'ER_DUP_FIELDNAME') {
        throw err;
      }
    }

    // Add meta_title column if it doesn't exist
    try {
      await pool.query('ALTER TABLE articles ADD COLUMN meta_title VARCHAR(255) NULL AFTER image_url');
    } catch (err: any) {
      if (err.code !== 'ER_DUP_FIELDNAME') {
        throw err;
      }
    }

    // Add meta_description column if it doesn't exist
    try {
      await pool.query('ALTER TABLE articles ADD COLUMN meta_description VARCHAR(500) NULL AFTER meta_title');
    } catch (err: any) {
      if (err.code !== 'ER_DUP_FIELDNAME') {
        throw err;
      }
    }

    // 2. Create reporters table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reporters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL UNIQUE,
        email VARCHAR(200) NOT NULL UNIQUE,
        password VARCHAR(255) DEFAULT 'Reporter@2026',
        role VARCHAR(100) DEFAULT 'Reporter',
        avatar_url VARCHAR(500) NULL,
        bio TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Add password column to reporters if it doesn't exist
    try {
      await pool.query("ALTER TABLE reporters ADD COLUMN password VARCHAR(255) DEFAULT 'Reporter@2026' AFTER email");
    } catch (err: any) {
      if (err.code !== 'ER_DUP_FIELDNAME') {
        throw err;
      }
    }

    // 4. Seed reporters if empty
    const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM reporters');
    if (rows[0].count === 0) {
      const initialReporters = [
        ['Rajesh Kumar', 'rajesh@newsportal.com', 'Senior Correspondent'],
        ['Amit Verma', 'amit@newsportal.com', 'Sports Reporter'],
        ['Suresh Reddy', 'suresh@newsportal.com', 'Crime Reporter'],
        ['Dr. Meera Joshi', 'meera@newsportal.com', 'Education Editor'],
        ['Priya Sharma', 'priya@newsportal.com', 'Political Correspondent'],
        ['Kavitha Nair', 'kavitha@newsportal.com', 'Cultural Reporter'],
        ['Ananya Gupta', 'ananya@newsportal.com', 'Community Journalist']
      ];

      for (const [name, email, role] of initialReporters) {
        await pool.query(
          'INSERT IGNORE INTO reporters (name, email, role) VALUES (?, ?, ?)',
          [name, email, role]
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Database migrated and reporters seeded successfully' });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
