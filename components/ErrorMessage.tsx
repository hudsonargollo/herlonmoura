import React from 'react';

interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  icon?: boolean;
}

export function ErrorMessage({
  message,
  icon = true,
  className = '',
  ...props
}: ErrorMessageProps) {
  const baseStyles = 'flex items-center gap-2 rounded-lg border border-error-red bg-error-red/10 px-4 py-3 text-sm text-error-red';
  const combinedClassName = `${baseStyles} ${className}`;

  return (
    <div className={combinedClassName} role="alert" {...props}>
      {icon && (
        <svg
          className="h-5 w-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span>{message}</span>
    </div>
  );
}
