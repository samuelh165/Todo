# Supabase Setup Guide

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your_openai_api_key
```

## Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to Settings > API
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## Database Schema

Your project is already configured with the following tables:

### Users Table
- `id` (uuid, primary key)
- `phone_number` (text, unique)
- `name` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Tasks Table
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to users)
- `content` (text)
- `due_date` (timestamp, nullable)
- `priority` (enum: low, medium, high)
- `status` (enum: pending, completed, cancelled)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Topics Table
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to users)
- `name` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Next Steps

1. Create your `.env.local` file with the credentials above
2. Run the SQL commands in your Supabase SQL editor to create the tables
3. Test the connection using the test script
