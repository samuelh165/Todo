# Testing the WhatsApp To-Do AI Dashboard

## 🚀 Your App is Running!
**URL**: http://localhost:3002

## ✅ Quick Setup Checklist

### 1. Verify Supabase Schema Updates
Run this SQL in your Supabase SQL Editor to confirm the new columns exist:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks';
```

You should see `category` and `is_flagged` in the results.

### 2. Create a Test User
The app currently uses hard-coded user ID: `00000000-0000-0000-0000-000000000001`

Run this in Supabase SQL Editor:

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

### 3. Add Some Test Tasks
```sql
-- Add test tasks with the new fields
INSERT INTO tasks (user_id, content, priority, status, category, is_flagged, due_date)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Buy groceries', 'medium', 'pending', 'Shopping', false, NOW() + INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000001', 'Call mom', 'high', 'pending', 'Personal', true, NOW()),
  ('00000000-0000-0000-0000-000000000001', 'Finish project report', 'high', 'pending', NULL, true, NOW() + INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000001', 'Schedule dentist appointment', 'low', 'pending', 'Health', false, NOW() + INTERVAL '7 days');
```

## 🧪 Test the Features

### Dashboard (http://localhost:3002/dashboard)
- ✅ View all tasks grouped by phone number
- ✅ Switch between tabs: All, Today, Upcoming, Flagged
- ✅ Add new task using the form (AI parsing enabled)
- ✅ Mark tasks complete/incomplete
- ✅ Edit task content inline
- ✅ Delete tasks
- ✅ Flag/unflag tasks

### Actions Page (http://localhost:3002/actions)
- ✅ View only flagged tasks (is_flagged = true)
- ✅ Click "Categorise" to auto-categorize with AI
- ✅ Click "Ignore" to unflag a task

## 🔑 Important Configuration

### Environment Variables Required
Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
```

## 🎨 Features to Test

1. **Add Task from Dashboard**
   - Type: "Buy milk tomorrow"
   - AI should parse it and set due date automatically

2. **Filter by Tabs**
   - "All" - shows all tasks
   - "Today" - shows tasks due today
   - "Upcoming" - shows future tasks
   - "Flagged" - shows flagged tasks

3. **Task Actions**
   - Click checkbox to complete
   - Click "..." menu for edit/flag/delete
   - Edit inline by clicking "Edit"

4. **Auto-Categorization**
   - Go to /actions
   - Click "Categorise" on a flagged task
   - AI will assign a category (Work, Personal, Shopping, etc.)

## 📱 WhatsApp Integration

When you send a message via WhatsApp:
1. Webhook receives it at `/api/webhook/whatsapp`
2. AI parses the message in `parseMessageToTask()`
3. Task is created with `is_flagged = false` by default
4. You can see it in the dashboard immediately

## 🐛 Troubleshooting

### No tasks showing up?
- Check browser console for errors
- Verify Supabase connection in Network tab
- Make sure RLS policies allow reads (or disable RLS for dev)

### Tasks not creating?
- Check API route: http://localhost:3002/api/tasks
- Verify OpenAI API key is set
- Check server console for errors

### Actions page empty?
- Make sure some tasks have `is_flagged = true`
- Run the test SQL above to create flagged tasks

## 🎯 Next Steps

1. Test all CRUD operations
2. Send WhatsApp messages to test webhook integration
3. Try AI categorization feature
4. Test filtering and grouping
5. Add more test users with different phone numbers

Enjoy testing! 🚀

