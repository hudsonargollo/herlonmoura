import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormInput } from './FormInput';

describe('FormInput Component', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<FormInput />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<FormInput label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<FormInput placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with different input types', () => {
      const { rerender } = render(<FormInput type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

      rerender(<FormInput type="password" />);
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');

      rerender(<FormInput type="tel" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel');
    });
  });

  describe('States', () => {
    it('renders with default state', () => {
      render(<FormInput />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-neutral-medium');
    });

    it('renders with error state', () => {
      render(<FormInput state="error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-error-red');
    });

    it('renders with success state', () => {
      render(<FormInput state="success" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-success-green');
    });

    it('displays error message', () => {
      render(<FormInput state="error" errorMessage="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('displays success message', () => {
      render(<FormInput state="success" successMessage="Valid input" />);
      expect(screen.getByText('Valid input')).toBeInTheDocument();
    });

    it('displays helper text', () => {
      render(<FormInput helperText="Enter a valid email" />);
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('associates label with input', () => {
      render(<FormInput label="Username" />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    it('generates unique id when not provided', () => {
      const { rerender } = render(<FormInput label="Field 1" />);
      const input1 = screen.getByLabelText('Field 1');
      const id1 = input1.id;

      rerender(<FormInput label="Field 2" />);
      const input2 = screen.getByLabelText('Field 2');
      const id2 = input2.id;

      expect(id1).not.toBe(id2);
    });

    it('uses provided id', () => {
      render(<FormInput id="custom-id" label="Custom" />);
      expect(screen.getByLabelText('Custom')).toHaveAttribute('id', 'custom-id');
    });

    it('has focus visible styles', () => {
      render(<FormInput />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus-visible:ring-2');
    });

    it('displays error message with proper styling', () => {
      render(<FormInput state="error" errorMessage="Error" />);
      const errorMsg = screen.getByText('Error');
      expect(errorMsg).toHaveClass('text-error-red');
    });
  });

  describe('Disabled State', () => {
    it('renders disabled input', () => {
      render(<FormInput disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('has disabled styling', () => {
      render(<FormInput disabled />);
      expect(screen.getByRole('textbox')).toHaveClass('disabled:opacity-50');
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<FormInput className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('accepts HTML input attributes', () => {
      render(<FormInput required minLength={5} maxLength={20} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('minlength', '5');
      expect(input).toHaveAttribute('maxlength', '20');
    });
  });
});
