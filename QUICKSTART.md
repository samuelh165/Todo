# WhatsApp Todo AI - Quick Start Guide

Get your WhatsApp todo app running in minutes!

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Get from supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Get from platform.openai.com
OPENAI_API_KEY=sk-proj-...

# Get from developers.facebook.com (see WHATSAPP_SETUP.md)
WHATSAPP_ACCESS_TOKEN=EAA...
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_VERIFY_TOKEN=your_random_token_here

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

1. Go to your Supabase project → SQL Editor
2. Run the SQL from `supabase-schema.sql`
3. Wait for all tables to be created

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Test Your Setup

#### Test Database & OpenAI:
```bash
# Open your browser
http://localhost:3000
```

#### Test WhatsApp API:
```bash
# Open your browser
http://localhost:3000/api/test-whatsapp
```

You should see a success message if everything is configured correctly!

## 🚀 Deploy to Production

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add all environment variables from `.env.local`
5. Deploy!

After deployment:

1. Copy your production URL (e.g., `https://your-app.vercel.app`)
2. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
3. Set up WhatsApp webhook (see next section)

### Set Up WhatsApp Webhook

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Open your WhatsApp Business App
3. Go to WhatsApp → Configuration
4. Add webhook:
   - **Callback URL**: `https://your-app.vercel.app/api/webhook/whatsapp`
   - **Verify Token**: Same as `WHATSAPP_VERIFY_TOKEN` in your env
5. Subscribe to field: `messages`

## 📱 Test the Integration

### Add Your Phone Number

In Meta dashboard → WhatsApp → Getting Started:
1. Find "Send and receive messages"
2. Click "Add phone number"
3. Enter your WhatsApp number
4. Verify it

### Send Test Messages

Send these messages to your WhatsApp Business number:

```
Buy groceries tomorrow
```

```
Call dentist next Tuesday
```

```
Submit report by Friday
```

You should receive:
- ⏳ Processing reaction
- ✅ Success reaction
- Confirmation message with task details

### Try Commands

```
list
```
Shows all your pending tasks

```
done 1
```
Marks task #1 as complete

```
help
```
Shows all available commands

## 📚 Available Commands

### Add Tasks
Just send a message:
- "Buy milk tomorrow"
- "Call mom next week"
- "Submit report by Friday high priority"

### List Tasks
- `list`
- `tasks`
- `show tasks`

### Complete Tasks
- `done 1`
- `complete 2`
- `finish 3`

### Cancel Tasks
- `cancel 1`
- `delete 2`
- `remove 3`

### Get Help
- `help`
- `commands`

## 🎯 Features

✅ Natural language task parsing
✅ Automatic date extraction
✅ Priority detection
✅ Task listing via WhatsApp
✅ Mark tasks complete via WhatsApp
✅ Cancel tasks via WhatsApp
✅ Rich emoji responses
✅ Message reactions for status
✅ Multi-user support

## 🔧 Troubleshooting

### Webhook Verification Fails

Check:
- ✅ `WHATSAPP_VERIFY_TOKEN` matches in both env and Meta dashboard
- ✅ Your app is deployed and publicly accessible
- ✅ Callback URL is correct (including `/api/webhook/whatsapp`)

### Messages Not Received

Check:
- ✅ Webhook is subscribed to `messages` field
- ✅ Your phone number is added to allowed list
- ✅ Check webhook logs in Meta dashboard
- ✅ Check application logs (Vercel logs)

### Tasks Not Created

Check:
- ✅ Database tables are created (run `supabase-schema.sql`)
- ✅ Supabase credentials are correct
- ✅ RLS policies are created
- ✅ Check application logs for errors

### AI Parsing Issues

Check:
- ✅ `OPENAI_API_KEY` is valid
- ✅ OpenAI account has credits
- ✅ Send clearer task descriptions
- ✅ Check application logs

## 📖 Full Documentation

- [WHATSAPP_SETUP.md](./WHATSAPP_SETUP.md) - Detailed WhatsApp setup
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup
- [README.md](./README.md) - Complete project documentation

## 🆘 Need Help?

1. Check your application logs
2. Visit `/api/test-whatsapp` to verify configuration
3. Review environment variables
4. Check Meta webhook delivery logs
5. Open an issue on GitHub

## 🎉 Next Steps

- Customize task parsing prompts in `src/lib/openai.ts`
- Add more commands in `src/lib/message-handler.ts`
- Enhance UI in `src/app/page.tsx`
- Set up calendar integration
- Add reminder notifications
- Create shared workspaces

Happy coding! 🚀

