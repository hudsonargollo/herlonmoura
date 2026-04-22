import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const sizeStyles: Record<string, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  full: 'max-w-full',
};

export function Container({
  size = 'lg',
  className = '',
  children,
  ...props
}: ContainerProps) {
  const baseStyles = 'mx-auto w-full px-lg';
  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${className}`;

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}
