import * as path from 'path';

export interface DelegateProfile {
  sourceImportPath: string;
  sourceFile: string;
  exportName: string;
  sourceOverrideEnv?: string;
}

export interface RouteProfile {
  id: string;
  requiredRootRole: string;
  rootWrapperRole?: string;
  delegates?: DelegateProfile[];
  allowNoJsx?: boolean;
}

const profiles: Record<string, RouteProfile> = {
  home: {
    id: 'home',
    requiredRootRole: 'home-page-layout',
    rootWrapperRole: 'home-page-layout',
  },
  products: { id: 'products', requiredRootRole: 'catalog-layout' },
  'product-detail': { id: 'product-detail', requiredRootRole: 'product-detail-layout' },
  categories: { id: 'categories', requiredRootRole: 'categories-page-layout' },
  'category-detail': { id: 'category-detail', requiredRootRole: 'category-catalog-layout' },
  search: { id: 'search', requiredRootRole: 'search-page-layout' },
  collections: { id: 'collections', requiredRootRole: 'collections-page-layout' },
  'collection-detail': { id: 'collection-detail', requiredRootRole: 'collection-detail-page-state' },
  cart: {
    id: 'cart',
    requiredRootRole: 'cart-page-state',
    delegates: [
      delegate('@/components/templates/cart/CartPageClient', 'components/templates/cart/CartPageClient.tsx', 'default'),
    ],
  },
  'shared-wishlist': { id: 'shared-wishlist', requiredRootRole: 'shared-wishlist-page-state' },
  checkout: {
    id: 'checkout',
    requiredRootRole: 'checkout-page-state',
    delegates: [
      delegate('@/components/templates/checkout/CheckoutPageClient', 'components/templates/checkout/CheckoutPageClient.tsx', 'default'),
    ],
  },
  'checkout-success': { id: 'checkout-success', requiredRootRole: 'checkout-success-page-state' },
  downloads: {
    id: 'downloads',
    requiredRootRole: 'download-page-layout',
    delegates: [
      delegate('@/components/templates/downloads/DownloadPage', 'components/templates/downloads/DownloadPage.tsx', 'DownloadPage'),
    ],
  },
  auth: { id: 'auth', requiredRootRole: 'auth-page-state' },
  'auth-complete': { id: 'auth-complete', requiredRootRole: 'auth-complete-redirect-state', allowNoJsx: true },
  'auth-storefront-account': { id: 'auth-storefront-account', requiredRootRole: 'storefront-account-page-state' },
  'policies-privacy': { id: 'policies-privacy', requiredRootRole: 'privacy-policy-page-state' },
  'policies-terms': { id: 'policies-terms', requiredRootRole: 'terms-policy-page-state' },
  account: {
    id: 'account',
    requiredRootRole: 'account-dashboard-page-layout',
    delegates: [
      delegate('@/components/account/dashboard/canonical/AccountDashboardPage', 'components/account/dashboard/canonical/AccountDashboardPage.tsx', 'AccountDashboardPage', 'ACCOUNT_DASHBOARD_PAGE_SOURCE'),
    ],
  },
  'account-orders': { id: 'account-orders', requiredRootRole: 'account-orders-layout' },
  'account-order-detail': {
    id: 'account-order-detail',
    requiredRootRole: 'order-details-page-state',
    delegates: [
      delegate('@/components/orders/canonical/OrderDetailsPage', 'components/orders/canonical/OrderDetailsPage.tsx', 'OrderDetailsPage', 'ORDER_DETAILS_CANONICAL_SOURCE'),
    ],
  },
  'account-order-downloads': {
    id: 'account-order-downloads',
    requiredRootRole: 'order-downloads-page-state',
    delegates: [
      delegate('@/components/orders/canonical/OrderDownloadsPage', 'components/orders/canonical/OrderDownloadsPage.tsx', 'OrderDownloadsPage', 'ORDER_DOWNLOADS_CANONICAL_SOURCE'),
    ],
  },
  'account-order-return': {
    id: 'account-order-return',
    requiredRootRole: 'order-return-page-state',
    delegates: [
      delegate('@/components/returns/canonical/OrderReturnPage', 'components/returns/canonical/OrderReturnPage.tsx', 'OrderReturnPage', 'ORDER_RETURN_CANONICAL_SOURCE'),
    ],
  },
  'account-wishlist': {
    id: 'account-wishlist',
    requiredRootRole: 'account-wishlist-page-layout',
    delegates: [
      delegate('@/components/wishlist/canonical/WishlistPage', 'components/wishlist/canonical/WishlistPage.tsx', 'WishlistPage', 'ACCOUNT_WISHLIST_PAGE_SOURCE'),
    ],
  },
  'account-subscriptions': {
    id: 'account-subscriptions',
    requiredRootRole: 'account-subscriptions-page-layout',
    delegates: [
      delegate('@/components/subscriptions/canonical/SubscriptionsPage', 'components/subscriptions/canonical/SubscriptionsPage.tsx', 'SubscriptionsPage'),
      delegate('@/components/subscriptions/SubscriptionList', 'components/subscriptions/SubscriptionList.tsx', 'SubscriptionList', 'ACCOUNT_SUBSCRIPTIONS_LIST_SOURCE'),
    ],
  },
  'account-subscription-detail': {
    id: 'account-subscription-detail',
    requiredRootRole: 'subscription-details-page-state',
    delegates: [
      delegate('@/components/subscriptions/canonical/SubscriptionDetailsPage', 'components/subscriptions/canonical/SubscriptionDetailsPage.tsx', 'SubscriptionDetailsPage', 'SUBSCRIPTION_DETAILS_CANONICAL_SOURCE'),
    ],
  },
  'account-addresses': {
    id: 'account-addresses',
    requiredRootRole: 'addresses-page-state',
    delegates: [
      delegate('@/components/addresses/canonical/AddressesPage', 'components/addresses/canonical/AddressesPage.tsx', 'AddressesPage', 'ADDRESSES_CANONICAL_SOURCE'),
    ],
  },
  'account-settings': { id: 'account-settings', requiredRootRole: 'account-settings-layout' },
  'account-sessions': {
    id: 'account-sessions',
    requiredRootRole: 'account-sessions-page-layout',
    delegates: [
      delegate('@/components/account/sessions/canonical/AccountSessionsPage', 'components/account/sessions/canonical/AccountSessionsPage.tsx', 'AccountSessionsPage', 'ACCOUNT_SESSIONS_PAGE_SOURCE'),
    ],
  },
  'account-downloads': {
    id: 'account-downloads',
    requiredRootRole: 'account-downloads-page-layout',
    delegates: [
      delegate('@/components/account/downloads/canonical/DigitalLibraryPage', 'components/account/downloads/canonical/DigitalLibraryPage.tsx', 'DigitalLibraryPage'),
      delegate('@/components/account/downloads/DigitalLibrary', 'components/account/downloads/DigitalLibrary.tsx', 'DigitalLibrary', 'ACCOUNT_DOWNLOADS_LIBRARY_SOURCE'),
    ],
  },
  'account-returns': {
    id: 'account-returns',
    requiredRootRole: 'returns-page-layout',
    delegates: [
      delegate('@/components/returns/canonical/ReturnsPage', 'components/returns/canonical/ReturnsPage.tsx', 'ReturnsPage'),
      delegate('@/components/returns/ReturnsList', 'components/returns/ReturnsList.tsx', 'ReturnsList', 'ACCOUNT_RETURNS_LIST_SOURCE'),
    ],
  },
  'account-return-detail': {
    id: 'account-return-detail',
    requiredRootRole: 'return-details-page-state',
    delegates: [
      delegate('@/components/returns/canonical/ReturnDetailsPage', 'components/returns/canonical/ReturnDetailsPage.tsx', 'ReturnDetailsPage', 'RETURN_DETAILS_CANONICAL_SOURCE'),
    ],
  },
};

function delegate(
  sourceImportPath: string,
  sourceFile: string,
  exportName: string,
  sourceOverrideEnv?: string,
): DelegateProfile {
  return { sourceImportPath, sourceFile, exportName, sourceOverrideEnv };
}

export function getRouteProfile(pageKey: string): RouteProfile | null {
  const profile = profiles[pageKey];
  if (!profile) return null;
  return {
    ...profile,
    rootWrapperRole: profile.rootWrapperRole || profile.requiredRootRole,
  };
}

export function resolveDelegateSource(projectRoot: string, profile: DelegateProfile): string {
  const override = profile.sourceOverrideEnv ? process.env[profile.sourceOverrideEnv] : undefined;
  return override ? path.resolve(override) : path.resolve(projectRoot, profile.sourceFile);
}

export const routeProfileKeys = Object.freeze(Object.keys(profiles));
