import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedTask {
  content: string;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
}

export async function parseMessageToTask(message: string): Promise<ParsedTask> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a task parsing AI. Extract task information from WhatsApp messages and return structured data.

Rules:
- Extract the main task content
- Identify due dates (convert relative dates like "tomorrow", "next week" to ISO dates)
- Determine priority: high (urgent/immediate), medium (soon), low (eventually)
- Provide confidence score (0-1) based on how clear the task is
- If no clear task, return null for content

Return JSON format:
{
  "content": "task description",
  "due_date": "2024-01-15" or null,
  "priority": "high|medium|low",
  "confidence": 0.9
}`
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    
    return {
      content: result.content || '',
      due_date: result.due_date || null,
      priority: result.priority || 'medium',
      confidence: result.confidence || 0.5
    };
  } catch (error) {
    console.error('Error parsing message:', error);
    return {
      content: message,
      due_date: null,
      priority: 'medium',
      confidence: 0.3
    };
  }
}
