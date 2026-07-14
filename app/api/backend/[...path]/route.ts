import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const WEBSITE_ID = process.env.WEBSITE_ID || process.env.NEXT_PUBLIC_WEBSITE_ID;

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyBackendRequest(request, context);
}

async function proxyBackendRequest(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const targetUrl = new URL(`${BACKEND_API_BASE_URL}/${path.join('/')}`);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  const cookie = request.headers.get('cookie');
  const csrfToken = request.headers.get('x-csrf-token');

  if (contentType) headers.set('content-type', contentType);
  if (cookie) headers.set('cookie', cookie);
  if (csrfToken) headers.set('x-csrf-token', csrfToken);
  if (WEBSITE_ID) headers.set('x-website-id', WEBSITE_ID);

  const backendResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: shouldForwardBody(request.method) ? await request.text() : undefined,
    cache: 'no-store',
  });
  const body = await backendResponse.arrayBuffer();
  const responseHeaders = new Headers();

  copyResponseHeader(backendResponse.headers, responseHeaders, 'content-type');
  copyResponseHeader(backendResponse.headers, responseHeaders, 'cache-control');
  copySetCookieHeaders(backendResponse.headers, responseHeaders);

  return new NextResponse(body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}

function shouldForwardBody(method: string) {
  return method !== 'GET' && method !== 'HEAD';
}

function copyResponseHeader(from: Headers, to: Headers, name: string) {
  const value = from.get(name);
  if (value) to.set(name, value);
}

function copySetCookieHeaders(from: Headers, to: Headers) {
  const getSetCookie = (from as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  const cookies = typeof getSetCookie === 'function'
    ? getSetCookie.call(from)
    : splitCombinedSetCookie(from.get('set-cookie'));

  for (const cookie of cookies) {
    to.append('set-cookie', cookie);
  }
}

function splitCombinedSetCookie(header: string | null): string[] {
  if (!header) return [];
  return header.split(/,(?=\s*[^;,]+=)/g).map((cookie) => cookie.trim());
}
