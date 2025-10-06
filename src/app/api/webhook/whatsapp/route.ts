import { NextRequest, NextResponse } from 'next/server';
import { whatsappClient, WhatsAppWebhookEntry } from '@/lib/whatsapp';
import { handleMessage } from '@/lib/message-handler';
import { createServerClient } from '@/lib/supabase';

/**
 * GET handler for webhook verification
 * WhatsApp will send a verification request when setting up the webhook
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  // Check if verification token matches
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  console.error('Webhook verification failed');
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

/**
 * POST handler for incoming WhatsApp messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // Check if this is a WhatsApp message notification
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

          console.log(`Processing message from ${phoneNumber}: ${messageText}`);

          // Mark message as read
          await whatsappClient.markAsRead(messageId);

          // Send "processing" reaction
          await whatsappClient.sendReaction(phoneNumber, messageId, '⏳');

          try {
            // Process the message
            await processIncomingMessage(phoneNumber, messageText);

            // Send success reaction
            await whatsappClient.sendReaction(phoneNumber, messageId, '✅');
          } catch (error) {
            console.error('Error processing message:', error);
            
            // Send error reaction
            await whatsappClient.sendReaction(phoneNumber, messageId, '❌');
            
            // Send error message to user
            await whatsappClient.sendMessage(
              phoneNumber,
              '❌ Sorry, I had trouble processing your message. Please try again.'
            );
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Process an incoming WhatsApp message
 * 1. Find or create user
 * 2. Handle message/command
 * 3. Send response
 */
async function processIncomingMessage(
  phoneNumber: string,
  messageText: string
): Promise<void> {
  // 1. Find or create user
  const user = await findOrCreateUser(phoneNumber);

  // 2. Handle message/command
  const result = await handleMessage(phoneNumber, messageText, user.id);

  // 3. Send response
  await whatsappClient.sendMessage(phoneNumber, result.message);

  console.log('Message processed:', {
    command: result.command,
    success: result.success,
  });
}

/**
 * Find an existing user or create a new one
 */
async function findOrCreateUser(phoneNumber: string): Promise<{
  id: string;
  phone_number: string;
  name: string | null;
}> {
  const supabase = createServerClient();

  // Format phone number (remove special characters)
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
  const { data: newUser, error } = await (supabase
    .from('users') as any)
    .insert({
      phone_number: formattedPhone,
    })
    .select()
    .single();

  if (error || !newUser) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }

  console.log('New user created:', newUser);
  return newUser;
}

