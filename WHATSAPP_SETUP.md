# WhatsApp Integration Setup Guide

This guide will help you set up the WhatsApp Cloud API integration for your todo app.

## Prerequisites

- A Meta Business Account
- A WhatsApp Business Account
- A verified Meta Business App

## Step 1: Create a Meta Business App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click on "My Apps" → "Create App"
3. Choose "Business" as the app type
4. Fill in your app details and create the app

## Step 2: Add WhatsApp Product

1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. Select your WhatsApp Business Account or create a new one

## Step 3: Get Your Credentials

### Access Token
1. Go to WhatsApp → Getting Started in your app dashboard
2. Copy the temporary access token (for testing)
3. For production, generate a permanent access token:
   - Go to Business Settings → System Users
   - Create a system user
   - Add assets (your WhatsApp Business Account)
   - Generate a permanent token with `whatsapp_business_messaging` permission

### Phone Number ID
1. In WhatsApp → Getting Started
2. Under "Send and receive messages", you'll see your test phone number
3. Copy the Phone Number ID (not the display number)

### Verify Token
1. Create a random string (e.g., `my_secure_verify_token_12345`)
2. Save this - you'll use it in both your .env.local and webhook configuration

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root with these values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# WhatsApp Cloud API Configuration
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Deploy Your Application

Deploy your app to a publicly accessible URL (we recommend Vercel):

```bash
# Deploy to Vercel
vercel

# Or build and deploy to your preferred platform
npm run build
```

Make sure all environment variables are set in your deployment platform.

## Step 6: Configure Webhook

1. In your Meta app dashboard, go to WhatsApp → Configuration
2. Click "Edit" next to Webhook
3. Enter your webhook details:
   - **Callback URL**: `https://your-domain.com/api/webhook/whatsapp`
   - **Verify Token**: The same token you set in WHATSAPP_VERIFY_TOKEN
4. Click "Verify and Save"
5. Subscribe to webhook fields:
   - ✅ messages

## Step 7: Test the Integration

### Using the Test Number

1. In WhatsApp → Getting Started, find the test phone number
2. Add your personal WhatsApp number to the allowed list
3. Send a test message from your phone to the test number
4. You should receive:
   - A ⏳ reaction while processing
   - A ✅ reaction when done
   - A confirmation message with task details

### Example Test Messages

Try sending these messages:

```
Buy milk tomorrow
Call dentist next Tuesday
Submit report by Friday high priority
Book flight tickets
Prepare presentation for Monday meeting
```

## Step 8: Monitor and Debug

### View Webhook Logs

1. In your app dashboard, go to WhatsApp → Configuration
2. Scroll to Webhooks section
3. Click on the webhook URL to see recent deliveries

### View Application Logs

For Vercel deployments:
```bash
vercel logs
```

### Common Issues

**Webhook verification fails**
- Ensure WHATSAPP_VERIFY_TOKEN matches in both .env.local and Meta dashboard
- Check that your endpoint is publicly accessible
- Verify the callback URL is correct

**Messages not being received**
- Check webhook subscription is active
- Verify 'messages' field is subscribed
- Check application logs for errors

**Tasks not being created**
- Verify Supabase credentials are correct
- Check database tables are created (run supabase-schema.sql)
- Review application logs for database errors

**AI parsing issues**
- Verify OPENAI_API_KEY is set correctly
- Check OpenAI API quota/billing
- Review message format and try clearer task descriptions

## Step 9: Production Readiness

Before going to production:

1. **Get a permanent access token** (temporary tokens expire in 24 hours)
2. **Apply for WhatsApp Business verification** to increase message limits
3. **Set up proper error monitoring** (e.g., Sentry)
4. **Configure rate limiting** to prevent abuse
5. **Review and update RLS policies** in Supabase for security
6. **Set up backup and monitoring** for your database

## Features Implemented

✅ **Webhook Verification** - GET endpoint for Meta verification
✅ **Message Reception** - Receives incoming WhatsApp messages
✅ **User Management** - Auto-creates users based on phone number
✅ **AI Task Parsing** - Uses OpenAI to extract task details
✅ **Task Creation** - Saves tasks to Supabase database
✅ **Rich Responses** - Sends formatted confirmations with emojis
✅ **Message Status** - Marks messages as read
✅ **Reactions** - Shows processing status with reactions

## API Endpoints

### GET /api/webhook/whatsapp
Webhook verification endpoint used by Meta

**Query Parameters:**
- `hub.mode` - Should be "subscribe"
- `hub.verify_token` - Your verification token
- `hub.challenge` - Challenge string to echo back

### POST /api/webhook/whatsapp
Receives incoming WhatsApp messages

**Request Body:** WhatsApp webhook payload
**Response:** 200 OK for successful processing

## Next Steps

- Implement message commands (e.g., "list tasks", "mark done")
- Add task editing via WhatsApp
- Implement reminders and notifications
- Add support for voice messages
- Create shared workspaces for teams
- Integrate calendar sync

## Support

For issues with:
- **WhatsApp API**: Check [Meta's WhatsApp Business Platform documentation](https://developers.facebook.com/docs/whatsapp)
- **This app**: Check application logs and GitHub issues

## Security Notes

- Never commit `.env.local` to version control
- Use service role key only on server-side
- Implement rate limiting for webhook endpoint
- Validate webhook signatures in production (recommended)
- Regularly rotate access tokens
- Monitor for unusual activity

