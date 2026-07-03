// ============================================
// DATABASE SETUP SCRIPT
// Run this ONCE: node setup-db.mjs
// It will create the database, tables, and seed data
// ============================================

import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

// Validate
if (!DB_HOST || DB_HOST.includes('PASTE')) {
  console.error('\n❌ ERROR: You need to fill in your MySQL details in .env.local first!');
  console.error('   Open the file: .env.local');
  console.error('   Fill in DB_HOST, DB_USER, and DB_PASSWORD\n');
  process.exit(1);
}

console.log('🔌 Connecting to MySQL server...');
console.log(`   Host: ${DB_HOST}`);
console.log(`   User: ${DB_USER}`);
console.log(`   Database: ${DB_NAME}`);
console.log('');

async function setup() {
  // Step 1: Connect WITHOUT a database (to create it)
  let conn;
  try {
    conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: Number(DB_PORT) || 3306,
    });
    console.log('✅ Connected to MySQL server!');
  } catch (err) {
    console.error('❌ Failed to connect to MySQL. Check your credentials in .env.local');
    console.error('   Error:', err.message);
    process.exit(1);
  }

  // Step 2: Create database
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
    console.log(`✅ Database "${DB_NAME}" created (or already exists)`);
  } catch (err) {
    console.error('❌ Failed to create database:', err.message);
    process.exit(1);
  }

  // Step 3: Use the database
  await conn.query(`USE \`${DB_NAME}\``);

  // Step 4: Create tables
  console.log('📦 Creating tables...');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      color VARCHAR(20) DEFAULT '#6b7280',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✅ categories table created');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(255) NOT NULL UNIQUE,
      title VARCHAR(500) NOT NULL,
      excerpt TEXT,
      content LONGTEXT,
      image_url VARCHAR(500),
      category_id INT,
      author VARCHAR(200) DEFAULT 'Admin',
      status ENUM('Published', 'Draft') DEFAULT 'Draft',
      tags VARCHAR(500),
      featured BOOLEAN DEFAULT FALSE,
      views INT DEFAULT 0,
      read_time VARCHAR(20) DEFAULT '3 min',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);
  console.log('   ✅ articles table created');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS media (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      size VARCHAR(50),
      type VARCHAR(50) DEFAULT 'image',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('   ✅ media table created');

  await conn.query(`
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
  console.log('   ✅ reporters table created');

  // Step 5: Seed categories
  console.log('🌱 Seeding categories...');
  const cats = [
    ['National', 'national', '#e50914'],
    ['Crime', 'crime', '#7c3aed'],
    ['Sports', 'sports', '#10b981'],
    ['Education', 'education', '#3b82f6'],
    ['Political', 'political', '#f59e0b'],
    ['Religious', 'religious', '#ec4899'],
    ['Social', 'social', '#06b6d4'],
  ];

  for (const [name, slug, color] of cats) {
    await conn.query(
      'INSERT IGNORE INTO categories (name, slug, color) VALUES (?, ?, ?)',
      [name, slug, color]
    );
  }
  console.log('   ✅ 7 categories seeded');

  // Step 5b: Seed reporters
  console.log('🌱 Seeding reporters...');
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
    await conn.query(
      'INSERT IGNORE INTO reporters (name, email, role) VALUES (?, ?, ?)',
      [name, email, role]
    );
  }
  console.log('   ✅ 7 reporters seeded');

  // Step 6: Seed sample articles
  console.log('📝 Seeding sample articles...');
  const sampleArticles = [
    {
      slug: 'major-policy-shift-announced-by-government',
      title: 'Major Policy Shift Announced by Government Targets Economic Growth',
      excerpt: 'In a surprising move, the central administration has unveiled a comprehensive package designed to stimulate local manufacturing and tech sectors.',
      content: '<p>New Delhi: In a massive development that has sent ripples through the political landscape, the central government has announced a sweeping policy shift aimed at revitalizing economic growth across all sectors.</p><p>The package, estimated to be worth over ₹5 lakh crore, includes significant tax incentives for startups, reduced compliance burdens for small businesses, and a new digital infrastructure fund.</p>',
      category_id: 1, author: 'Rajesh Kumar', status: 'Published', tags: 'Economy,Government,Breaking', featured: true, views: 45200, read_time: '5 min',
    },
    {
      slug: 'local-team-secures-championship-victory',
      title: 'Local Team Secures Championship Victory in Final Minutes of Thrilling Match',
      excerpt: 'A last-minute goal sealed an unforgettable championship win for the home team in front of 60,000 fans.',
      content: '<p>In what is being called one of the greatest sporting moments in the city history, the local football club clinched the national championship title with a dramatic last-minute goal.</p>',
      category_id: 3, author: 'Amit Verma', status: 'Published', tags: 'Football,Championship,Sports', featured: true, views: 78500, read_time: '3 min',
    },
    {
      slug: 'authorities-crack-down-on-organized-syndicate',
      title: 'Local Authorities Crack Down on Organized Crime Syndicate in Multi-State Operation',
      excerpt: 'A coordinated police operation across five states resulted in the arrest of 23 suspects linked to a major criminal network.',
      content: '<p>In one of the largest law enforcement operations in recent memory, police across five states simultaneously raided over 40 locations linked to a sprawling organized crime syndicate.</p>',
      category_id: 2, author: 'Suresh Reddy', status: 'Published', tags: 'Crime,Police,Investigation', featured: false, views: 56300, read_time: '6 min',
    },
    {
      slug: 'new-education-policy-transforms-curriculum',
      title: 'New Education Policy Set to Transform National Curriculum from Next Academic Session',
      excerpt: 'The Ministry of Education announced sweeping changes that will replace the existing framework with a competency-based model.',
      content: '<p>The Ministry of Education has officially unveiled the implementation roadmap for the new National Education Policy, which promises to fundamentally reshape how millions of students learn.</p>',
      category_id: 4, author: 'Dr. Meera Joshi', status: 'Published', tags: 'Education,Policy,Curriculum', featured: false, views: 34700, read_time: '5 min',
    },
    {
      slug: 'opposition-leader-responds-to-economic-package',
      title: 'Opposition Leader Responds to New Economic Package with Sharp Criticism',
      excerpt: 'The Leader of Opposition called the economic package a publicity stunt and demanded a parliamentary debate.',
      content: '<p>Parliament was the scene of heated exchanges today as the Leader of Opposition responded sharply to the government newly announced economic package.</p>',
      category_id: 5, author: 'Priya Sharma', status: 'Published', tags: 'Opposition,Parliament,Economy', featured: false, views: 32100, read_time: '4 min',
    },
    {
      slug: 'temple-festival-draws-millions-of-devotees',
      title: 'Annual Temple Festival Draws Millions of Devotees from Across the Nation',
      excerpt: 'The week-long religious festival saw record attendance with elaborate rituals and cultural performances.',
      content: '<p>The ancient temple in the heart of the city witnessed an unprecedented gathering of devotees as the annual religious festival kicked off with grand celebrations.</p>',
      category_id: 6, author: 'Kavitha Nair', status: 'Published', tags: 'Festival,Religion,Culture', featured: false, views: 28900, read_time: '4 min',
    },
    {
      slug: 'community-initiative-bridges-digital-divide',
      title: 'Community Initiative Bridges Digital Divide with Free Internet and Training Centers',
      excerpt: 'A grassroots movement has established 200 digital literacy centers in underserved neighborhoods.',
      content: '<p>A remarkable grassroots initiative has successfully established over 200 digital literacy centers across underserved neighborhoods, providing free internet access and computer training.</p>',
      category_id: 7, author: 'Ananya Gupta', status: 'Published', tags: 'Community,Technology,Social', featured: false, views: 21400, read_time: '4 min',
    },
  ];

  for (const a of sampleArticles) {
    await conn.query(
      `INSERT IGNORE INTO articles (slug, title, excerpt, content, image_url, category_id, author, status, tags, featured, views, read_time) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [a.slug, a.title, a.excerpt, a.content, null, a.category_id, a.author, a.status, a.tags, a.featured, a.views, a.read_time]
    );
  }
  console.log('   ✅ 7 sample articles seeded');

  await conn.end();
  console.log('\n🎉 DATABASE SETUP COMPLETE!');
  console.log('   Your news portal database is ready to use.\n');
}

setup().catch(console.error);
