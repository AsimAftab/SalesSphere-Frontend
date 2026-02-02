import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';

interface TransactionHeaderProps {
    isOrder: boolean;
    isSubmitting: boolean;
    onSubmit: () => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({ isOrder, isSubmitting, onSubmit }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Create {isOrder ? 'Order' : 'Estimate'}
                    </h1>
                    <p className="text-sm text-gray-500">Configure details and add products</p>
                </div>
            </div>
            <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
            >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : `Create ${isOrder ? 'Order' : 'Estimate'}`}
            </Button>
        </motion.div>
    );
};

export default TransactionHeader;
