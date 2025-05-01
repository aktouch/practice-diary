// src/components/ui/button.tsx
'use client';

import { ButtonHTMLAttributes } from 'react';

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${className || ''}`}
      {...props}
    />
  );
}
