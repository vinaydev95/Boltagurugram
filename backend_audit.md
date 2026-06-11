# News Portal — Backend Audit Report

## Current Status Summary

### ✅ COMPLETED
| Feature | Status | Details |
|---|---|---|
| Database (MySQL RDS) | ✅ Done | 3 tables created: `categories`, `articles`, `media` |
| DB Connection Pool | ✅ Done | `src/lib/db.ts` — mysql2 connection pool configured |
| Seed Data | ✅ Done | 7 categories + 7 articles seeded via phpMyAdmin |
| Auth — Sign In Page | ✅ Done | `/signin` — premium styled login page |
| Auth — Login API | ✅ Done | `/api/auth/login` — validates against env credentials |
| Auth — Logout API | ✅ Done | `/api/auth/logout` — clears cookie |
| Auth — Check API | ✅ Done | `/api/auth/check` — verifies auth cookie |
| Auth — Context | ✅ Done | `AuthContext.tsx` — global auth state management |
| Auth — Header Toggle | ✅ Done | Sign In ↔ Dashboard+Logout based on auth |
| Auth — Dashboard Guard | ✅ Done | Redirects to `/signin` if not logged in |
| Frontend Pages | ✅ Done | Homepage, Article detail, Category pages |
| Dashboard UI | ✅ Done | Overview, Articles list, Categories, Media library |

---

### ❌ NOT DONE — Backend API Routes Missing

> [!IMPORTANT]
> The entire dashboard currently runs on **hardcoded dummy data** (`src/lib/data.ts`). 
> There are **ZERO API routes** for CRUD operations. Nothing actually talks to the MySQL database.

| Missing API Route | Purpose | Priority |
|---|---|---|
| `GET /api/articles` | Fetch all articles from DB | 🔴 High |
| `GET /api/articles/[slug]` | Fetch single article | 🔴 High |
| `POST /api/articles` | Create new article in DB | 🔴 High |
| `PUT /api/articles/[id]` | Update article in DB | 🔴 High |
| `DELETE /api/articles/[id]` | Delete article from DB | 🔴 High |
| `GET /api/categories` | Fetch all categories from DB | 🔴 High |
| `POST /api/categories` | Create category in DB | 🟡 Medium |
| `PUT /api/categories/[id]` | Update category | 🟡 Medium |
| `DELETE /api/categories/[id]` | Delete category | 🟡 Medium |
| `GET /api/media` | Fetch media files from DB | 🟡 Medium |
| `POST /api/media/upload` | Upload to S3 + save to DB | 🟡 Medium |
| `DELETE /api/media/[id]` | Delete from S3 + DB | 🟡 Medium |
| `GET /api/dashboard/stats` | Dashboard stats from DB | 🟢 Low |

### ❌ NOT DONE — Frontend ↔ Database Integration

| Page | Current State | What's Needed |
|---|---|---|
| Homepage (`page.tsx`) | Uses `data.ts` hardcoded data | Fetch from `/api/articles` |
| Article detail page | Uses `getArticleBySlug()` from `data.ts` | Fetch from `/api/articles/[slug]` |
| Category page | Uses `getArticlesByCategory()` from `data.ts` | Fetch from `/api/articles?category=X` |
| Dashboard Overview | Uses hardcoded `data.ts` | Fetch from `/api/dashboard/stats` |
| Dashboard Articles | Uses hardcoded `data.ts` | Fetch from `/api/articles` + CRUD |
| Dashboard Categories | Uses hardcoded `data.ts`, client-only state | Fetch from `/api/categories` + CRUD |
| Dashboard Media | Uses hardcoded `data.ts`, client-only state | Fetch from `/api/media` + upload to S3 |
| Article Create form | UI exists but doesn't save | POST to `/api/articles` |

### ❌ NOT DONE — Other Missing Features

| Feature | Details |
|---|---|
| S3 Image Upload | S3 config exists in `.env.local` but no upload code |
| Article Image/Thumbnail | No image field in articles table or upload flow |
| Article Edit Page | No `/dashboard/articles/edit/[id]` page |
| Search Functionality | Search input exists but doesn't work |
| Pagination | No pagination on any page |
| Breaking News from DB | Ticker is hardcoded in Header |
| SEO Meta Tags | Only basic meta in layout, no per-page SEO |
| Middleware Auth Guard | Dashboard uses client-side guard only |

---

## Summary

**Backend completion: ~20%**

- ✅ Database structure is ready
- ✅ Authentication is fully working
- ❌ **13 API routes** need to be built
- ❌ **All pages** need to switch from dummy data to real API calls
- ❌ S3 media upload needs implementation
