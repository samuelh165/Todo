# 🔄 Migration to Lightweight Webhook

## Quick Start

You have **two options** for migrating to the new lightweight webhook:

---

## Option 1: Use New Webhook (Recommended)

### Step 1: Update Meta Webhook URL

1. Go to https://developers.facebook.com/apps
2. Your app → **WhatsApp** → **Configuration**
3. Edit webhook callback URL to:
   ```
   https://todo-r17i.vercel.app/api/whatsapp
   ```
   (Note: `/api/whatsapp` instead of `/api/webhook/whatsapp`)

### Step 2: Deploy

```bash
git add .
git commit -m "Refactor: Lightweight webhook with category support"
git push
```

Vercel will automatically deploy.

### Step 3: Test

Send a message to your WhatsApp number:
```
buy milk tomorrow
```

You should receive just: `✅`

---

## Option 2: Replace Old Webhook

If you want to keep the same URL (`/api/webhook/whatsapp`):

### Step 1: Backup Old Route (Optional)
```bash
cp src/app/api/webhook/whatsapp/route.ts src/app/api/webhook/whatsapp/route.ts.backup
```

### Step 2: Replace with New Route
```bash
cp src/app/api/whatsapp/route.ts src/app/api/webhook/whatsapp/route.ts
```

### Step 3: Deploy
```bash
git add .
git commit -m "Replace webhook with lightweight version"
git push
```

---

## Option 3: Keep Both (A/B Testing)

You can keep both webhooks and test them separately:

- **Old:** `https://todo-r17i.vercel.app/api/webhook/whatsapp`
- **New:** `https://todo-r17i.vercel.app/api/whatsapp`

Switch between them in Meta dashboard to compare.

---

## What Changes for Users?

### Before (Old Webhook):
```
User: "buy milk tomorrow"
Bot: ⏳
Bot: ✅
Bot: "✅ Task added: "buy milk"
      📅 Due: Thu, Dec 8
      🟡 Priority: medium"
```

### After (New Webhook):
```
User: "buy milk tomorrow"
Bot: ✅
```

**Much cleaner!** Tasks still created with all the same data, just simpler confirmation.

---

## Rollback Plan

If you need to rollback:

### Option A: Revert Git Commit
```bash
git revert HEAD
git push
```

### Option B: Change Webhook URL Back
In Meta dashboard, change webhook URL back to:
```
https://todo-r17i.vercel.app/api/webhook/whatsapp
```

The old route is still there, so this works immediately.

---

## Feature Comparison

| Feature | Old Webhook | New Webhook |
|---------|-------------|-------------|
| Creates tasks | ✅ | ✅ |
| AI parsing | ✅ | ✅ (improved) |
| Category detection | ❌ | ✅ |
| Always succeeds | ❌ (can reject) | ✅ |
| Response | Verbose | Minimal ✅ |
| Reactions | ⏳ → ✅/❌ | None |
| Commands (list, done) | ✅ | ❌ (simplified)* |
| Error handling | Good | Excellent |
| Performance | ~2-3s | ~1-2s |

*Note: Command support can be added back if needed

---

## Need Commands Back?

If you need the old command system (list, done, cancel, help), you can:

1. **Keep old webhook** at `/api/webhook/whatsapp` for commands
2. **Add new webhook** at `/api/whatsapp` for quick task creation
3. Let users choose which they prefer

Or merge the command logic into the new webhook (takes ~30 min).

---

## Testing Checklist

- [ ] Deploy changes
- [ ] Update webhook URL in Meta (if needed)
- [ ] Send test message: "buy milk"
- [ ] Verify task created in dashboard
- [ ] Check WhatsApp receives ✅ response
- [ ] Send test with date: "finish deck tomorrow"
- [ ] Verify due_date populated correctly
- [ ] Check category field is populated
- [ ] Test gibberish: "asdfgh" - should still create task
- [ ] Verify blue ticks appear (marked as read)

---

## Current Status

✅ New lightweight webhook created at `/app/api/whatsapp/route.ts`  
✅ Updated OpenAI parser with category support  
⏳ Old webhook still active at `/app/api/webhook/whatsapp/route.ts`  
⏳ Waiting for deployment and Meta webhook update  

**Next Step:** Choose Option 1, 2, or 3 above and deploy!

