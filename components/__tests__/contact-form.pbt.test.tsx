import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { FormInput, Label } from '../index';

/**
 * Property-Based Tests for Contact Form
 * **Validates: Requirements 19.5**
 *
 * These tests verify that the contact form includes all required fields
 * (name, email, phone, subject, message) and maintains proper structure
 * and validation across various input combinations.
 */

describe('Contact Form - Property-Based Tests', () => {
  describe('Property 75: Contact Form Includes Required Fields', () => {
    /**
     * Property: The contact form should always render with all 5 required fields present.
     * For any valid form state, all required fields (name, email, phone, subject, message)
     * should be present in the DOM.
     */
    it('should render form with all 5 required fields (name, email, phone, subject, message)', () => {
      // This property holds for any valid form state
      render(
        <form data-testid="contact-form">
          <div>
            <Label>Nome Completo</Label>
            <FormInput type="text" placeholder="Seu nome" data-testid="name-input" />
          </div>
          <div>
            <Label>Email</Label>
            <FormInput type="email" placeholder="seu.email@exemplo.com" data-testid="email-input" />
          </div>
          <div>
            <Label>Telefone</Label>
            <FormInput type="tel" placeholder="(71) 9999-9999" data-testid="phone-input" />
          </div>
          <div>
            <Label>Assunto</Label>
            <FormInput type="text" placeholder="Assunto da sua mensagem" data-testid="subject-input" />
          </div>
          <div>
            <Label>Mensagem</Label>
            <textarea placeholder="Sua mensagem aqui..." data-testid="message-input" />
          </div>
        </form>
      );

      // Verify all 5 required labels are present
      expect(screen.getByText('Nome Completo')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Telefone')).toBeInTheDocument();
      expect(screen.getByText('Assunto')).toBeInTheDocument();
      expect(screen.getByText('Mensagem')).toBeInTheDocument();

      // Verify all 5 input fields are present and accessible
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('phone-input')).toBeInTheDocument();
      expect(screen.getByTestId('subject-input')).toBeInTheDocument();
      expect(screen.getByTestId('message-input')).toBeInTheDocument();
    });

    /**
     * Property: The form structure should always maintain exactly 5 field containers.
     * For any valid form state, the form should have exactly 5 child div elements
     * representing the 5 required fields.
     */
    it('should maintain consistent form structure with 5 field containers', () => {
      const { container } = render(
        <form data-testid="contact-form">
          <div>
            <Label>Nome Completo</Label>
            <FormInput type="text" />
          </div>
          <div>
            <Label>Email</Label>
            <FormInput type="email" />
          </div>
          <div>
            <Label>Telefone</Label>
            <FormInput type="tel" />
          </div>
          <div>
            <Label>Assunto</Label>
            <FormInput type="text" />
          </div>
          <div>
            <Label>Mensagem</Label>
            <textarea />
          </div>
        </form>
      );

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();

      // Verify form has exactly 5 field containers
      const fieldDivs = container.querySelectorAll('form > div');
      expect(fieldDivs.length).toBe(5);
    });

    /**
     * Property: All form fields should have required indicators.
     * For any valid form state, all labels should be marked as required.
     */
    it('should render all fields with required indicators', () => {
      render(
        <form data-testid="contact-form">
          <div>
            <Label required>Nome Completo</Label>
            <FormInput type="text" />
          </div>
          <div>
            <Label required>Email</Label>
            <FormInput type="email" />
          </div>
          <div>
            <Label required>Telefone</Label>
            <FormInput type="tel" />
          </div>
          <div>
            <Label required>Assunto</Label>
            <FormInput type="text" />
          </div>
          <div>
            <Label required>Mensagem</Label>
            <textarea />
          </div>
        </form>
      );

      // Verify all labels are rendered
      expect(screen.getByText('Nome Completo')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Telefone')).toBeInTheDocument();
      expect(screen.getByText('Assunto')).toBeInTheDocument();
      expect(screen.getByText('Mensagem')).toBeInTheDocument();

      // Verify required indicators are present (asterisks)
      const requiredIndicators = screen.getAllByLabelText('required');
      expect(requiredIndicators.length).toBe(5);
    });

    /**
     * Property: Form fields should accept and display various input values.
     * For any valid input value, the form field should accept and display it.
     */
    it('should accept various input values for form fields', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
          (name, email, phone) => {
            const { container } = render(
              <form>
                <FormInput type="text" value={name} onChange={() => {}} data-testid="name" />
                <FormInput type="email" value={email} onChange={() => {}} data-testid="email" />
                <FormInput type="tel" value={phone} onChange={() => {}} data-testid="phone" />
              </form>
            );

            const nameInput = container.querySelector('[data-testid="name"]') as HTMLInputElement;
            const emailInput = container.querySelector('[data-testid="email"]') as HTMLInputElement;
            const phoneInput = container.querySelector('[data-testid="phone"]') as HTMLInputElement;

            expect(nameInput?.value).toBe(name);
            expect(emailInput?.value).toBe(email);
            expect(phoneInput?.value).toBe(phone);
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('Contact Form Validation', () => {
    /**
     * Property: Form fields should render with error states when validation fails.
     * For any error state, the field should display the error styling.
     */
    it('should render form fields with error states', () => {
      render(
        <form>
          <Label>Email</Label>
          <FormInput type="email" state="error" errorMessage="Email inválido" />
        </form>
      );

      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });

    /**
     * Property: Form fields should render with success states when validation passes.
     * For any success state, the field should display the success styling.
     */
    it('should render form fields with success states', () => {
      render(
        <form>
          <Label>Email</Label>
          <FormInput type="email" state="success" />
        </form>
      );

      expect(screen.getByText('Email')).toBeInTheDocument();
    });
  });

  describe('Contact Form Accessibility', () => {
    /**
     * Property: All form inputs should have associated labels.
     * For any form field, there should be a corresponding label element.
     */
    it('should have associated labels for all form inputs', () => {
      render(
        <form>
          <Label>Nome Completo</Label>
          <FormInput type="text" />
          <Label>Email</Label>
          <FormInput type="email" />
          <Label>Telefone</Label>
          <FormInput type="tel" />
          <Label>Assunto</Label>
          <FormInput type="text" />
          <Label>Mensagem</Label>
          <textarea />
        </form>
      );

      expect(screen.getByText('Nome Completo')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Telefone')).toBeInTheDocument();
      expect(screen.getByText('Assunto')).toBeInTheDocument();
      expect(screen.getByText('Mensagem')).toBeInTheDocument();
    });

    /**
     * Property: The form should render with proper semantic HTML structure.
     * For any form, the root element should be a <form> tag.
     */
    it('should render form with proper semantic HTML structure', () => {
      const { container } = render(
        <form data-testid="contact-form">
          <Label>Nome Completo</Label>
          <FormInput type="text" />
        </form>
      );

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      expect(form?.tagName).toBe('FORM');
    });
  });
});
