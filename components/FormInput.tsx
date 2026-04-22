import React from 'react';

export type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'time';
export type InputState = 'default' | 'error' | 'success';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: InputState;
  errorMessage?: string;
  successMessage?: string;
  label?: string;
  helperText?: string;
}

const stateStyles: Record<InputState, string> = {
  default: 'border-neutral-medium focus:border-surgical-teal',
  error: 'border-error-red focus:border-error-red',
  success: 'border-success-green focus:border-success-green',
};

export function FormInput({
  state = 'default',
  errorMessage,
  successMessage,
  label,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}: FormInputProps) {
  const baseStyles = 'w-full rounded-lg border-2 bg-dark-elevated px-4 py-3 text-neutral-light placeholder-neutral-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-surgical-teal focus-visible:ring-offset-2 focus-visible:ring-offset-dark-elevated disabled:opacity-50 disabled:cursor-not-allowed';
  
  const combinedClassName = `${baseStyles} ${stateStyles[state]} ${className}`;
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-neutral-light">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={combinedClassName}
        {...props}
      />
      {helperText && !errorMessage && !successMessage && (
        <p className="mt-1 text-xs text-neutral-medium">{helperText}</p>
      )}
      {errorMessage && (
        <p className="mt-1 text-xs text-error-red">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mt-1 text-xs text-success-green">{successMessage}</p>
      )}
    </div>
  );
}
