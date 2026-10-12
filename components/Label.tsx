import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

export function Label({
  required = false,
  className = '',
  children,
  ...props
}: LabelProps) {
  const baseStyles = 'block text-sm font-medium text-neutral-light';
  const combinedClassName = `${baseStyles} ${className}`;

  return (
    <label className={combinedClassName} {...props}>
      {children}
      {required && <span className="ml-1 text-error-red" aria-label="required">*</span>}
    </label>
  );
}
