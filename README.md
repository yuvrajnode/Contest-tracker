# 🏆 Contest Tracker Application

This is a Next.js web application designed to help competitive programmers track contests from various platforms. It provides a centralized view of upcoming and past contests from Codeforces, CodeChef, and LeetCode, along with features for filtering, bookmarking, and accessing solution links.

## ✨ Features

### 1. Comprehensive Contest Tracking
- Fetches and displays upcoming contests from popular competitive programming platforms: Codeforces, CodeChef, and LeetCode.
- Provides essential contest details including date, time, and duration.
- Shows a real-time countdown for upcoming contests.

### 2. Advanced Filtering Options
- **Platform Filter**: Easily filter contests by specific platforms (Codeforces, CodeChef, LeetCode).
- **Status Toggle**: Switch between viewing upcoming and past contests.
- **Bookmarks**: View only your bookmarked contests for quick access.

### 3. Personalized Bookmarking
- Allows users to bookmark contests for easy retrieval.
- Bookmarks are persistently stored using `localStorage` for a seamless user experience.

### 4. Solution Access
- Provides direct links to YouTube solutions for past contests.
- Includes an admin interface for manual addition of solution links.
- Features automatic fetching of solution links from designated YouTube channels.

### 5. Intuitive UI/UX
- **Responsive Design**: Optimized for a consistent experience across mobile, tablet, and desktop devices.
- **Theme Toggle**: Supports both light and dark modes.
- **Clean Interface**: Designed for ease of use and efficient navigation.

## 🛠️ Tech Stack

The application is built using a modern and efficient technology stack:

| Category   | Technologies                                    | Description                                          |
| :--------- | :---------------------------------------------- | :--------------------------------------------------- |
| **Frontend** | React, TypeScript, Next.js App Router, Tailwind CSS | Dynamic UI, type safety, efficient routing, and styling |
| **UI Components** | shadcn/ui, Lucide React                       | Reusable and accessible UI components, rich icon set |
| **Date Handling** | date-fns                                        | Robust utility library for date formatting and manipulation |
| **Backend**  | Next.js API Routes                              | Server-side logic for data fetching and API endpoints |
| **Database** | PostgreSQL (via Next.js routes)                 | Relational database for storing contest and solution data |

## 📂 Project Structure

The project is organized into logical modules for maintainability and scalability:

### Frontend
- `app/page.tsx`: The main application dashboard.
- `app/admin/page.tsx`: Administrative interface for managing solution links.
- `components/`: Directory for all reusable UI components.
- `lib/api.ts`: API client for interacting with backend services.
- `types/contest.ts`: TypeScript definitions for contest data structures.

### Backend (Next.js API Routes)
- `bookmarks/route.ts`: API endpoint for managing user bookmarks.
- `contests/route.ts`: API endpoint for fetching contest data from the PostgreSQL database.
- `contests/updates/route.ts`: API endpoint for fetching real-time contest updates.
- `solutions/route.ts`: API endpoint for retrieving YouTube solution URLs.

## 🚀 Getting Started

To set up and run the Contest Tracker application locally, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/yuvrajnode/Contest-tracker.git
cd Contest-tracker

# 2. Install dependencies
npm install
# or using yarn
yarn install

# 3. Set up environment variables
# Create a .env.local file based on .env.example (if provided) and configure your database connection and API keys.

# 4. Run database migrations (if applicable)
# npx prisma migrate dev --name init (example for Prisma)

# 5. Start the development server
npm run dev
# or using yarn
yarn dev
```

Open `http://localhost:3000` in your browser to view the application.
