import React from 'react';

export type CardVariant = 'standard' | 'glass';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  standard: 'border border-default bg-surface-raised shadow-lg',
  glass: 'glass-card',
};

export function Card({
  variant = 'standard',
  className = '',
  children,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-lg p-6 transition-all duration-300';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}
