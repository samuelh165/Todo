# 🚀 Deploy WhatsApp To-Do AI to Production

## Step 1: Push Your Code to GitHub

### 1.1 Initialize Git (if not already done)
```bash
cd /Users/samuelhoh/whatsapp-todo-ai
git init
git add .
git commit -m "Initial commit - WhatsApp To-Do AI"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Name it: `whatsapp-todo-ai`
3. Don't initialize with README (you already have one)
4. Click "Create repository"

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR-USERNAME/whatsapp-todo-ai.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### 2.1 Go to Vercel
1. Visit https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**

### 2.2 Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find `whatsapp-todo-ai` in your repositories
3. Click **"Import"**

### 2.3 Configure Project
**Framework Preset:** Next.js (should auto-detect)
**Root Directory:** `./` (leave as default)
**Build Command:** `npm run build` (auto-filled)
**Output Directory:** `.next` (auto-filled)

### 2.4 Add Environment Variables
Click **"Environment Variables"** and add these:

```
NEXT_PUBLIC_SUPABASE_URL=https://tdrkddwcoptxirktgelq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcmtkZHdjb3B0eGlya3RnZWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjQyMjcsImV4cCI6MjA3NTI0MDIyN30.s0GuDbiumsnUQd0w02Z-93TWHcjcqjqkyDJ3-outZC0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcmtkZHdjb3B0eGlya3RnZWxxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY2NDIyNywiZXhwIjoyMDc1MjQwMjI3fQ.L5rHRdab44lrSxgknL1-hc07Cq1BvZRSrdfj43trfHw
OPENAI_API_KEY=your_openai_api_key
WHATSAPP_ACCESS_TOKEN=EAAVSwFSrtD0BPtzfI8S7x0E1ilQMjShyCJwYeu1cRdyLVlavSFL8mHb5jVSZBGhyYkTf1l0t9SMrscnUbkywdPFHXSNPyNM4Y4QhLIJSOxy8sQR5ZBxfTcbiM3zxK7yxBpqhiTG3lnqWkjkLEwKm1EzgcrQyFvtRs46oEvlk9S1Qv5Bb0Im4YodZCrs7DPhv5O8WEuR2OTWQbwp0IXwms8KP8Kv5WySCxnloLz0WHXbTgZDZD
WHATSAPP_PHONE_NUMBER_ID=779868495215958
WHATSAPP_VERIFY_TOKEN=my_secure_verify_token_12345
```

### 2.5 Deploy!
Click **"Deploy"** and wait 2-3 minutes

---

## Step 3: Update WhatsApp Webhook URL

### 3.1 Get Your Production URL
After deployment, Vercel gives you a URL like:
```
https://whatsapp-todo-ai.vercel.app
```

### 3.2 Configure WhatsApp Webhook
1. Go to **Meta Developers**: https://developers.facebook.com
2. Click your app
3. Go to **WhatsApp** → **Configuration**
4. In **Webhook** section, click **"Edit"**

**Callback URL:**
```
https://whatsapp-todo-ai.vercel.app/api/webhook/whatsapp
```

**Verify Token:**
```
my_secure_verify_token_12345
```

5. Click **"Verify and Save"**

### 3.3 Subscribe to Webhook Fields
Make sure these are checked:
- ✅ `messages`
- ✅ `message_status` (optional)

---

## Step 4: Test Your Live App! 🎉

### 4.1 Send a WhatsApp Message
Send a message to your WhatsApp Business number:
```
Buy groceries tomorrow
```

### 4.2 Check Your Dashboard
Go to: `https://whatsapp-todo-ai.vercel.app/dashboard`

You should see the task appear!

---

## 🐛 Troubleshooting

### Webhook Not Working?
Check Vercel logs:
1. Go to your Vercel project
2. Click **"Deployments"**
3. Click latest deployment
4. Click **"Functions"** tab
5. Look for `/api/webhook/whatsapp` logs

### Database Connection Issues?
Make sure Supabase RLS policies allow access:
```sql
-- Temporarily disable RLS for testing
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### Environment Variables Not Working?
- Make sure you added them in Vercel dashboard
- Redeploy after adding env vars

---

## 🎯 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Update WhatsApp webhook URL
3. ✅ Test with real messages
4. ✅ Monitor Vercel logs
5. ✅ Share dashboard link with team

---

## 📱 Your Live URLs

**Dashboard:** `https://your-app.vercel.app/dashboard`
**Actions:** `https://your-app.vercel.app/actions`
**Webhook:** `https://your-app.vercel.app/api/webhook/whatsapp`

Congratulations! Your app is now live! 🚀

