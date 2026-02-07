import React from 'react';
import { Button, FormModal } from '@/components/ui';

interface ShellProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    isSaving: boolean;
    submitLabel?: string;
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
}

export const OrganizationFormModalShell: React.FC<ShellProps> = ({
    isOpen, onClose, title, subtitle, isSaving, submitLabel, children, onSubmit
}) => {
    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={subtitle}
            size="xl"
        >
            <form onSubmit={onSubmit} className="overflow-y-auto custom-scrollbar flex-grow flex flex-col">
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {children}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSaving}
                        variant="secondary"
                        isLoading={isSaving}
                    >
                        {isSaving ? 'Saving...' : submitLabel || 'Save'}
                    </Button>
                </div>
            </form>
        </FormModal>
    );
};
