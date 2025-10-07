# Smart AI Formatting Feature 🤖

This guide explains the new intelligent task formatting powered by ChatGPT that automatically enhances every task you create.

## Overview

When you add a task (via web or WhatsApp), the AI automatically:
- ✨ **Generates a concise, action-oriented title**
- 📝 **Creates a summary** (for longer or complex messages)
- 🏷️ **Categorizes the task** intelligently
- 📅 **Extracts due dates** from natural language
- ⚡ **Determines priority** based on urgency keywords

## How It Works

### 1. Title Generation
The AI creates clear, action-oriented titles following best practices:

**Examples:**
- Input: `"I need to review the Q4 financial report and send feedback to the team by Friday"`
- Title: **"Review Q4 Financial Report"**

- Input: `"Call mom about weekend plans"`
- Title: **"Call Mom about Weekend Plans"**

**Title Rules:**
- Uses imperative verbs (Review, Call, Buy, Complete, etc.)
- Concise (3-8 words)
- Captures the essence of the task
- Specific and clear

### 2. Smart Summarization
For longer messages (>100 characters) or complex tasks, the AI creates a brief summary:

**Example:**
- Input: `"I need to prepare a presentation for the board meeting next Tuesday. Should include Q3 results, Q4 projections, and the new marketing strategy. Make sure to get input from Sarah and John before finalizing."`
- Title: **"Prepare Board Meeting Presentation"**
- Summary: **"Include Q3 results, Q4 projections, and new marketing strategy. Get input from Sarah and John."**
- Content: *[Full original message preserved]*

### 3. Intelligent Categorization
The AI automatically categorizes tasks into relevant buckets:

**Common Categories:**
- 🏢 **work** - Professional tasks, meetings, reports
- 👤 **personal** - Personal errands, family matters
- 🛒 **shopping** - Groceries, purchases
- 💪 **health** / **fitness** - Exercise, doctor appointments
- 💰 **finance** - Bills, banking, investments
- 🏠 **home** - Household chores, maintenance
- 📚 **education** - Learning, courses, studying
- 👥 **social** - Social events, gatherings

**Examples:**
- "Buy groceries tomorrow" → **shopping**
- "Submit quarterly report" → **work**
- "Gym at 6pm" → **fitness**
- "Pay electricity bill" → **finance**

### 4. Date Extraction
Converts natural language dates to structured format:

**Supported Formats:**
- Relative: "tomorrow", "next week", "in 3 days"
- Specific: "December 25", "Jan 15", "Friday"
- Time references: "this weekend", "next month"

**Examples:**
- "Call dentist tomorrow" → Due: October 8, 2025
- "Submit report next Friday" → Due: October 11, 2025
- "Birthday party on Dec 25" → Due: December 25, 2025

### 5. Priority Detection
Automatically determines urgency based on keywords:

**High Priority** (🔴):
- Keywords: "ASAP", "urgent", "immediately", "critical", "emergency"
- Example: "Fix production bug ASAP"

**Medium Priority** (🟡):
- Default for most tasks
- Example: "Review pull request"

**Low Priority** (🟢):
- Keywords: "eventually", "someday", "when you can", "sometime"
- Example: "Organize photo albums someday"

## User Interface

### Web App Display

Tasks are displayed with beautiful, hierarchical formatting:

```
┌─────────────────────────────────────────┐
│ ☐ Review Q4 Financial Report           │ ← Title (bold)
│   Include analysis and recommendations   │ ← Summary
│   📂 work  📅 Today  🔴 high            │ ← Badges
│   ▸ View original message               │ ← Expandable
└─────────────────────────────────────────┘
```

**Key Features:**
- **Title** shown prominently in bold
- **Summary** displayed in muted text
- **Original message** hidden but accessible via expand
- **Badges** for category, due date, priority
- Clean, modern design with proper spacing

### WhatsApp Display

Tasks confirmations show smart formatting:

```
✅ Task added!

📌 *Review Q4 Financial Report*
Include analysis and recommendations
🏷️ work
📅 Due: Fri, Oct 11
🔴 Priority: high
```

## Database Schema

### New Fields Added

```sql
tasks:
  - title TEXT           -- AI-generated concise title
  - content TEXT         -- Original full message (preserved)
  - summary TEXT         -- Brief summary for long messages
  - category TEXT        -- AI-determined category
  - due_date TIMESTAMP   -- Extracted due date
  - priority TEXT        -- high/medium/low
```

### Migration

To add these fields to your existing database, run:

```sql
-- See add-title-summary-migration.sql
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS summary TEXT;
```

## API Integration

### Creating Tasks

**Endpoint:** `POST /api/tasks`

**Request:**
```json
{
  "content": "Review the Q4 financial report and send feedback by Friday",
  "user_id": "user-uuid"
}
```

**Response:**
```json
{
  "task": {
    "id": "task-uuid",
    "title": "Review Q4 Financial Report",
    "content": "Review the Q4 financial report and send feedback by Friday",
    "summary": null,
    "category": "work",
    "due_date": "2025-10-11T00:00:00Z",
    "priority": "medium",
    "status": "pending"
  }
}
```

