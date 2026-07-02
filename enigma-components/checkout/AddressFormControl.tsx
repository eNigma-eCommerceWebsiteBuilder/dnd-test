import type { HTMLInputTypeAttribute } from 'react';
import { cn } from '@/lib/utils/cn';

interface AddressFormOption {
  label: string;
  value: string;
}

interface AddressFormControlProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
  error?: string;
  showError?: boolean;
  optional?: boolean;
  options?: AddressFormOption[];
  inputClassName: string;
  className?: string;
}

export function AddressFormControl({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  showError = false,
  optional = false,
  options,
  inputClassName,
  className,
}: AddressFormControlProps) {
  const control = options ? (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      className={inputClassName}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ) : (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={inputClassName}
    />
  );

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-text-base">
        {label}
        {optional ? <span className="text-text-muted"> (optional)</span> : null}
      </label>
      {control}
      {showError && error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
