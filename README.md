# Auto Access
<img width="1058" height="676" alt="image" src="https://github.com/user-attachments/assets/8c1efabd-e267-44a8-8f0f-a5ac659b4f80" />

Automated system for granting access to private GitHub repositories and Docker Hub images with credential distribution via email.

## Overview

This application automates the process of granting access to private resources. When a user submits their GitHub username and email, the system:

1. Adds them as a collaborator to a private GitHub repository
2. Generates a Docker Hub access token
3. Sends credentials via email using Resend
4. Tracks all requests in a Supabase database

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI
- **Email**: Resend
- **Integrations**: GitHub API, Docker Hub API

## Features

- **Automated GitHub Access**: Automatically adds users as repository collaborators
- **Docker Token Generation**: Creates personalized Docker Hub access tokens
- **Email Notifications**: Sends formatted credentials via Resend
- **Request Tracking**: Dashboard to monitor all access requests
- **Status Management**: Tracks pending, approved, and failed requests
- **Real-time Updates**: Auto-refreshing dashboard

## Prerequisites

- Node.js 18+ 
- pnpm
- Supabase account
- GitHub Personal Access Token with repo permissions
- Docker Hub account with API access
- Resend API key

## Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub
GITHUB_TOKEN=your_github_token
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=your_repo_name

# Docker Hub
DOCKER_HUB_USERNAME=your_docker_username
DOCKER_HUB_TOKEN=your_docker_token
DOCKER_HUB_REPO=your_docker_image

# Resend
RESEND_API_KEY=your_resend_api_key
```

## Installation

```bash
# Install dependencies
pnpm install

# Run database migrations
# Execute scripts/001_create_access_requests.sql in Supabase SQL Editor

# Start development server
pnpm dev
```

## Database Setup

Run the SQL migration in Supabase:

```sql
CREATE TABLE IF NOT EXISTS public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  github_token TEXT,
  docker_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

## API Routes

### POST /api/access-request
Submit new access request

**Body:**
```json
{
  "github_username": "username",
  "email": "user@example.com"
}
```

### GET /api/access-request
Retrieve all access requests (for dashboard)

## Project Structure

```
├── app/
│   ├── api/access-request/route.ts  # API endpoints
│   ├── dashboard/page.tsx            # Admin dashboard
│   ├── page.tsx                      # Main landing page
│   └── layout.tsx                    # Root layout
├── components/
│   ├── access-request-form.tsx       # User request form
│   ├── requests-dashboard.tsx        # Admin dashboard component
│   └── ui/                           # UI components
├── lib/
│   ├── github.ts                     # GitHub API integration
│   ├── docker.ts                     # Docker Hub integration
│   ├── email.tsx                     # Email sending logic
│   └── supabase/                     # Supabase client
└── scripts/
    └── 001_create_access_requests.sql # Database schema
```

## Usage

### User Flow
1. Navigate to homepage
2. Enter GitHub username and email
3. Submit request
4. Receive email with credentials

### Admin Flow
1. Navigate to `/dashboard`
2. View all requests in real-time
3. Monitor status (pending/approved/failed)
4. Copy Docker tokens if needed

## Scripts

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start

# Lint
pnpm lint
```

## Security Notes

- All sensitive tokens are stored as environment variables
- Supabase RLS policies control data access
- Docker tokens are unique per user
- Credentials sent via secure email delivery

## License

Private project
