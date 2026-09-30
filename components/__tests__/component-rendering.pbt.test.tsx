import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup, getByText, getByRole, getByLabelText, getByPlaceholderText } from '@testing-library/react';
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
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  describe('Button Component Rendering', () => {
    it('should render button with any text content', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), (text) => {
          const { container, unmount } = render(<Button>{text}</Button>);
          expect(container.querySelector('button')).toBeInTheDocument();
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should render button with all valid variants', () => {
      const variants = ['primary', 'secondary', 'ghost'] as const;
      fc.assert(
        fc.property(fc.constantFrom(...variants), (variant) => {
          const { container, unmount } = render(<Button variant={variant}>Test</Button>);
          expect(container.querySelector('button')).toBeInTheDocument();
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should render button with all valid sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      fc.assert(
        fc.property(fc.constantFrom(...sizes), (size) => {
          const { container, unmount } = render(<Button size={size}>Test</Button>);
          expect(container.querySelector('button')).toBeInTheDocument();
          unmount();
          document.body.innerHTML = '';
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
            const { container, unmount } = render(
              <Button variant={variant} size={size} disabled={disabled}>
                Test
              </Button>
            );
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
            if (disabled) {
              expect(button).toBeDisabled();
            }
            unmount();
            document.body.innerHTML = '';
          }
        )
      );
    });
  });

  describe('Card Component Rendering', () => {
    it('should render card with any text content', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), (text) => {
          const { container, unmount } = render(<Card>{text}</Card>);
          expect(container.textContent).toContain(text);
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should render card with all valid variants', () => {
      const variants = ['standard', 'glass'] as const;
      fc.assert(
        fc.property(fc.constantFrom(...variants), (variant) => {
          const { container, unmount } = render(<Card variant={variant} data-testid="card">Test</Card>);
          expect(container.querySelector('[data-testid="card"]')).toBeInTheDocument();
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should render card with multiple children', () => {
      fc.assert(
        fc.property(fc.array(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 5 }), (texts) => {
          const { container, unmount } = render(
            <Card>
              {texts.map((text, i) => (
                <div key={i}>{text}</div>
              ))}
            </Card>
          );
          texts.forEach((text) => {
            expect(container.textContent).toContain(text);
          });
          unmount();
          document.body.innerHTML = '';
        })
      );
    });
  });

  describe('FormInput Component Rendering', () => {
    it('should render input with any placeholder text', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (placeholder) => {
          const { container, unmount } = render(<FormInput placeholder={placeholder} />);
          const input = container.querySelector('input');
          expect(input?.getAttribute('placeholder')).toBe(placeholder);
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should render input with all valid types', () => {
      const types = ['text', 'email', 'password', 'tel', 'number', 'date', 'time'] as const;
      fc.assert(
        fc.property(fc.constantFrom(...types), (type) => {
          const { container, unmount } = render(<FormInput type={type} />);
          const input = container.querySelector('input');
          expect(input?.getAttribute('type')).toBe(type);
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should render input with all valid states', () => {
      const states = ['default', 'error', 'success'] as const;
      fc.assert(
        fc.property(fc.constantFrom(...states), (state) => {
          const { container, unmount } = render(<FormInput state={state} />);
          expect(container.querySelector('input')).toBeInTheDocument();
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should render input with label and error message', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          (label, error) => {
            const { container, unmount } = render(<FormInput label={label} state="error" errorMessage={error} />);
            expect(container.querySelector('label')?.textContent).toContain(label);
            expect(container.textContent).toContain(error);
            unmount();
            document.body.innerHTML = '';
          }
        )
      );
    });
  });

  describe('Label Component Rendering', () => {
    it('should render label with any text content', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), (text) => {
          const { container, unmount } = render(<Label>{text}</Label>);
          expect(container.textContent).toContain(text);
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should render required indicator when required prop is true', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (text) => {
          const { container, unmount } = render(<Label required>{text}</Label>);
          expect(container.querySelector('[aria-label="required"]')).toBeInTheDocument();
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should not render required indicator when required prop is false', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (text) => {
          const { container, unmount } = render(<Label required={false}>{text}</Label>);
          expect(container.querySelector('[aria-label="required"]')).toBeNull();
          unmount();
          document.body.innerHTML = '';
        })
      );
    });
  });

  describe('ErrorMessage Component Rendering', () => {
    it('should render error message with any text', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), (message) => {
          const { container, unmount } = render(<ErrorMessage message={message} />);
          expect(container.textContent).toContain(message);
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should render error message with alert role', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (message) => {
          const { container, unmount } = render(<ErrorMessage message={message} />);
          expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should render icon by default', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (message) => {
          const { container, unmount } = render(<ErrorMessage message={message} />);
          const svg = container.querySelector('svg');
          expect(svg).toBeInTheDocument();
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should not render icon when icon prop is false', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (message) => {
          const { container, unmount } = render(<ErrorMessage message={message} icon={false} />);
          const svg = container.querySelector('svg');
          expect(svg).toBeNull();
          unmount();
          document.body.innerHTML = '';
        })
      );
    });
  });

  describe('Component Consistency', () => {
    it('should render same component consistently with same props', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), (text) => {
          const { container, rerender, unmount } = render(<Button>{text}</Button>);
          const firstButton = container.querySelector('button');
          const firstContent = firstButton?.textContent;

          rerender(<Button>{text}</Button>);
          const secondButton = container.querySelector('button');
          const secondContent = secondButton?.textContent;

          expect(firstContent).toBe(secondContent);
          unmount();
          document.body.innerHTML = '';
        })
      );
    });

    it('should handle rapid prop changes', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 10 }),
          (texts) => {
            const { container, rerender, unmount } = render(<Button>{texts[0]}</Button>);

            texts.forEach((text) => {
              rerender(<Button>{text}</Button>);
              expect(container.querySelector('button')).toBeInTheDocument();
            });
            unmount();
            document.body.innerHTML = '';
          }
        )
      );
    });
  });
});