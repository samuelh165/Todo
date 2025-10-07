#!/bin/bash

# Quick script to update WhatsApp access token in Vercel
# Run with: bash UPDATE_TOKEN.sh

echo "🔄 Updating WhatsApp Access Token in Vercel..."
echo ""

# New token
NEW_TOKEN="EAAVSwFSrtD0BPn3VZC9KUqv1rUAjDFhylQLwnEc8Ondrmv5HpzWYKAcyhsVZBTZBPygSCyDhrK8mKPn9hZCs4pcZBPXvczMwPBAv7irlZBkHGC9HZAlVXmn5MgpNQWfrfoIn3m6Hkfg46B8kPQ8GhyPd2OQqJOBA1ZAXU7BSvbifM5IVioyIav96ZBv3GMdEg9lZCM8xxLycgef9CKrDxdJxVKWAaxqNKQgruS1P4DhMD8cTZCtygZDZD"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not installed."
    echo ""
    echo "Please update the token manually:"
    echo "1. Go to https://vercel.com"
    echo "2. Open your project"
    echo "3. Settings → Environment Variables"
    echo "4. Edit WHATSAPP_ACCESS_TOKEN"
    echo "5. Paste: $NEW_TOKEN"
    echo "6. Save and redeploy"
    exit 1
fi

# Update environment variable
echo "Updating WHATSAPP_ACCESS_TOKEN..."
vercel env rm WHATSAPP_ACCESS_TOKEN production
vercel env add WHATSAPP_ACCESS_TOKEN production <<< "$NEW_TOKEN"

echo ""
echo "✅ Token updated!"
echo ""
echo "🚀 Now redeploy your app:"
echo "   vercel --prod"
echo ""
echo "Or go to https://vercel.com and click 'Redeploy' on your latest deployment"

