# 🚨 FIX YOUR WEBHOOK NOW - 5 MINUTE GUIDE

## Step 1: Get New WhatsApp Access Token (MOST LIKELY ISSUE)

1. Go to: https://developers.facebook.com/apps
2. Click your WhatsApp app
3. Click **WhatsApp** in left sidebar → **API Setup** or **Getting Started**
4. Find "Temporary access token" section
5. Click **"Copy"** or **"Generate new token"**
6. **COPY THIS TOKEN** ← You need it for next step

---

## Step 2: Update Token in Vercel

1. Go to: https://vercel.com
2. Find your project: **Todo**
3. Click **Settings** → **Environment Variables**
4. Find: `WHATSAPP_ACCESS_TOKEN`
5. Click **⋯** (three dots) → **Edit**
6. **Paste the NEW token** from Step 1
7. Click **Save**

---

## Step 3: Redeploy

1. Still in Vercel, click **Deployments** tab
2. Find the top deployment (most recent)
3. Click **⋯** (three dots) on the right
4. Click **Redeploy**
5. Wait 1-2 minutes

---

## Step 4: Test

Send this message to your WhatsApp Business test number:
```
hello test
```

You should now see:
- ⏳ reaction
- Blue ticks ✓✓
- ✅ reaction
- Bot response

---

## 🎯 Quick Links

**Meta Developers (get token):**
https://developers.facebook.com/apps

**Vercel (update token):**
https://vercel.com

**Your diagnostic page (check status):**
https://YOUR-VERCEL-URL.vercel.app/api/diagnostic

---

## Still Not Working?

### Check these in order:

1. **Webhook still configured?**
   - Meta → WhatsApp → Configuration → Webhook section
   - Should show your Vercel URL
   - Should be "Verified" (green checkmark)

2. **Phone number still allowed?**
   - Meta → WhatsApp → API Setup
   - Your phone should be in the list
   - Re-add if missing

3. **Messages field subscribed?**
   - Meta → WhatsApp → Configuration → Webhook
   - Check the **messages** checkbox

4. **Check Vercel logs:**
   - Vercel → Deployments → Click latest → Functions tab
   - Send a test message
   - Look for errors

---

## 📱 Can't Find Your Vercel URL?

Your repo is: `samuelh165/Todo`

Your URL is probably one of these:
- `https://todo-samuelh165.vercel.app`
- `https://todo-git-main-samuelh165.vercel.app`
- `https://todo-theta-eight.vercel.app` (or similar)

Check Vercel dashboard to confirm!

