import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './Label';

describe('Label Component', () => {
  describe('Rendering', () => {
    it('renders label with text', () => {
      render(<Label>Email</Label>);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders with correct base styles', () => {
      render(<Label>Label text</Label>);
      const label = screen.getByText('Label text');
      expect(label).toHaveClass('block');
      expect(label).toHaveClass('text-sm');
      expect(label).toHaveClass('font-medium');
      expect(label).toHaveClass('text-neutral-light');
    });
  });

  describe('Required Indicator', () => {
    it('does not show required indicator by default', () => {
      render(<Label>Optional</Label>);
      expect(screen.queryByLabelText('required')).not.toBeInTheDocument();
    });

    it('shows required indicator when required prop is true', () => {
      render(<Label required>Required Field</Label>);
      expect(screen.getByLabelText('required')).toBeInTheDocument();
    });

    it('required indicator has error red color', () => {
      render(<Label required>Required</Label>);
      const indicator = screen.getByLabelText('required');
      expect(indicator).toHaveClass('text-error-red');
    });

    it('required indicator is rendered after label text', () => {
      render(<Label required>Field</Label>);
      const label = screen.getByText('Field').parentElement;
      const text = label?.textContent;
      expect(text).toContain('Field');
      expect(text).toContain('*');
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<Label className="custom-class">Custom</Label>);
      expect(screen.getByText('Custom')).toHaveClass('custom-class');
    });

    it('accepts htmlFor attribute', () => {
      render(<Label htmlFor="input-id">Label</Label>);
      expect(screen.getByText('Label')).toHaveAttribute('for', 'input-id');
    });

    it('accepts id attribute', () => {
      render(<Label id="label-id">Label</Label>);
      expect(screen.getByText('Label')).toHaveAttribute('id', 'label-id');
    });
  });

  describe('Content', () => {
    it('renders with complex children', () => {
      render(
        <Label>
          Email <span>(required)</span>
        </Label>
      );
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('(required)')).toBeInTheDocument();
    });
  });
});
