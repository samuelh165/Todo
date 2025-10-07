# Troubleshooting: No Blue Ticks on WhatsApp Messages

## What Are Blue Ticks?
Blue ticks (✓✓) in WhatsApp indicate that your message has been **read** by the recipient. For your Todo AI bot, these should appear when:
1. You send a message to the WhatsApp Business number
2. Your webhook receives the message
3. Your code calls `markAsRead()` on the message

## Quick Diagnostic Checklist

### ✅ Step 1: Is Your App Deployed?
Your webhook MUST be publicly accessible on the internet (not localhost).

**Check:**
- [ ] App is deployed to Vercel/another hosting platform
- [ ] You have a public URL (e.g., `https://your-app.vercel.app`)
- [ ] The URL is accessible (visit it in a browser)

**To deploy now:**
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel --prod

# Copy the production URL you get
```

### ✅ Step 2: Is Your Webhook Configured in Meta?
The Meta/WhatsApp Business Platform needs to know where to send messages.

**Check in Meta for Developers:**
1. Go to https://developers.facebook.com/apps
2. Select your app
3. Go to **WhatsApp** → **Configuration**
4. Under **Webhook**, verify:
   - [ ] Callback URL is: `https://YOUR-DOMAIN.com/api/webhook/whatsapp`
   - [ ] Verify Token matches your `WHATSAPP_VERIFY_TOKEN`
   - [ ] Webhook is showing as **Verified** (green checkmark)
   - [ ] **messages** field is subscribed

**If not configured:**
1. Click **Edit** next to Webhook
2. Enter your callback URL
3. Enter your verify token
4. Click **Verify and Save**
5. Subscribe to **messages** field

### ✅ Step 3: Are Environment Variables Set?
Your deployed app needs the same environment variables.

**For Vercel:**
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Verify these are set:
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_VERIFY_TOKEN`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

**After adding/updating variables:**
```bash
# Redeploy for changes to take effect
vercel --prod
```

### ✅ Step 4: Is Your Phone Number Allowed?
WhatsApp test numbers only work with pre-approved phone numbers.

**Check:**
1. In Meta for Developers, go to **WhatsApp** → **Getting Started**
2. Under "Send and receive messages", find the test number
3. Click **Add phone number**
4. Add your personal WhatsApp number
5. Verify it via the code sent to your phone

### ✅ Step 5: Are Messages Reaching Your Webhook?
Test if messages are being received.

**Option A: Check Vercel Logs**
```bash
vercel logs --follow
```

Then send a test message. You should see:
- "Webhook received:" followed by the payload
- "Processing message from [your-number]"
- "Message sent successfully"

**Option B: Check Meta Webhook Logs**
1. Go to **WhatsApp** → **Configuration**
2. Scroll to **Webhook**
3. Click on your webhook URL
4. Check "Recent Deliveries" for successful POST requests (200 status)

### ✅ Step 6: Is markAsRead() Working?
If messages are being received but no blue ticks, check for API errors.

**Look for errors in logs:**
- "WhatsApp mark as read error:" - API issue
- Check your access token is valid
- Ensure `WHATSAPP_PHONE_NUMBER_ID` is correct

## Common Issues and Solutions

### Issue 1: "Webhook verification failed"
**Solution:**
- Ensure `WHATSAPP_VERIFY_TOKEN` in your .env matches exactly what you entered in Meta
- Redeploy after changing environment variables
- Try the verification again in Meta dashboard

### Issue 2: "Messages not being received"
**Causes:**
1. Webhook not subscribed to "messages" field
2. Webhook URL is incorrect
3. App is not deployed/running

**Solution:**
- Verify webhook configuration in Meta dashboard
- Check webhook subscription includes "messages"
- Test your webhook URL: `curl https://YOUR-DOMAIN.com/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=my_secure_verify_token_12345&hub.challenge=test`
  - Should return: `test`

### Issue 3: "No blue ticks but bot responds"
**Causes:**
- `markAsRead()` call is failing silently
- Access token has incorrect permissions
- Phone Number ID is wrong

**Solution:**
1. Check your logs for "WhatsApp mark as read error"
2. Generate a new access token with `whatsapp_business_messaging` permission
3. Verify your Phone Number ID (not the display number)

### Issue 4: "Nothing happens when I send messages"
**Causes:**
- Your phone number isn't added to the allowed list
- Using wrong WhatsApp number
- Messages being sent to your personal number instead of the test number

**Solution:**
1. Add your phone to the allowed list (see Step 4 above)
2. Find the test number in Meta dashboard under WhatsApp → Getting Started
3. Send messages TO that number, not FROM it

### Issue 5: "Webhook shows 500 errors"
**Causes:**
- Missing environment variables
- Database connection issues
- OpenAI API key invalid/missing

**Solution:**
1. Check all environment variables are set
2. Test Supabase connection
3. Verify OpenAI API key: https://platform.openai.com/api-keys
4. Check logs for specific error messages

## Testing the Fix

Once you've completed the setup:

1. **Send a test message:**
   ```
   Buy milk tomorrow
   ```

2. **You should see:**
   - ⏳ reaction appears immediately (processing)
   - Blue ticks appear (message marked as read)
   - ✅ reaction replaces ⏳ (success)
   - Bot responds with task confirmation

3. **Test other commands:**
   ```
   list
   done 1
   help
   ```

## Still Not Working?

If you've tried everything above and still have issues:

1. **Check your access token expiry:**
   - Temporary tokens expire in 24 hours
   - Generate a permanent token for production

2. **Review Meta webhook deliveries:**
   - Look for error responses (4xx, 5xx)
   - Check the error messages

3. **Enable detailed logging:**
   See the webhook logs with:
   ```bash
   vercel logs --follow
   ```

4. **Test the WhatsApp API directly:**
   Create a test script to verify your credentials work.

## Need More Help?

- **Meta's Documentation**: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
- **Check your app logs**: `vercel logs` or your hosting platform's logs
- **Verify credentials**: Double-check all tokens and IDs in your environment variables

---

**Quick Test Command:**
```bash
# Test webhook endpoint is accessible
curl "https://YOUR-DOMAIN.com/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=my_secure_verify_token_12345&hub.challenge=HELLO"

# Should return: HELLO
```

