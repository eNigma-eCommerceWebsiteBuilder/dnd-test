'use server';

import { ApiError } from '@/lib/api';
import {
  getDownloadUrl,
  getLicenseInfo,
} from '@/lib/api/services/digital-products';
import type { LicenseInfo } from '@/lib/api/types/digital-products';
import {
  ACTION_CACHE_TAGS,
  revalidateActionTags,
} from '@/lib/actions/internal/cache';
import {
  createErrorResult,
  createSuccessResult,
  getActionErrorMessage,
} from '@/lib/actions/internal/errors';
import type { ActionResult } from '@/lib/actions/types';
import {
  getExpiryInfo,
  hasDownloadsRemaining,
  isLicenseValid,
  isValidLicenseKeyFormat,
} from '@/lib/utils';

export interface LicenseValidationResult {
  license: LicenseInfo | null;
  isValid: boolean;
  canDownload: boolean;
  message: string;
}

export interface DownloadActionResult {
  downloadUrl: string;
  message: string;
}

function getLicenseValidationMessage(license: LicenseInfo): string {
  if (!license.isValid || !isLicenseValid(license)) {
    return 'License is not valid';
  }

  if (!hasDownloadsRemaining(license)) {
    return 'No downloads remaining';
  }

  const expiryInfo = getExpiryInfo(license);
  if (expiryInfo.isExpired) {
    return 'License has expired';
  }

  return 'License is valid for download';
}

export async function validateLicenseAction(
  licenseKey: string,
): Promise<ActionResult<LicenseValidationResult>> {
  try {
    const sanitizedKey = licenseKey.trim();
    if (!isValidLicenseKeyFormat(sanitizedKey)) {
      return createErrorResult('Invalid license key format');
    }

    const license = await getLicenseInfo(sanitizedKey);
    const validation: LicenseValidationResult = {
      license,
      isValid: isLicenseValid(license),
      canDownload: isLicenseValid(license) && hasDownloadsRemaining(license),
      message: getLicenseValidationMessage(license),
    };

    return createSuccessResult(validation);
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to validate license'));
  }
}

export async function downloadDigitalProductAction(
  licenseKey: string,
): Promise<ActionResult<DownloadActionResult>> {
  try {
    const validationResult = await validateLicenseAction(licenseKey);
    if (!validationResult.success || !validationResult.data?.canDownload) {
      return createErrorResult(validationResult.error ?? 'License is not valid for download');
    }

    const downloadUrl = getDownloadUrl(licenseKey.trim());
    revalidateActionTags([ACTION_CACHE_TAGS.digitalProducts, ACTION_CACHE_TAGS.licenses]);

    return createSuccessResult(
      {
        downloadUrl,
        message: 'Download ready',
      },
      { message: 'Download ready' },
    );
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to initiate download'));
  }
}

export async function checkMultipleLicensesAction(
  licenseKeys: string[],
): Promise<ActionResult<Record<string, LicenseValidationResult>>> {
  try {
    if (!Array.isArray(licenseKeys) || licenseKeys.length === 0) {
      return createErrorResult('At least one license key is required');
    }

    if (licenseKeys.length > 20) {
      return createErrorResult('Maximum 20 license keys per request');
    }

    const results: Record<string, LicenseValidationResult> = {};

    for (const licenseKey of licenseKeys) {
      const sanitizedKey = licenseKey.trim();
      if (!isValidLicenseKeyFormat(sanitizedKey)) {
        results[licenseKey] = {
          license: null,
          isValid: false,
          canDownload: false,
          message: 'Invalid license key format',
        };
        continue;
      }

      try {
        const license = await getLicenseInfo(sanitizedKey);
        results[licenseKey] = {
          license,
          isValid: isLicenseValid(license),
          canDownload: isLicenseValid(license) && hasDownloadsRemaining(license),
          message: getLicenseValidationMessage(license),
        };
      } catch (error: unknown) {
        results[licenseKey] = {
          license: null,
          isValid: false,
          canDownload: false,
          message: error instanceof ApiError ? error.message : 'Failed to validate license',
        };
      }
    }

    return createSuccessResult(results);
  } catch (error: unknown) {
    return createErrorResult(getActionErrorMessage(error, 'Failed to check licenses'));
  }
}
