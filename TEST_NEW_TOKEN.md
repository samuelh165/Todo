# ✅ Test Your New WhatsApp Token

## Quick Test - Does the new token work?

Run this command to verify your new token is valid:

```bash
curl -X GET "https://graph.facebook.com/v21.0/779868495215958" \
  -H "Authorization: Bearer EAAVSwFSrtD0BPn3VZC9KUqv1rUAjDFhylQLwnEc8Ondrmv5HpzWYKAcyhsVZBTZBPygSCyDhrK8mKPn9hZCs4pcZBPXvczMwPBAv7irlZBkHGC9HZAlVXmn5MgpNQWfrfoIn3m6Hkfg46B8kPQ8GhyPd2OQqJOBA1ZAXU7BSvbifM5IVioyIav96ZBv3GMdEg9lZCM8xxLycgef9CKrDxdJxVKWAaxqNKQgruS1P4DhMD8cTZCtygZDZD"
```

### Expected Response (Token works ✅):
```json
{
  "verified_name": "Your Business Name",
  "display_phone_number": "+1 555...",
  "quality_rating": "GREEN",
  "id": "779868495215958"
}
```

### Error Response (Token invalid ❌):
```json
{
  "error": {
    "message": "Invalid OAuth access token",
    "type": "OAuthException",
    "code": 190
  }
}
```

---

## After Updating in Vercel

### Step 1: Update the token in Vercel
Follow the instructions in the previous message.

### Step 2: Redeploy
- Vercel → Deployments → Click ⋯ → Redeploy
- Wait 1-2 minutes

### Step 3: Send Test Message
Send this to your WhatsApp Business test number:
```
hello world
```

### Step 4: Check Results
You should see:
1. ⏳ **Processing reaction** appears immediately
2. ✓✓ **Blue ticks** appear (message marked as read) ← This is what you wanted!
3. ✅ **Success reaction** replaces the ⏳
4. **Bot responds** with a message

---

## Still Not Working?

### Check Vercel Logs:
1. Go to https://vercel.com
2. Your project → **Deployments**
3. Click latest deployment
4. Click **Functions** tab
5. Send a test message
6. Look for logs from `/api/webhook/whatsapp`

**What to look for:**
- ✅ "Webhook received:" - Good! Message arrived
- ✅ "Processing message from..." - Good! Processing started
- ❌ "WhatsApp API error" - Token or phone ID issue
- ❌ Nothing - Webhook not being called (check Meta config)

---

## Quick Checklist After Token Update

- [ ] Updated token in Vercel environment variables
- [ ] Saved changes in Vercel
- [ ] Redeployed the app
- [ ] Waited for deployment to complete (1-2 min)
- [ ] Sent test message to WhatsApp
- [ ] Received reactions and blue ticks ✓✓

---

## Your New Token (for reference):
```
EAAVSwFSrtD0BPn3VZC9KUqv1rUAjDFhylQLwnEc8Ondrmv5HpzWYKAcyhsVZBTZBPygSCyDhrK8mKPn9hZCs4pcZBPXvczMwPBAv7irlZBkHGC9HZAlVXmn5MgpNQWfrfoIn3m6Hkfg46B8kPQ8GhyPd2OQqJOBA1ZAXU7BSvbifM5IVioyIav96ZBv3GMdEg9lZCM8xxLycgef9CKrDxdJxVKWAaxqNKQgruS1P4DhMD8cTZCtygZDZD
```

**⚠️ Remember:** This is a temporary token that expires in 24 hours. For production, generate a permanent token!

### How to Get a Permanent Token:
1. Go to Meta Business Settings
2. Create a System User
3. Assign your WhatsApp app to it
4. Generate a token with `whatsapp_business_messaging` permission
5. Token never expires (unless revoked)

