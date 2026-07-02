'use client';

interface CheckoutErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export function CheckoutErrorAlert({
  message,
  onDismiss,
}: CheckoutErrorAlertProps) {
  return (
    <div className="rounded-card border border-danger bg-danger-subtle p-4">
      <p className="font-medium text-danger">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-2 text-sm text-danger underline"
      >
        Dismiss
      </button>
    </div>
  );
}
