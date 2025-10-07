import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedTask {
  title: string | null;
  content: string;
  summary: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  category: string | null;
  confidence: number;
}

/**
 * Lenient task parser - always returns valid data, never throws
 * Falls back to raw message if parsing fails
 */
export async function parseMessageToTask(message: string): Promise<ParsedTask> {
  // Fallback response in case everything fails
  const fallback: ParsedTask = {
    title: null,
    content: message,
    summary: null,
    due_date: null,
    priority: 'medium',
    category: null,
    confidence: 0.3
  };

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a smart task assistant that extracts, formats, and organizes task information. Always return valid JSON.

Rules:
1. TITLE: **ALWAYS** generate a concise, action-oriented title (3-8 words) that captures the essence of the task
   - Use imperative verbs (e.g., "Review", "Call", "Buy", "Complete")
   - Be specific and clear
   - Examples: "Review Q4 Financial Report", "Call Mom about Weekend Plans", "Buy Groceries for Week"
   - NEVER set to null - every task must have a title

2. CONTENT: Keep the full original message as the content for reference

3. SUMMARY: If the message is long (>100 chars) or complex, create a brief summary (1-2 sentences)
   - Highlight key points and important details
   - If message is short/simple, set to null

4. DUE_DATE: Extract and convert dates to ISO 8601 format
   - Relative dates: "tomorrow", "next week", "in 3 days" → ISO format
   - Specific dates: "Dec 25", "January 15" → ISO format
   - Use current date: October 7, 2025 (as reference)
   - Set to null if no date mentioned

5. PRIORITY: Determine urgency level
   - high: urgent keywords ("ASAP", "urgent", "immediately", "critical")
   - medium: default for most tasks
   - low: "eventually", "someday", "when you can"

6. CATEGORY: Intelligently categorize the task
   - Common categories: work, personal, shopping, health, fitness, finance, home, education, social
   - Be specific when possible
   - Set to null only if truly unclear

7. CONFIDENCE: Rate your confidence in the parsing (0.0 to 1.0)

Always return this exact JSON structure:
{
  "title": "Action-Oriented Title",
  "content": "full original message",
  "summary": "brief summary if needed" or null,
  "due_date": "2025-10-15T00:00:00Z" or null,
  "priority": "high|medium|low",
  "category": "work" or null,
  "confidence": 0.9
}`
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3 // More deterministic
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    
    console.log('AI Parsed Task:', {
      title: result.title,
      summary: result.summary,
      category: result.category,
      priority: result.priority
    });
    
    return {
      title: result.title || null,
      content: result.content || message,
      summary: result.summary || null,
      due_date: result.due_date || null,
      priority: result.priority || 'medium',
      category: result.category || null,
      confidence: result.confidence || 0.5
    };
  } catch (error) {
    console.error('Error parsing message:', error);
    return fallback;
  }
}
