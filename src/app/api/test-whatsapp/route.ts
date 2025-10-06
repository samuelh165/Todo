import { NextResponse } from 'next/server';
import { whatsappClient } from '@/lib/whatsapp';

/**
 * Test endpoint to verify WhatsApp API configuration
 * GET /api/test-whatsapp
 */
export async function GET() {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    // Check if all required environment variables are set
    const missingVars = [];
    if (!accessToken) missingVars.push('WHATSAPP_ACCESS_TOKEN');
    if (!phoneNumberId) missingVars.push('WHATSAPP_PHONE_NUMBER_ID');
    if (!verifyToken) missingVars.push('WHATSAPP_VERIFY_TOKEN');

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing required environment variables',
          missing: missingVars,
          help: 'Please set these variables in your .env.local file',
        },
        { status: 500 }
      );
    }

    // Test API connection by fetching phone number details
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        {
          status: 'error',
          message: 'WhatsApp API authentication failed',
          error: error,
          help: 'Check your WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID',
        },
        { status: 500 }
      );
    }

    const phoneData = await response.json();

    return NextResponse.json({
      status: 'success',
      message: 'WhatsApp API is configured correctly! ✅',
      details: {
        phoneNumberId: phoneNumberId,
        verifiedName: phoneData.verified_name,
        displayPhoneNumber: phoneData.display_phone_number,
        qualityRating: phoneData.quality_rating,
      },
      nextSteps: [
        '1. Set up your webhook at https://developers.facebook.com',
        '2. Use the webhook URL: ' + (process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com') + '/api/webhook/whatsapp',
        '3. Set verify token to match WHATSAPP_VERIFY_TOKEN in your environment',
        '4. Subscribe to "messages" webhook field',
        '5. Send a test message to your WhatsApp Business number',
      ],
    });
  } catch (error) {
    console.error('WhatsApp test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to test WhatsApp configuration',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Send a test message to a specific phone number
 * POST /api/test-whatsapp
 * Body: { "to": "1234567890" }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to } = body;

    if (!to) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing "to" phone number in request body',
          example: { to: '1234567890' },
        },
        { status: 400 }
      );
    }

    const message = '🎉 Test message from your WhatsApp Todo AI!\n\nYour integration is working correctly. Try sending a task like:\n\n"Buy groceries tomorrow"';

    const success = await whatsappClient.sendMessage(to, message);

    if (success) {
      return NextResponse.json({
        status: 'success',
        message: 'Test message sent successfully! ✅',
        to: to,
      });
    } else {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to send test message',
          help: 'Check your console logs for more details',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Send test message error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to send test message',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