### Behind the Scenes

The AI processing happens automatically via `parseMessageToTask()`:

```typescript
const parsedTask = await parseMessageToTask(message)
// Returns: {
//   title: "Review Q4 Financial Report",
//   content: "Review the Q4 financial report and send feedback by Friday",
//   summary: null,
//   category: "work",
//   due_date: "2025-10-11T00:00:00Z",
//   priority: "medium",
//   confidence: 0.95
// }
```

## AI Model Configuration

**Model:** GPT-4o-mini
**Temperature:** 0.3 (more deterministic)
**Response Format:** JSON

### Prompt Engineering

The AI uses a comprehensive system prompt that:
1. Defines clear rules for each field
2. Provides examples and guidelines
3. Ensures consistent formatting
4. Handles edge cases gracefully

## Performance & Reliability

### Fallback Behavior
If AI parsing fails:
- Falls back to original message
- Sets priority to "medium"
- Maintains basic functionality
- No errors shown to user

### Confidence Scoring
Each parse includes a confidence score (0.0-1.0):
- **0.9+**: High confidence, all fields extracted clearly
- **0.7-0.9**: Good confidence, most fields identified
- **0.4-0.7**: Moderate confidence, basic parsing
- **<0.4**: Low confidence, triggers fallback

### Processing Time
- Average: 1-2 seconds per task
- Runs asynchronously
- User sees immediate feedback
- No blocking UI updates

## Best Practices

### For Users

**Write Clear Task Descriptions:**
✅ Good: "Call dentist to schedule teeth cleaning appointment tomorrow at 2pm"
❌ Unclear: "dentist thing"

**Include Relevant Details:**
✅ Good: "Buy milk, eggs, bread from Whole Foods by Saturday"
❌ Too vague: "shopping"

**Use Natural Language:**
✅ Good: "Review Sarah's proposal by end of week"
✅ Good: "Urgent: Fix login bug in production"

### For Developers

**Database Queries:**
```typescript
// Always select title for display
const { data } = await supabase
  .from('tasks')
  .select('id, title, summary, content, category, due_date, priority')
```

**Display Logic:**
```typescript
// Prefer title, fallback to summary, then content
const displayText = task.title || task.summary || task.content
```

## Examples

### Short Simple Task
**Input:** "Buy milk"
```json
{
  "title": "Buy Milk",
  "content": "Buy milk",
  "summary": null,
  "category": "shopping",
  "due_date": null,
  "priority": "medium"
}
```

### Complex Long Task
**Input:** "I need to prepare a comprehensive presentation for the board meeting scheduled for next Tuesday at 10am. The presentation should include our Q3 financial results with detailed analysis, Q4 revenue projections, the proposed marketing strategy for the new product line, and competitive analysis. I should get input from Sarah in Finance and John in Marketing before finalizing. This is critical for securing next quarter's budget."

```json
{
  "title": "Prepare Board Meeting Presentation",
  "content": "[full original message]",
  "summary": "Create presentation with Q3 results, Q4 projections, marketing strategy, and competitive analysis. Get input from Sarah and John.",
  "category": "work",
  "due_date": "2025-10-08T10:00:00Z",
  "priority": "high"
}
```

### Date Variations
**Input:** "Dentist appointment tomorrow at 3pm"
```json
{
  "title": "Dentist Appointment",
  "due_date": "2025-10-08T15:00:00Z"
}
```

**Input:** "Submit taxes before April 15"
```json
{
  "title": "Submit Taxes",
  "due_date": "2025-04-15T00:00:00Z"
}
```

## Troubleshooting

### Issue: AI Not Generating Titles
**Cause:** OpenAI API key not configured
**Solution:** Set `OPENAI_API_KEY` in environment variables

### Issue: Wrong Categorization
**Cause:** Ambiguous task description
**Solution:** Add more context to the task message

### Issue: Date Parsing Errors
**Cause:** Unusual date formats
**Solution:** Use standard formats like "tomorrow", "next Friday", or "Dec 25"

## Future Enhancements

Potential improvements:
- 🎯 Custom categories per user
- 🔄 Task templates and patterns
- 📊 Smart suggestions based on history
- 🤝 Team collaboration features
- 🎨 Rich text formatting in descriptions
- 📎 Attachment support
- 🔔 Smart notification timing

## Technical Details

### Files Modified
- ✅ `supabase-schema.sql` - Database schema
- ✅ `src/types/database.ts` - TypeScript types
- ✅ `src/lib/openai.ts` - AI parsing logic
- ✅ `src/app/api/tasks/route.ts` - API endpoints
- ✅ `src/components/TaskCard.tsx` - UI component
- ✅ `src/lib/message-handler.ts` - WhatsApp handler

### Dependencies
- OpenAI SDK (existing)
- GPT-4o-mini model
- Supabase (existing)

---

**Created:** October 7, 2025  
**Last Updated:** October 7, 2025  
**Version:** 1.0.0

