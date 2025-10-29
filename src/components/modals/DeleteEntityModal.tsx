import React from 'react';
import Button from '../UI/Button/Button'; // Assuming correct path

// --- 1. UPDATE PROPS INTERFACE ---
interface ConfirmationModalProps {
    isOpen: boolean;
    title?: string; // <-- ADDED: Make title optional
    message: string;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    confirmButtonText?: string; // <-- ADDED: Make text optional
    cancelButtonText?: string; // <-- ADDED: Optional cancel text
    // Define button variant type based on your Button component's props
    confirmButtonVariant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'; // <-- ADDED: Make variant optional
}
// ---

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    // --- 2. DESTRUCTURE NEW PROPS ---
    title, // Use the title prop
    message,
    onConfirm,
    onCancel,
    confirmButtonText = 'Confirm', // Default confirm text
    cancelButtonText = 'Cancel', // Default cancel text
    confirmButtonVariant = 'primary', // Default variant
    // ---
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"> {/* Added padding */}
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto"> {/* Adjusted max-w */}
                {/* --- 3. USE TITLE PROP (Conditional) --- */}
                {title && (
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
                )}
                {/* --- */}
                <p className="text-sm text-gray-600 mb-6">{message}</p> {/* Adjusted text size */}
                <div className="flex justify-end gap-3"> {/* Adjusted gap */}
                    
                    {/* CANCEL BUTTON: Uses variant="ghost" with custom classes to achieve the outlined look */}
                    <Button 
                        variant="ghost" // <-- Changed variant to ghost
                        onClick={onCancel}
                        // Added custom classes to achieve the outlined appearance (white background, border, dark text)
                        className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    >
                        {cancelButtonText} {/* Use cancel button text */}
                    </Button>
                    
                    {/* --- 4. USE VARIANT & TEXT PROPS --- */}
                    <Button
                        variant={confirmButtonVariant} // Use the variant prop
                        onClick={onConfirm}
                    >
                        {confirmButtonText} {/* Use the confirm button text */}
                    </Button>
                    {/* --- */}
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;