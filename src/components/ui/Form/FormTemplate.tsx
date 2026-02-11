import React from 'react';
import Button from '../Button/Button';

// FormField Component
export interface FormFieldProps {
  /** Field label */
  label: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Whether to show the error (e.g., after form submission attempt) */
  showError?: boolean;
  /** Help text below the field */
  helpText?: string;
  /** Additional className for the field wrapper */
  className?: string;
  /** Field content (input, select, etc.) */
  children: React.ReactNode;
  /** HTML for attribute to associate label with input */
  htmlFor?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  showError = true,
  helpText,
  className = '',
  children,
  htmlFor,
}) => {
  const hasError = showError && !!error;

  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hasError && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {!hasError && helpText && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

// FormRow Component for multi-column layouts
export interface FormRowProps {
  /** Number of columns (1, 2, 3, or 4) */
  columns?: 1 | 2 | 3 | 4;
  /** Gap size */
  gap?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
  /** Row content */
  children: React.ReactNode;
}

export const FormRow: React.FC<FormRowProps> = ({
  columns = 2,
  gap = 'md',
  className = '',
  children,
}) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

// FormSection Component for grouping fields
export interface FormSectionProps {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Additional className */
  className?: string;
  /** Section content */
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  className = '',
  children,
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="border-b border-gray-100 pb-3">
          {title && (
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  );
};

// FormTemplate Component
export interface FormTemplateProps {
  /** Form submit handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Cancel/close handler */
  onCancel?: () => void;
  /** Whether form is submitting/loading */
  isSubmitting?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Whether to show footer buttons */
  showFooter?: boolean;
  /** Whether to show cancel button */
  showCancel?: boolean;
  /** Additional className for the form */
  className?: string;
  /** Additional className for the content area */
  contentClassName?: string;
  /** Form content */
  children: React.ReactNode;
  /** Custom footer content (replaces default buttons) */
  customFooter?: React.ReactNode;
  /** Whether footer should be sticky */
  stickyFooter?: boolean;
}

export const FormTemplate: React.FC<FormTemplateProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitText = 'Submit',
  cancelText = 'Cancel',
  showFooter = true,
  showCancel = true,
  className = '',
  contentClassName = '',
  children,
  customFooter,
  stickyFooter = true,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col h-full ${className}`}
    >
      {/* Scrollable Content Area */}
      <div className={`p-6 space-y-6 flex-1 overflow-y-auto ${contentClassName}`}>
        {children}
      </div>

      {/* Footer */}
      {showFooter && (
        <div
          className={`px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 ${
            stickyFooter ? 'sticky bottom-0' : ''
          }`}
        >
          {customFooter || (
            <>
              {showCancel && onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  {cancelText}
                </Button>
              )}
              <Button
                type="submit"
                variant="secondary"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {submitText}
              </Button>
            </>
          )}
        </div>
      )}
    </form>
  );
};

// Inline Form Template (no modal wrapper, for embedded forms)
export interface InlineFormTemplateProps {
  /** Form submit handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Whether form is submitting/loading */
  isSubmitting?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Additional className */
  className?: string;
  /** Form content */
  children: React.ReactNode;
  /** Additional actions next to submit button */
  additionalActions?: React.ReactNode;
}

export const InlineFormTemplate: React.FC<InlineFormTemplateProps> = ({
  onSubmit,
  isSubmitting = false,
  submitText = 'Save',
  className = '',
  children,
  additionalActions,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {children}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        {additionalActions}
        <Button
          type="submit"
          variant="secondary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default FormTemplate;
