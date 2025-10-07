import { NextResponse } from 'next/server';

/**
 * Diagnostic endpoint to check if WhatsApp integration is properly configured
 * Access via: https://your-domain.com/api/diagnostic
 */
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    status: 'checking',
    checks: {} as Record<string, { status: 'ok' | 'error' | 'warning', message: string }>,
    recommendations: [] as string[],
  };

  // Check 1: WhatsApp Access Token
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!accessToken || accessToken === 'your_whatsapp_access_token') {
    diagnostics.checks.accessToken = {
      status: 'error',
      message: 'WHATSAPP_ACCESS_TOKEN is not set or using placeholder value',
    };
    diagnostics.recommendations.push('Set WHATSAPP_ACCESS_TOKEN in your environment variables');
  } else if (accessToken.length < 50) {
    diagnostics.checks.accessToken = {
      status: 'warning',
      message: 'Access token seems too short - might be invalid',
    };
    diagnostics.recommendations.push('Verify your WHATSAPP_ACCESS_TOKEN is correct');
  } else {
    diagnostics.checks.accessToken = {
      status: 'ok',
      message: `Token configured (${accessToken.length} chars)`,
    };
  }

  // Check 2: Phone Number ID
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!phoneNumberId || phoneNumberId === 'your_whatsapp_phone_number_id') {
    diagnostics.checks.phoneNumberId = {
      status: 'error',
      message: 'WHATSAPP_PHONE_NUMBER_ID is not set or using placeholder value',
    };
    diagnostics.recommendations.push('Set WHATSAPP_PHONE_NUMBER_ID in your environment variables');
  } else {
    diagnostics.checks.phoneNumberId = {
      status: 'ok',
      message: `Phone Number ID configured: ${phoneNumberId}`,
    };
  }

  // Check 3: Verify Token
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  if (!verifyToken || verifyToken === 'your_custom_verify_token') {
    diagnostics.checks.verifyToken = {
      status: 'error',
      message: 'WHATSAPP_VERIFY_TOKEN is not set or using placeholder value',
    };
    diagnostics.recommendations.push('Set WHATSAPP_VERIFY_TOKEN in your environment variables');
  } else {
    diagnostics.checks.verifyToken = {
      status: 'ok',
      message: 'Verify token configured',
    };
  }

  // Check 4: OpenAI API Key
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey || openaiKey === 'your_openai_api_key') {
    diagnostics.checks.openai = {
      status: 'error',
      message: 'OPENAI_API_KEY is not set or using placeholder value',
    };
    diagnostics.recommendations.push('Set OPENAI_API_KEY from https://platform.openai.com/api-keys');
  } else if (!openaiKey.startsWith('sk-')) {
    diagnostics.checks.openai = {
      status: 'warning',
      message: 'OpenAI key format looks incorrect (should start with sk-)',
    };
    diagnostics.recommendations.push('Verify your OPENAI_API_KEY is correct');
  } else {
    diagnostics.checks.openai = {
      status: 'ok',
      message: 'OpenAI API key configured',
    };
  }

  // Check 5: Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
    diagnostics.checks.supabase = {
      status: 'error',
      message: 'NEXT_PUBLIC_SUPABASE_URL is not set or using placeholder value',
    };
    diagnostics.recommendations.push('Set NEXT_PUBLIC_SUPABASE_URL in your environment variables');
  } else {
    diagnostics.checks.supabase = {
      status: 'ok',
      message: `Supabase URL configured: ${supabaseUrl}`,
    };
  }

  // Check 6: Supabase Keys
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
    diagnostics.checks.supabaseAuth = {
      status: 'error',
      message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set',
    };
    diagnostics.recommendations.push('Set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables');
  } else if (!supabaseServiceKey || supabaseServiceKey === 'your_supabase_service_role_key') {
    diagnostics.checks.supabaseAuth = {
      status: 'error',
      message: 'SUPABASE_SERVICE_ROLE_KEY is not set',
    };
    diagnostics.recommendations.push('Set SUPABASE_SERVICE_ROLE_KEY in your environment variables');
  } else {
    diagnostics.checks.supabaseAuth = {
      status: 'ok',
      message: 'Supabase authentication keys configured',
    };
  }

  // Determine overall status
  const hasErrors = Object.values(diagnostics.checks).some(check => check.status === 'error');
  const hasWarnings = Object.values(diagnostics.checks).some(check => check.status === 'warning');
  
  if (hasErrors) {
    diagnostics.status = 'error';
  } else if (hasWarnings) {
    diagnostics.status = 'warning';
  } else {
    diagnostics.status = 'ok';
  }

  // Add webhook configuration info
  const webhookUrl = process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/whatsapp`
    : 'Not configured - set NEXT_PUBLIC_APP_URL';

  const setupInstructions = {
    webhookUrl,
    verifyToken: verifyToken || 'Not configured',
    nextSteps: diagnostics.recommendations,
  };

  // Test WhatsApp API connection if credentials are available
  if (accessToken && phoneNumberId && accessToken.length > 50) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        diagnostics.checks.whatsappConnection = {
          status: 'ok',
          message: `Connected to WhatsApp number: ${data.display_phone_number || 'Unknown'}`,
        };
      } else {
        const error = await response.text();
        diagnostics.checks.whatsappConnection = {
          status: 'error',
          message: `WhatsApp API connection failed: ${error}`,
        };
        diagnostics.recommendations.push('Check your WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID');
      }
    } catch (error) {
      diagnostics.checks.whatsappConnection = {
        status: 'error',
        message: `Network error connecting to WhatsApp API: ${error}`,
      };
    }
  }

  return NextResponse.json({
    ...diagnostics,
    setup: setupInstructions,
    docs: 'See TROUBLESHOOTING_BLUE_TICKS.md for detailed setup instructions',
  }, {
    status: hasErrors ? 500 : 200,
  });
}

