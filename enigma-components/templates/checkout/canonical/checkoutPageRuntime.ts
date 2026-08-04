import { auth } from '@/auth';
import { getServerCookies } from '@/lib/api/core/server';
import { getCart } from '@/lib/api/services/cart';
import type { Cart } from '@/lib/api/types/cart';

export interface CheckoutPageData {
  cart: Cart | null;
  initialEmail?: string;
}

// Shared by the native route and the Puck server adapter. Puck supplies the
// request cookie string through render metadata instead of next/headers.
export async function fetchCheckoutPageData(
  requestCookies?: string,
): Promise<CheckoutPageData> {
  let cart: Cart | null = null;
  const cookies = requestCookies ?? await getServerCookies();
  const session = await auth();

  try {
    cart = await getCart({ cookies });
  } catch (error) {
    console.error('Error fetching checkout data:', error);
  }

  return {
    cart,
    initialEmail: session?.user?.email ?? undefined,
  };
}
