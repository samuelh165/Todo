# ⚠️ IMPORTANT - Add Your OpenAI API Key

## Step 1: Edit .env.local

Open the file: `.env.local` in your code editor

Find this line at the bottom:
```
OPENAI_API_KEY=ADD_YOUR_OPENAI_KEY_HERE
```

Replace `ADD_YOUR_OPENAI_KEY_HERE` with your actual OpenAI API key (starts with `sk-proj-...`)

**IMPORTANT**: 
- DO NOT commit this file to git (it's in .gitignore)
- DO NOT share this key publicly
- This is for LOCAL development only

## Step 2: Restart Dev Server

After saving .env.local:
1. Stop the dev server (Ctrl+C in terminal)
2. Restart it: `npm run dev`

## Step 3: Test Locally

1. Go to: http://localhost:3001/dashboard
2. Add a task: "I need to review the Q4 report and send feedback by Friday"
3. You should see AI-generated title and formatting!

## For Production (Vercel)

You already added the key to Vercel environment variables, so production should work after the redeployment finishes.

---

**Next Steps:**
1. Edit `.env.local` and add your real OpenAI key
2. Restart `npm run dev`
3. Test at http://localhost:3001/dashboard

