import { NextRequest, NextResponse } from 'next/server';
import { whatsappClient, WhatsAppWebhookEntry } from '@/lib/whatsapp';
import { parseMessageToTask } from '@/lib/openai';
import { createServerClient } from '@/lib/supabase';

/**
 * Lightweight WhatsApp webhook handler
 * - Accepts any free-form message
 * - Always creates a task (never fails)
 * - Minimal response (✅ only)
 * - Background re-categorization support
 */

const SILENT_MODE = false; // Toggle to skip WhatsApp replies entirely

/**
 * GET handler for webhook verification
 * WhatsApp requires this to verify your endpoint
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  console.error('❌ Webhook verification failed');
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

/**
 * POST handler for incoming WhatsApp messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📨 Webhook received:', JSON.stringify(body, null, 2));

    // Validate webhook payload
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    // Process each entry in the webhook
    for (const entry of body.entry as WhatsAppWebhookEntry[]) {
      for (const change of entry.changes) {
        const value = change.value;

        // Check if there are messages
        if (!value.messages || value.messages.length === 0) {
          continue;
        }

        // Process each message
        for (const message of value.messages) {
          // Only process text messages
          if (message.type !== 'text' || !message.text?.body) {
            continue;
          }

          const phoneNumber = message.from;
          const messageText = message.text.body;
          const messageId = message.id;

          console.log(`💬 Message from ${phoneNumber}: ${messageText}`);

          // Mark as read (triggers blue ticks)
          await whatsappClient.markAsRead(messageId);

          // Process message and create task (never fails)
          await processAndCreateTask(phoneNumber, messageText);

          // Send minimal confirmation
          if (!SILENT_MODE) {
            await whatsappClient.sendMessage(phoneNumber, '✅');
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    // Still return 200 to avoid retries from WhatsApp
    return NextResponse.json({ status: 'error', message: 'Internal error' }, { status: 200 });
  }
}

/**
 * Process incoming message and create task
 * This function NEVER throws - it always creates a task
 */
async function processAndCreateTask(
  phoneNumber: string,
  messageText: string
): Promise<void> {
  const supabase = createServerClient();

  try {
    // 1. Find or create user
    const user = await findOrCreateUser(phoneNumber);

    // 2. Parse message with AI (lenient, always returns data)
    const parsed = await parseMessageToTask(messageText);

    console.log('🤖 Parsed task:', parsed);

    // 3. Create task with fallback values
    const taskData = {
      user_id: user.id,
      content: parsed.content || messageText, // Fallback to raw message
      due_date: parsed.due_date || null,
      priority: parsed.priority || 'medium',
      category: parsed.category || null,
      status: 'pending' as const,
      is_flagged: false,
    };

    const { data: task, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) {
      // Log error but don't throw - try fallback insert
      console.error('⚠️ Task insert error:', error);
      
      // Fallback: minimal task insert
      await supabase.from('tasks').insert({
        user_id: user.id,
        content: messageText,
        status: 'pending' as const,
      });
    } else {
      console.log('✅ Task created:', task?.id);

      // 4. Optionally trigger background re-categorization
      if (task && (!parsed.category || parsed.confidence < 0.7)) {
        scheduleRecategorization(task.id, messageText);
      }
    }
  } catch (error) {
    console.error('❌ Failed to process task:', error);
    // Even if everything fails, we've already acknowledged the message
    // This prevents message loss and avoids blocking the webhook
  }
}

/**
 * Find existing user or create new one
 */
async function findOrCreateUser(phoneNumber: string): Promise<{
  id: string;
  phone_number: string;
  name: string | null;
}> {
  const supabase = createServerClient();

  // Format phone number
  const formattedPhone = whatsappClient.formatPhoneNumber(phoneNumber);

  // Try to find existing user
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('phone_number', formattedPhone)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // Create new user
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({ phone_number: formattedPhone })
    .select()
    .single();

  if (error || !newUser) {
    console.error('❌ Error creating user:', error);
    throw new Error('Failed to create user');
  }

  console.log('👤 New user created:', newUser.id);
  return newUser;
}

/**
 * Placeholder for background re-categorization
 * This would be triggered for low-confidence or uncategorized tasks
 * 
 * Implementation ideas:
 * - Queue job to re-analyze task with more context
 * - Use task history to improve categorization
 * - Batch process multiple tasks for efficiency
 * - Use embeddings for semantic similarity
 */
function scheduleRecategorization(taskId: string, originalMessage: string): void {
  console.log(`🔄 Scheduling re-categorization for task ${taskId}`);
  
  // TODO: Implement background job
  // Options:
  // 1. Vercel Cron Job: https://vercel.com/docs/cron-jobs
  // 2. Supabase Edge Functions: https://supabase.com/docs/guides/functions
  // 3. Queue system: Bull, BullMQ, or Inngest
  // 4. Simple setTimeout for immediate retry (not production-ready)
  
  // Example implementation:
  // await queueJob('recategorize-task', {
  //   taskId,
  //   originalMessage,
  //   retryCount: 0,
  // });
}

