# 🚀 Complete Setup Guide for WhatsApp To-Do AI

## Step 1: Get Your Supabase Credentials

### 1.1 Go to Your Supabase Dashboard
1. Visit https://supabase.com/dashboard
2. Select your project (or create a new one)

### 1.2 Get Your API Keys
1. In your Supabase project, click **"Settings"** (gear icon in sidebar)
2. Click **"API"** in the left menu
3. You'll see two sections:

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```
Copy this entire URL

**Project API keys:**
- **`anon` `public`** - Copy this (it's safe for client-side)
- **`service_role` `secret`** - Copy this (keep it secret!)

### 1.3 Update Your .env.local File

Open `/Users/samuelhoh/whatsapp-todo-ai/.env.local` and replace the placeholder values:

```bash
# Replace these lines:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-...
```

**Important:** After updating `.env.local`, restart your dev server:
- Press `Ctrl+C` in the terminal
- Run `npm run dev` again

---

## Step 2: Run SQL Queries in Supabase

### 2.1 Open SQL Editor
1. In your Supabase Dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"** button

### 2.2 Create Test User
Copy and paste this SQL, then click **"Run"**:

```sql
-- Create test user
INSERT INTO users (id, phone_number, name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '+1234567890',
  'Test User'
)
ON CONFLICT (id) DO NOTHING;
```

Click the **▶ Run** button (or press Cmd+Enter)

You should see: `Success. No rows returned`

---

## Step 3: Create Test Tasks

Copy and paste this SQL in a **new query**:

```sql
-- Add test tasks with different scenarios
INSERT INTO tasks (user_id, content, priority, status, category, is_flagged, due_date)
VALUES 
  -- Task due tomorrow (Shopping category)
  (
    '00000000-0000-0000-0000-000000000001', 
    'Buy groceries', 
    'medium', 
    'pending', 
    'Shopping', 
    false, 
    NOW() + INTERVAL '1 day'
  ),
  
  -- Task due today (Personal, FLAGGED)
  (
    '00000000-0000-0000-0000-000000000001', 
    'Call mom', 
    'high', 
    'pending', 
    'Personal', 
    true, 
    NOW()
  ),
  
  -- Task due in 2 days (No category, FLAGGED - needs categorization)
  (
    '00000000-0000-0000-0000-000000000001', 
    'Finish project report', 
    'high', 
    'pending', 
    NULL, 
    true, 
    NOW() + INTERVAL '2 days'
  ),
  
  -- Task due next week (Health category)
  (
    '00000000-0000-0000-0000-000000000001', 
    'Schedule dentist appointment', 
    'low', 
    'pending', 
    'Health', 
    false, 
    NOW() + INTERVAL '7 days'
  ),
  
  -- Completed task
  (
    '00000000-0000-0000-0000-000000000001', 
    'Submit timesheet', 
    'medium', 
    'completed', 
    'Work', 
    false, 
    NOW() - INTERVAL '1 day'
  );
```

Click **▶ Run**

You should see: `Success. No rows returned`

---

## Step 4: Verify It Worked

### Option A: Check in SQL Editor
Run this query:
```sql
SELECT * FROM tasks;
```

You should see 5 tasks!

### Option B: Check in Table Editor
1. Click **"Table Editor"** in sidebar
2. Click **"tasks"** table
3. You'll see all your tasks

---

## Step 5: Test Your App! 🎉

Now refresh your browser:

### Dashboard (http://localhost:3002/dashboard)
- Click "All" tab → See all 5 tasks
- Click "Today" tab → See the "Call mom" task
- Click "Upcoming" tab → See future tasks
- Click "Flagged" tab → See 2 flagged tasks

### Actions Page (http://localhost:3002/actions)
- You should see 2 flagged tasks
- Try clicking **"Categorise"** on "Finish project report"
  - AI will assign a category like "Work" or "Personal"
  - Task will disappear from this page (no longer flagged)

### Test Adding a New Task
1. Go to Dashboard
2. In the "Add New Task" form, type:
   ```
   Buy milk tomorrow afternoon
   ```
3. Click "Add Task"
4. AI will parse it and set the due date automatically!

---

## 🐛 Troubleshooting

### "Invalid supabaseUrl" Error
- Make sure you updated `.env.local` with REAL values
- Restart your dev server (Ctrl+C, then `npm run dev`)

### "Failed to fetch tasks" Error
Check if RLS (Row Level Security) is blocking you:
```sql
-- Temporarily disable RLS for development
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### Tasks Not Showing Up
Make sure the user_id in your tasks matches the test user:
```sql
SELECT id FROM users WHERE phone_number = '+1234567890';
-- Should return: 00000000-0000-0000-0000-000000000001
```

---

## 📝 Quick Reference

### Where to Find Things in Supabase:
- **SQL Editor**: Run SQL queries
- **Table Editor**: View/edit data visually
- **API Settings**: Get your keys (Settings → API)
- **Database**: See schema and tables

### Common SQL Commands:
```sql
-- View all tasks
SELECT * FROM tasks;

-- View all users
SELECT * FROM users;

-- Delete all test tasks
DELETE FROM tasks WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Reset everything
TRUNCATE tasks, users CASCADE;
```

---

## ✅ Checklist

- [ ] Updated `.env.local` with real Supabase credentials
- [ ] Restarted dev server
- [ ] Created test user in Supabase SQL Editor
- [ ] Created test tasks in Supabase SQL Editor
- [ ] Verified tasks appear in Supabase Table Editor
- [ ] Tested Dashboard page (http://localhost:3002/dashboard)
- [ ] Tested Actions page (http://localhost:3002/actions)
- [ ] Tested adding a new task from the UI

---

Need help? Check the errors in your terminal and browser console! 🔍

