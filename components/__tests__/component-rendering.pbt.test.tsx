import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { Button, Card, FormInput, Label, ErrorMessage } from '../index';

/**
 * Property-Based Tests for Component Rendering
 * **Validates: Requirements 6.1, 6.2**
 *
 * These tests verify that all UI components render correctly with required content
 * across a wide range of input variations.
 */

describe('Component Rendering - Property-Based Tests', () => {
  describe('Button Component Rendering', () => {
    it('should render button with any text content', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (text) => {
          render(<Button>{text}</Button>);
          expect(screen.getByRole('button', { name: text })).toBeInTheDocument();
        })
      );
    });

    it('should render button with all valid variants', () => {
      const variants = ['primary', 'secondary', 'ghost'] as const;
      fc.assert(
        fc.property(fc.constantFrom(...variants), (variant) => {
          render(<Button variant={variant}>Test</Button>);
          expect(screen.getByRole('button')).toBeInTheDocument();
        })
      );
    });

    it('should render button with all valid sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      fc.assert(
        fc.property(fc.constantFrom(...sizes), (size) => {
          render(<Button size={size}>Test</Button>);
          expect(screen.getByRole('button')).toBeInTheDocument();
        })
      );
    });

    it('should maintain button functionality with any combination of props', () => {
      const variants = ['primary', 'secondary', 'ghost'] as const;
      const sizes = ['sm', 'md', 'lg'] as const;

      fc.assert(
        fc.property(
          fc.constantFrom(...variants),
          fc.constantFrom(...sizes),
          fc.boolean(),
          (variant, size, disabled) => {
            render(
              <Button variant={variant} size={size} disabled={disabled}>
                Test
              </Button>
            );
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
            if (disabled) {
              expect(button).toBeDisabled();
            }
          }
        )
      );
    });
  });

  describe('Card Component Rendering', () => {
    it('should render card with any text content', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (text) => {
          render(<Card>{text}</Card>);
          expect(screen.getByText(text)).toBeInTheDocument();
        })
      );
    });

    it('should render card with all valid variants', () => {
      const variants = ['standard', 'glass'] as const;
      fc.assert(
        fc.property(fc.constantFrom(...variants), (variant) => {
          render(<Card variant={variant} data-testid="card">Test</Card>);
          expect(screen.getByTestId('card')).toBeInTheDocument();
        })
      );
    });

    it('should render card with multiple children', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }), (texts) => {
          render(
            <Card>
              {texts.map((text, i) => (
                <div key={i}>{text}</div>
              ))}
            </Card>
          );
          texts.forEach((text) => {
            expect(screen.getByText(text)).toBeInTheDocument();
          });
        })
      );
    });
  });

  describe('FormInput Component Rendering', () => {
    it('should render input with any placeholder text', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (placeholder) => {
          render(<FormInput placeholder={placeholder} />);
          expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
        })
      );
    });

    it('should render input with all valid types', () => {
      const types = ['text', 'email', 'password', 'tel', 'number', 'date', 'time'] as const;
      fc.assert(
        fc.property(fc.constantFrom(...types), (type) => {
          render(<FormInput type={type} />);
          expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
        })
      );
    });

    it('should render input with all valid states', () => {
      const states = ['default', 'error', 'success'] as const;
      fc.assert(
        fc.property(fc.constantFrom(...states), (state) => {
          render(<FormInput state={state} />);
          expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
        })
      );
    });

    it('should render input with label and error message', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc.string({ minLength: 1 }),
          (label, error) => {
            render(<FormInput label={label} state="error" errorMessage={error} />);
            expect(screen.getByLabelText(label)).toBeInTheDocument();
            expect(screen.getByText(error)).toBeInTheDocument();
          }
        )
      );
    });
  });

  describe('Label Component Rendering', () => {
    it('should render label with any text content', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (text) => {
          render(<Label>{text}</Label>);
          expect(screen.getByText(text)).toBeInTheDocument();
        })
      );
    });

    it('should render required indicator when required prop is true', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (text) => {
          render(<Label required>{text}</Label>);
          expect(screen.getByLabelText('required')).toBeInTheDocument();
        })
      );
    });

    it('should not render required indicator when required prop is false', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (text) => {
          render(<Label required={false}>{text}</Label>);
          expect(screen.queryByLabelText('required')).not.toBeInTheDocument();
        })
      );
    });
  });

  describe('ErrorMessage Component Rendering', () => {
    it('should render error message with any text', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (message) => {
          render(<ErrorMessage message={message} />);
          expect(screen.getByText(message)).toBeInTheDocument();
        })
      );
    });

    it('should render error message with alert role', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (message) => {
          render(<ErrorMessage message={message} />);
          expect(screen.getByRole('alert')).toBeInTheDocument();
        })
      );
    });

    it('should render icon by default', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (message) => {
          render(<ErrorMessage message={message} />);
          const svg = screen.getByRole('alert').querySelector('svg');
          expect(svg).toBeInTheDocument();
        })
      );
    });

    it('should not render icon when icon prop is false', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (message) => {
          render(<ErrorMessage message={message} icon={false} />);
          const svg = screen.getByRole('alert').querySelector('svg');
          expect(svg).not.toBeInTheDocument();
        })
      );
    });
  });

  describe('Component Consistency', () => {
    it('should render same component consistently with same props', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (text) => {
          const { rerender } = render(<Button>{text}</Button>);
          const firstButton = screen.getByRole('button');
          const firstContent = firstButton.textContent;

          rerender(<Button>{text}</Button>);
          const secondButton = screen.getByRole('button');
          const secondContent = secondButton.textContent;

          expect(firstContent).toBe(secondContent);
        })
      );
    });

    it('should handle rapid prop changes', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }),
          (texts) => {
            const { rerender } = render(<Button>{texts[0]}</Button>);

            texts.forEach((text) => {
              rerender(<Button>{text}</Button>);
              expect(screen.getByRole('button', { name: text })).toBeInTheDocument();
            });
          }
        )
      );
    });
  });
});
