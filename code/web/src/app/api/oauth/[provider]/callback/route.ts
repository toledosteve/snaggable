import { NextResponse } from 'next/server';
import { exchangeOAuthToken } from '@/lib/oauth/utils/exchangeToken';

async function processOAuthCallback(req: Request, provider: string, code: string) {
  try {
    const result = await exchangeOAuthToken(provider, code);
    console.log('OAuth Callback Result:', result);

    if (result.success) {
      await passTokenToAuthApi(provider, result.accessToken, result.idToken);
      const baseUrl = process.env.BASE_URL || new URL(req.url).origin;
      return NextResponse.redirect(`${baseUrl}/app/discover`, { status: 302 });
    }

    return NextResponse.json({ error: result.error, details: result.details }, { status: result.status });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

async function passTokenToAuthApi(provider: string, accessToken: string, idToken: string): Promise<any> {
  const response = await fetch(`${process.env.API_ENDPOINT}/auth/social`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },  
    body: JSON.stringify({ 
      "loginMethod": provider,
      "accessToken": accessToken,
      "idToken": idToken,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(`Token verification failed: ${JSON.stringify(errorDetails.error)}`);
  }

  return response.json();
}

async function getCode(req: Request): Promise<string | null> {
  if (req.method === 'GET') {
    const url = new URL(req.url);
    return url.searchParams.get('code');
  }

  if (req.method === 'POST') {
    const formData = await req.formData();
    return formData.get('code') as string | null;
  }

  return null;
}

// Main route handler
export async function GET(req: Request, context: { params: { provider?: string } }) {
  return handleOAuthCallback(req, context);
}

export async function POST(req: Request, context: { params: { provider?: string } }) {
  return handleOAuthCallback(req, context);
}

async function handleOAuthCallback(req: Request, context: { params: { provider?: string } }) {
  const params = await context.params;
  const provider = params.provider;

  if (!provider) {
    return NextResponse.json({ error: 'Missing provider' }, { status: 400 });
  }

  const code = await getCode(req);

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  return processOAuthCallback(req, provider, code);
}
