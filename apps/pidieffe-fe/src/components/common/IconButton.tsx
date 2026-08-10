import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'default' | 'danger';
  children: ReactNode;
}

export function IconButton({ label, variant = 'default', children, className = '', ...props }: IconButtonProps) {
  const base = 'inline-flex cursor-pointer items-center justify-center rounded-lg p-2 transition-colors disabled:opacity-50';
  const variantClass =
    variant === 'danger'
      ? 'text-red-600 hover:bg-red-50'
      : 'text-neutral-600 hover:bg-neutral-200';

  return (
    <button
      aria-label={label}
      title={label}
      className={`${base} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
