'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop in editor
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
      aria-label="Copy license key"
    >
      <span className="material-symbols-outlined text-sm">
        {copied ? 'check' : 'content_copy'}
      </span>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
