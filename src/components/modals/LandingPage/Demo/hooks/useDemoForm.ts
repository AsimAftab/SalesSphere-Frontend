import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema for validation
const demoSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    companyName: z.string().min(1, 'Company Name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().optional(),
});

export type DemoFormData = z.infer<typeof demoSchema>;

interface UseDemoFormProps {
    onClose: () => void;
}

export const useDemoForm = ({ onClose }: UseDemoFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<DemoFormData>({
        resolver: zodResolver(demoSchema),
        defaultValues: {
            name: '',
            companyName: '',
            email: '',
            phoneNumber: '',
        },
    });

    const onSubmit = async (data: DemoFormData) => {
        setIsSubmitting(true);
        try {
            // TODO: Replace with actual API call
            console.log('Form Data Submitted:', data);

            // Artificial delay for demo purposes
            await new Promise((resolve) => setTimeout(resolve, 1000));

            alert('Demo Request Submitted Successfully!');
            form.reset();
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error (e.g., show toast)
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        isSubmitting,
        submitHandler: form.handleSubmit(onSubmit),
    };
};
