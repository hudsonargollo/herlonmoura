import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('renders card with children', () => {
      render(<Card data-testid="card">Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders with standard variant by default', () => {
      render(<Card data-testid="card">Standard</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-neutral-dark');
    });

    it('renders with glass variant', () => {
      render(<Card variant="glass" data-testid="card">Glass</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('glass-card');
    });

    it('renders with correct base styles', () => {
      render(<Card data-testid="card">Base styles</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('p-6');
      expect(card).toHaveClass('transition-all');
    });
  });

  describe('Variants', () => {
    it('standard variant has border and shadow', () => {
      render(<Card variant="standard" data-testid="card">Standard</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('shadow-lg');
    });

    it('glass variant has glass-card class', () => {
      render(<Card variant="glass" data-testid="card">Glass</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('glass-card');
    });
  });

  describe('Custom Props', () => {
    it('accepts custom className', () => {
      render(<Card className="custom-class" data-testid="card">Custom</Card>);
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });

    it('accepts HTML div attributes', () => {
      render(<Card data-testid="custom-card">Data attr</Card>);
      expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    });

    it('accepts id attribute', () => {
      render(<Card id="my-card" data-testid="card">ID test</Card>);
      expect(screen.getByTestId('card')).toHaveAttribute('id', 'my-card');
    });
  });

  describe('Content', () => {
    it('renders multiple children', () => {
      render(
        <Card>
          <h3>Title</h3>
          <p>Description</p>
        </Card>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('renders complex nested content', () => {
      render(
        <Card>
          <div>
            <span>Nested</span>
          </div>
        </Card>
      );
      expect(screen.getByText('Nested')).toBeInTheDocument();
    });
  });
});
