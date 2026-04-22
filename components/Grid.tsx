import React from 'react';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: number;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

const gapStyles: Record<string, string> = {
  sm: 'gap-md',
  md: 'gap-lg',
  lg: 'gap-xl',
  xl: 'gap-2xl',
};

export function Grid({
  cols = 3,
  gap = 'lg',
  responsive = true,
  className = '',
  children,
  ...props
}: GridProps) {
  const colsClass = `grid-cols-${cols}`;
  const responsiveClass = responsive
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    : colsClass;
  const baseStyles = 'grid';
  const combinedClassName = `${baseStyles} ${responsiveClass} ${gapStyles[gap]} ${className}`;

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}
