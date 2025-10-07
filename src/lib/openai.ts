import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedTask {
  content: string;
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
    content: message,
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
          content: `Extract task, optional due_date, and optional category. Always return valid JSON.

Rules:
- Extract the main task content (if unclear, use the original message)
- Identify due dates (convert relative dates like "tomorrow", "next week" to ISO 8601 format)
- Determine priority: high (urgent/immediate), medium (default), low (eventually)
- Guess a category if possible: work, personal, shopping, health, finance, etc.
- If nothing is clear, return the original message as task with nulls

Always return this JSON structure:
{
  "task": "task description",
  "due_date": "2024-01-15T00:00:00Z" or null,
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
    
    return {
      content: result.task || result.content || message,
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
