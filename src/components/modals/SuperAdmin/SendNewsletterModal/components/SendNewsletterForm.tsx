import React, { useRef, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Mail,
  TestTube,
} from 'lucide-react';

import { Button } from '@/components/ui';
import type { NewsletterFormData, FormErrors, ChangeHandler } from '../types';

interface SendNewsletterFormProps {
    formData: NewsletterFormData;
    errors: FormErrors;
    isSending: boolean;
    isSendingTest: boolean;
    canSendTest: boolean;
    testSentSuccess: boolean;
    handleChange: ChangeHandler;
    handleSendTest: () => Promise<void>;
}

const SendNewsletterForm: React.FC<SendNewsletterFormProps> = ({
    formData,
    errors,
    isSending,
    isSendingTest,
    canSendTest,
    testSentSuccess,
    handleChange,
    handleSendTest,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isDisabled = isSending || isSendingTest;

    // Auto-resize textarea up to max height, then scroll
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const maxHeight = 250;
            const newHeight = Math.min(Math.max(textarea.scrollHeight, 120), maxHeight);
            textarea.style.height = `${newHeight}px`;
            // Enable scroll when content exceeds max height
            textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
        }
    }, [formData.content]);

    const inputClass = (hasError: boolean) =>
        `w-full px-4 py-2.5 border rounded-xl outline-none transition-all text-sm ${
            hasError
                ? 'border-red-500 ring-1 ring-red-100'
                : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        } ${isDisabled ? 'opacity-50 bg-gray-50' : ''}`;

    const renderError = (key: keyof FormErrors) => {
        if (!errors[key]) return null;
        return (
            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors[key]}
            </p>
        );
    };

    return (
        <div className="p-6 space-y-6">
            {/* Subject Field */}
            <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Subject <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isDisabled}
                    placeholder="e.g. Monthly Newsletter - January 2026"
                    className={inputClass(!!errors.subject)}
                />
                {renderError('subject')}
            </div>

            {/* Content Field */}
            <div>
                <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Content <span className="text-red-500">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    disabled={isDisabled}
                    placeholder="Write your newsletter content here..."
                    className={`${inputClass(!!errors.content)} resize-none min-h-[120px] max-h-[250px]`}
                />
                {renderError('content')}
            </div>

            {/* Test Email Section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                    <TestTube className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-700">Test Before Sending</span>
                    {testSentSuccess && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Test sent!
                        </span>
                    )}
                </div>
                <div className="flex gap-3">
                    <input
                        type="email"
                        id="testEmail"
                        name="testEmail"
                        value={formData.testEmail}
                        onChange={handleChange}
                        disabled={isDisabled}
                        placeholder="your-email@example.com"
                        className={`flex-1 ${inputClass(!!errors.testEmail)}`}
                    />
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={handleSendTest}
                        disabled={!canSendTest || isDisabled}
                        className="shrink-0"
                    >
                        {isSendingTest ? 'Sending...' : 'Send Test'}
                    </Button>
                </div>
                {renderError('testEmail')}
                <p className="text-xs text-slate-500 mt-2">
                    Send a preview to yourself before sending to all subscribers
                </p>
            </div>
        </div>
    );
};

export default SendNewsletterForm;
