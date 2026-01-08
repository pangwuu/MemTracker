# MemTracker

[MemTracker](https://memories-ruby-nine.vercel.app/) is a personal memory tracking application that allows you to document and cherish your life's moments. Built with React and Supabase, it provides a beautiful interface to store memories with photos, detailed descriptions, dates, and precise locations.

## Features

- **Create Memories:** Add memories with custom titles, descriptions, dates, and locations.
- **Location Integration:** Pinpoint exactly where a memory happened using OpenStreetMap integration. Features location autocomplete and interactive maps.
- **Image Gallery:** Upload multiple photos for each memory and view them in a responsive gallery, on desktop or mobile.
- **Interactive Map View:** See all your memories plotted on a global map.
- **Sort & Filter:** Easily find memories in the grid view with search functionality and sorting options (by Date, Name, or Location).
- **User Accounts:** Secure authentication via Supabase (Email/Password & Magic Link) and profile management (Bio, Password updates).
- **themes Dark/Light Mode:** Fully supported dark and light themes that automatically adjust to your preference or can be toggled manually.

## Tech Stack

- **Frontend:** [React](https://reactjs.org/) (bootstrapped with [Vite](https://vitejs.dev/))
- **UI Framework:** [Material UI (MUI)](https://mui.com/)
- **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **Maps:** [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **Routing:** [React Router](https://reactrouter.com/)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (Node Package Manager)

You will also need a [Supabase](https://supabase.com/) project set up with:
1. **Authentication** enabled.
2. A **Database** table for `memories` and `profiles`.
3. A **Storage** bucket named `memory-images`.

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root of the `client` directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJ_URL=your_supabase_project_url
   VITE_SUPABASE_API_KEY=your_supabase_anon_key
   ```

4. **Run Locally**
   Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or the port shown in your terminal).