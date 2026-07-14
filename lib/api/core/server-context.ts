import { cookies as nextCookies } from 'next/headers';

export async function getServerCookies(): Promise<string> {
  try {
    const cookieStore = await nextCookies();

    return cookieStore
      .getAll()
      .map((cookie: { name: string; value: string }) => `${cookie.name}=${cookie.value}`)
      .join('; ');
  } catch {
    console.warn('getServerCookies called outside Server Component context');
    return '';
  }
}

export async function getServerAccessToken(): Promise<string | null> {
  return null;
}

export async function getServerRequestContext(): Promise<{
  cookies: string;
  accessToken?: string;
}> {
  const cookies = await getServerCookies();

  return { cookies };
}
