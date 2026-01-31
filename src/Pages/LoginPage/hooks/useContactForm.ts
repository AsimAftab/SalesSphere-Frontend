import { useState } from 'react';
import { contactAdmin } from '../../../api/authService';

interface ContactFormState {
  fullName: string;
  email: string;
  department: string;
  requestType: string;
  message: string;
}

const INITIAL_STATE: ContactFormState = {
  fullName: '',
  email: '',
  department: '',
  requestType: '',
  message: '',
};

export const REQUEST_TYPE_OPTIONS = [
  { value: 'new-account', label: 'Request for new account' },
  { value: 'login-issue', label: 'Forgot password / login issue' },
  { value: 'update-details', label: 'Update user details' },
  { value: 'other', label: 'Other' },
];

export const useContactForm = () => {
  const [form, setForm] = useState<ContactFormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await contactAdmin(form);
      setSuccess(true);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setError(errObj.message || 'There was an error submitting your request.');
    } finally {
      setLoading(false);
    }
  };

  return { form, updateField, loading, success, error, handleSubmit };
};
