import { buildAuthPath } from '@/lib/auth/return-url';

// Published Puck pages live beneath /page, unlike TemplateFrontend's native routes.
export function buildPublishedPuckAuthPath(returnUrl: string): string {
  return `/page${buildAuthPath(returnUrl)}`;
}
