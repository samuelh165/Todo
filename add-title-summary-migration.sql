-- Migration: Add title and summary fields to tasks table
-- Run this in your Supabase SQL Editor to update the existing database

-- Add title column
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS title TEXT;

-- Add summary column
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS summary TEXT;

-- Optional: Add index on title for better search performance
CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks(title);

-- Update existing tasks to generate titles from content (optional)
-- This is a simple example - you may want to manually review and update important tasks
UPDATE tasks 
SET title = 
  CASE 
    WHEN LENGTH(content) <= 50 THEN content
    ELSE SUBSTRING(content FROM 1 FOR 47) || '...'
  END
WHERE title IS NULL AND content IS NOT NULL;

-- Verification: Check the structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

