# 🚨 Webhook Stopped Working - Emergency Checklist

Your webhook WAS working but stopped receiving messages. Here's what to check:

---

## ⚠️ MOST LIKELY CAUSE: Access Token Expired

**WhatsApp temporary access tokens expire after 24 hours!**

### Quick Fix:
1. Go to https://developers.facebook.com/apps
2. Select your app
3. Go to **WhatsApp** → **API Setup** (or **Getting Started**)
4. Look for "Temporary access token"
5. Click **"Generate new token"** or copy the existing one
6. Go to your Vercel project: https://vercel.com
7. Click **Settings** → **Environment Variables**
8. Find `WHATSAPP_ACCESS_TOKEN`
9. Click **Edit** → paste the new token
10. Click **Save**
11. Go to **Deployments** tab
12. Click **"Redeploy"** on the latest deployment (⋯ menu → Redeploy)

**Important:** For production, you need a **permanent access token**:
- Go to Meta Business Settings
- Create a System User
- Generate a permanent token with `whatsapp_business_messaging` permission

---

## 🔍 Other Common Issues

### Issue 1: Webhook Subscription Disabled
**Check:**
1. Go to https://developers.facebook.com/apps
2. Your app → **WhatsApp** → **Configuration**
3. Scroll to **Webhook** section
4. Verify:
   - Webhook URL is still configured
   - Shows green ✓ "Verified"
   - **messages** field is subscribed (checkbox checked)

**Fix:**
- If webhook is missing, re-add it with your Vercel URL
- If unsubscribed, check the **messages** box

---

### Issue 2: Phone Number Removed from Allowed List
**Check:**
1. Go to **WhatsApp** → **API Setup** (or **Getting Started**)
2. Scroll to "Send and receive messages"
3. Check if your phone number is in the list

**Fix:**
- Click **"Manage phone number list"** or **"Add phone number"**
- Re-add your WhatsApp number
- Verify with the code sent

---

### Issue 3: Recent Code Changes Broke Something
**Check your recent commits:**
```bash
git log --oneline -5
```

**Recent changes:**
- 5b66c10 Fix TypeScript errors in all API routes
- 341ddc8 Fix TypeScript casting in categorise route

**Possible issue:** TypeScript fixes might have changed webhook logic

**Fix:**
1. Check Vercel deployment logs for errors
2. Test the webhook endpoint directly
3. Roll back if needed: `git revert HEAD` then push

---

### Issue 4: Environment Variables Changed
**Check:**
1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Verify ALL these are set correctly:
   - ✅ `WHATSAPP_ACCESS_TOKEN`
   - ✅ `WHATSAPP_PHONE_NUMBER_ID`
   - ✅ `WHATSAPP_VERIFY_TOKEN`
   - ✅ `OPENAI_API_KEY`
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`

**Fix:**
- Add any missing variables
- **Redeploy** after making changes

---

### Issue 5: Webhook URL Changed
**Check:**
- Did your Vercel URL change?
- New deployment might have a different domain

**Fix:**
1. Get your current Vercel URL from https://vercel.com
2. Update webhook in Meta dashboard to match

---

## 🧪 Quick Diagnostic Tests

### Test 1: Check if Webhook is Accessible
```bash
# Replace YOUR-VERCEL-URL with your actual URL
curl "https://YOUR-VERCEL-URL.vercel.app/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=my_secure_verify_token_12345&hub.challenge=HELLO"
```

**Expected:** Should return `HELLO`
**If 404/500:** Your webhook endpoint is broken

---

### Test 2: Check Diagnostic Endpoint
Visit in browser:
```
https://YOUR-VERCEL-URL.vercel.app/api/diagnostic
```

**Expected:** JSON showing all environment variables configured
**Red flags:** Any "error" status means something is misconfigured

---

### Test 3: Check Vercel Function Logs
1. Go to Vercel → Your Project
2. Click **Deployments** → Click latest deployment
3. Click **Functions** tab
4. Send a test WhatsApp message
5. Look for `/api/webhook/whatsapp` in the logs

**What to look for:**
- ✅ "Webhook received:" - Message arrived
- ✅ "Processing message from..." - Processing started
- ❌ "Error:" - Something failed
- ❌ No logs at all - Webhook not being called

---

### Test 4: Check Meta Webhook Deliveries
1. Meta Developers → Your App → **WhatsApp** → **Configuration**
2. Scroll to **Webhook**
3. Click on your callback URL
4. Check "Recent Deliveries" section

**What to look for:**
- ✅ 200 status - Webhook working
- ❌ 4xx/5xx status - Webhook failing
- ❌ No recent deliveries - Webhook not being called

---

## 🎯 Step-by-Step Debugging Process

### Step 1: Test Access Token
```bash
# Replace YOUR_TOKEN and YOUR_PHONE_NUMBER_ID
curl -X GET "https://graph.facebook.com/v21.0/YOUR_PHONE_NUMBER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**If error:** Token expired → Generate new token

---

### Step 2: Test Webhook Verification
```bash
curl "https://YOUR-VERCEL-URL.vercel.app/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=my_secure_verify_token_12345&hub.challenge=TEST123"
```

**Should return:** TEST123
**If not:** Webhook endpoint broken or verify token wrong

---

### Step 3: Send Test Message
Send this to your WhatsApp test number:
```
test message
```

Check Vercel logs immediately. Should see:
```
Webhook received: {...}
Processing message from [your-number]: test message
```

**If no logs:** Webhook not configured in Meta or phone not allowed

---

### Step 4: Check Database
Go to Supabase dashboard and run:
```sql
SELECT * FROM tasks ORDER BY created_at DESC LIMIT 5;
SELECT * FROM users ORDER BY created_at DESC;
```

**If no recent tasks:** Message processing is failing (check OpenAI API key)

---

## 🔥 Emergency Quick Fixes

### Quick Fix 1: Regenerate Everything
1. Generate new WhatsApp access token
2. Update in Vercel env vars
3. Redeploy
4. Re-verify webhook in Meta
5. Re-add your phone number

### Quick Fix 2: Redeploy
Sometimes a fresh deployment fixes things:
```bash
# Trigger a new deployment
git commit --allow-empty -m "Trigger redeploy"
git push
```

### Quick Fix 3: Roll Back
If recent changes broke it:
```bash
git log --oneline  # Find last working commit
git revert HEAD    # Undo last commit
git push
```

---

## 📞 Still Stuck?

### Check These Resources:
1. **Vercel Logs:** Most errors show up here
2. **Meta Webhook Logs:** Shows if messages are being sent
3. **Supabase Logs:** Shows database issues
4. **Browser Console:** Visit your Vercel URL and check for errors

### Common Error Messages:

**"WhatsApp credentials not configured"**
→ Missing env vars in Vercel

**"Webhook verification failed"**
→ Verify token mismatch

**"Error creating user"**
→ Supabase connection issue or RLS policy blocking

**"Error sending WhatsApp message"**
→ Access token invalid or phone not allowed

---

## ✅ Preventive Measures

To avoid this in the future:

1. **Use permanent access tokens** (not temporary 24-hour tokens)
2. **Enable deployment notifications** in Vercel
3. **Set up monitoring** (e.g., Sentry, LogRocket)
4. **Test after every deployment**
5. **Document your production URLs and settings**

---

## 🆘 Last Resort

If nothing works, start fresh:

1. Create new WhatsApp test number in Meta dashboard
2. Generate new access token
3. Update all environment variables
4. Configure new webhook
5. Add your phone to allowed list
6. Test with "hello" message

---

**Need help?** Check the diagnostic endpoint first:
`https://your-app.vercel.app/api/diagnostic`

