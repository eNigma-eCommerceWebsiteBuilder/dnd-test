'use client';

interface CountryOption {
  code: string;
  name: string;
}

interface CountrySelectorProps {
  value: string;
  error?: string;
  options: CountryOption[];
  onChange: (value: string) => void;
}

/**
 * Country Selector
 *
 * Per PAGE_AND_COMPONENTS_PLAN.md Section 2.3:
 * - Must include @container on root element.
 */
export function CountrySelector({ value, error, options, onChange }: CountrySelectorProps) {
  return (
    <label className="@container w-full flex flex-col gap-2 text-sm font-medium text-text-base">
      Country
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-input border border-input-border bg-input-bg px-3 py-2 text-sm text-text-base shadow-input transition-colors focus:border-input-border-focus focus:outline-none focus:ring-1 focus:ring-input-border-focus focus:shadow-input-focus hover:border-input-border-focus"
      >
        <option value="">Select country</option>
        {options.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
