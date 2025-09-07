## Documentation

### Contest Tracker Application

This is a NextJs stack application that tracks competitive programming contests from Codeforces, CodeChef, and LeetCode. The application allows users to view upcoming and past contests, filter contests by platform, bookmark contests, and view solution links for past contests.

#### Features

1. **Contest Tracking**

1. Fetches and displays upcoming contests from Codeforces, CodeChef, and LeetCode
2. Shows contest date, time, and duration
3. Displays time remaining before contest starts



2. **Filtering**

1. Filter contests by platform (Codeforces, CodeChef, LeetCode)
2. Toggle between upcoming and past contests
3. View bookmarked contests only



3. **Bookmarking**

1. Bookmark contests for easy access
2. Bookmarks are stored in localStorage



4. **Solution Links**

1. View YouTube solution links for past contests
2. Admin interface to add solution links manually
3. Automatic fetching of solution links from YouTube channels



5. **UI/UX**

1. Responsive design for mobile, tablet, and desktop
2. Light and dark mode with toggle
3. Clean and intuitive interface





#### Tech Stack

**Frontend:**

- React with TypeScript
- Next.js App Router
- Tailwind CSS for styling
- shadcn/ui components
- date-fns for date formatting
- Lucide React for icons


**Backend:**

-NextJs routes for backend


#### Project Structure

**Frontend:**

- `app/page.tsx` - Main page component
- `app/admin/page.tsx` - Admin interface for adding solution links
- `components/` - Reusable UI components
- `lib/api.ts` - API client for backend communication
- `types/contest.ts` - TypeScript types and interfaces


**Backend:**

- `bookmarks/route.ts` - Bookmarking Backend
- `contests/route.ts` - For fetching the contest from postgres database
- `contests/updates/route.ts` - For fetching the updates
- `solutions/route.ts` - For fething the solution youtube urls
