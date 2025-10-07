# WhatsApp To-Do AI

A smart to-do list web app that users can update by sending WhatsApp messages. The app uses AI to parse messages and organize them into structured tasks.

## 🚀 Features

- **WhatsApp Integration**: Send messages directly to WhatsApp and they'll be automatically parsed into tasks
- **AI-Powered Parsing**: Advanced AI understands context, dates, priorities, and organizes tasks intelligently
- **Calendar Sync**: Automatically sync tasks with your calendar and get smart reminders
- **Multi-User Support**: Shared family/team workspaces
- **Smart Grouping**: Context-aware task organization

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Radix UI
- **Database**: Supabase
- **AI**: OpenAI GPT-4o
- **Hosting**: Vercel
- **WhatsApp**: Meta WhatsApp Cloud API

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- WhatsApp Business API access

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd whatsapp-todo-ai
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Fill in the following variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# WhatsApp Cloud API Configuration
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id_here
WHATSAPP_VERIFY_TOKEN=your_whatsapp_verify_token_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  due_date DATE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table (for Phase 2)
CREATE TABLE topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your auth setup)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (true);

CREATE POLICY "Users can view own topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Users can insert own topics" ON topics FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own topics" ON topics FOR UPDATE USING (true);
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📱 WhatsApp Setup

For detailed setup instructions, see [WHATSAPP_SETUP.md](./WHATSAPP_SETUP.md).

Quick overview:

1. **Get WhatsApp Business API Access**:
   - Create a Meta Business App
   - Add WhatsApp product
   - Get your access token and phone number ID

2. **Configure Environment Variables**:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your WhatsApp credentials

3. **Set up Webhook**:
   - Deploy your app to a public URL
   - Configure webhook in Meta dashboard: `https://your-domain.com/api/webhook/whatsapp`
   - Subscribe to "messages" field

4. **Test Integration**:
   - Visit `/api/test-whatsapp` to verify your configuration
   - Send a test message to your WhatsApp Business number
   - Check that you receive task confirmations

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   └── webhook/       # WhatsApp webhook
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── openai.ts         # OpenAI integration
│   └── utils.ts          # General utilities
└── types/                 # TypeScript types
    └── database.ts       # Database types
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your Vercel project settings.

## 📋 Development Phases

- **Phase 1**: MVP with WhatsApp → AI → Task → Web App
- **Phase 2**: Smart context grouping and topic awareness
- **Phase 3**: Multi-user shared workspaces
- **Phase 4**: Calendar integration
- **Phase 5**: AI summaries, reminders, and integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.# Trigger redeploy
