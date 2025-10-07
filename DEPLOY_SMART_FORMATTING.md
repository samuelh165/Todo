# Deploy Smart Formatting Feature

Quick guide to deploy the new AI-powered smart formatting feature.

## Prerequisites

- ✅ Supabase project set up
- ✅ OpenAI API key configured
- ✅ Vercel deployment (or local development)

## Step 1: Update Database Schema

Run the migration in your Supabase SQL Editor:

```bash
# Open Supabase Dashboard → SQL Editor → New Query
# Copy and paste the contents of add-title-summary-migration.sql
```

Or run directly:

```sql
-- Add new columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS summary TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks(title);
```

**Verify the migration:**
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;
```

You should see `title` and `summary` columns.

## Step 2: Deploy Code Changes

### For Vercel Deployment:

```bash
# Push to your git repository
git add .
git commit -m "Add smart AI formatting feature with titles and summaries"
git push origin main

# Vercel will automatically deploy
```

### For Local Development:

```bash
# Install dependencies (if needed)
npm install

# Run the development server
npm run dev
```

## Step 3: Test the Feature

### Test in Web App:

1. Navigate to `/dashboard`
2. Add a task like: `"I need to review the Q4 financial report and send feedback to the team by Friday"`
3. You should see:
   - **Title**: "Review Q4 Financial Report"
   - **Summary**: Brief description
   - **Category**: "work"
   - **Due Date**: Friday
   - **Priority**: Appropriate level

### Test via WhatsApp:

1. Send a message to your WhatsApp bot: `"Buy groceries tomorrow - milk, eggs, bread from Whole Foods"`
2. You should receive a formatted confirmation:
```
✅ Task added!

📌 *Buy Groceries*
milk, eggs, bread from Whole Foods
🏷️ shopping
📅 Due: Wed, Oct 8
```

## Step 4: Verify Everything Works

### Check Database:

```sql
-- View recent tasks with new fields
SELECT 
  id, 
  title, 
  summary, 
  content, 
  category, 
  priority, 
  due_date
FROM tasks 
ORDER BY created_at DESC 
LIMIT 5;
```

### Check Logs:

```bash
# For Vercel
vercel logs

# For local
# Check terminal output for any errors
```

## Common Issues

### Issue: Columns not showing in database

**Solution:**
```sql
-- Check if columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'tasks';

-- If not, manually add them
ALTER TABLE tasks ADD COLUMN title TEXT;
ALTER TABLE tasks ADD COLUMN summary TEXT;
```

### Issue: Old tasks showing without titles

**Expected behavior:** Old tasks won't have titles until they're edited. This is normal.

**Optional:** Batch update old tasks:
```sql
-- Generate simple titles for existing tasks (optional)
UPDATE tasks 
SET title = 
  CASE 
    WHEN LENGTH(content) <= 50 THEN content
    ELSE SUBSTRING(content FROM 1 FOR 47) || '...'
  END
WHERE title IS NULL AND content IS NOT NULL;
```

### Issue: TypeScript errors

**Solution:**
```bash
# Regenerate Supabase types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts

# Or manually ensure database.ts is up to date
```

### Issue: AI not generating titles

**Check:**
1. OpenAI API key is set: `process.env.OPENAI_API_KEY`
2. Check Vercel environment variables
3. Review function logs for errors

## Rollback (if needed)

If something goes wrong and you need to rollback:

### Database Rollback:
```sql
-- Remove columns (WARNING: This deletes data!)
ALTER TABLE tasks DROP COLUMN IF EXISTS title;
ALTER TABLE tasks DROP COLUMN IF EXISTS summary;
```

### Code Rollback:
```bash
git revert HEAD
git push origin main
```

## Performance Notes

- **AI Processing Time**: 1-2 seconds per task
- **No UI Blocking**: Processing happens in background
- **Fallback**: If AI fails, uses original message
- **Cost**: ~$0.0001 per task (GPT-4o-mini pricing)

## Monitoring

Monitor AI performance:

```typescript
// Check confidence scores in logs
console.log('Task parsed with confidence:', parsedTask.confidence);

// Low confidence might indicate need for prompt improvement
if (parsedTask.confidence < 0.7) {
  console.warn('Low confidence parse:', message);
}
```

## Next Steps

After successful deployment:

1. ✅ Test with various task formats
2. ✅ Monitor OpenAI API usage and costs
3. ✅ Gather user feedback on categorization accuracy
4. ✅ Consider customizing categories for your needs
5. ✅ Update user documentation/help text

## Support

If you encounter issues:

1. Check server logs
2. Verify environment variables
3. Test API endpoints directly
4. Check Supabase database connection
5. Review OpenAI API status

---

**Deployment Date:** October 7, 2025  
**Feature Version:** 1.0.0

