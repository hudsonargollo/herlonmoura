import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage Component', () => {
  describe('Rendering', () => {
    it('renders error message', () => {
      render(<ErrorMessage message="This is an error" />);
      expect(screen.getByText('This is an error')).toBeInTheDocument();
    });

    it('renders with correct base styles', () => {
      render(<ErrorMessage message="Error" />);
      const container = screen.getByRole('alert');
      expect(container).toHaveClass('flex');
      expect(container).toHaveClass('items-center');
      expect(container).toHaveClass('gap-2');
      expect(container).toHaveClass('rounded-lg');
      expect(container).toHaveClass('border-error-red');
      expect(container).toHaveClass('bg-error-red/10');
      expect(container).toHaveClass('text-error-red');
    });

    it('renders with alert role', () => {
      render(<ErrorMessage message="Alert message" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Icon', () => {
    it('renders icon by default', () => {
      render(<ErrorMessage message="Error" />);
      const svg = screen.getByRole('alert').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('does not render icon when icon prop is false', () => {
      render(<ErrorMessage message="Error" icon={false} />);
      const svg = screen.getByRole('alert').querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('icon has correct dimensions', () => {
      render(<ErrorMessage message="Error" />);
      const svg = screen.getByRole('alert').querySelector('svg');
      expect(svg).toHaveClass('h-5');
      expect(svg).toHaveClass('w-5');
    });

    it('icon has aria-hidden attribute', () => {
      render(<ErrorMessage message="Error" />);
      const svg = screen.getByRole('alert').querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<ErrorMessage message="Error" className="custom-class" />);
      expect(screen.getByRole('alert')).toHaveClass('custom-class');
    });

    it('accepts HTML div attributes', () => {
      render(<ErrorMessage message="Error" data-testid="custom-error" />);
      expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    });

    it('accepts id attribute', () => {
      render(<ErrorMessage message="Error" id="error-id" />);
      expect(screen.getByRole('alert')).toHaveAttribute('id', 'error-id');
    });
  });

  describe('Accessibility', () => {
    it('has alert role for screen readers', () => {
      render(<ErrorMessage message="Validation error" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('displays message text for screen readers', () => {
      render(<ErrorMessage message="Please fill in all required fields" />);
      expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
    });
  });

  describe('Message Content', () => {
    it('renders different error messages', () => {
      const { rerender } = render(<ErrorMessage message="Error 1" />);
      expect(screen.getByText('Error 1')).toBeInTheDocument();

      rerender(<ErrorMessage message="Error 2" />);
      expect(screen.getByText('Error 2')).toBeInTheDocument();
      expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
    });

    it('renders long error messages', () => {
      const longMessage = 'This is a very long error message that explains what went wrong in detail';
      render(<ErrorMessage message={longMessage} />);
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });
});
