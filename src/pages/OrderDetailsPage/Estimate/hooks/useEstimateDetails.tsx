import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEstimateById, convertEstimateToOrder } from '@/api/estimateService';
import toast from 'react-hot-toast';
import { generatePdfBlob } from '@/utils/pdfUtils';
import { useAuth } from '@/api/authService';
import { formatDateToLocalISO } from '@/utils/dateUtils';

export const useEstimateDetails = () => {
    const { estimateId } = useParams<{ estimateId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { hasPermission } = useAuth(); // Auth Hook

    // Permissions
    const canConvertToOrder = hasPermission('estimates', 'convertToInvoice');
    const canExportPdf = hasPermission('estimates', 'exportDetailPdf');
    // const canView = hasPermission('estimates', 'view'); // Implicit in route

    // State

    const [showConvertModal, setShowConvertModal] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    // Data Fetching
    const { data: estimateData, isLoading, error } = useQuery({
        queryKey: ['estimates', estimateId],
        queryFn: () => getEstimateById(estimateId!),
        enabled: !!estimateId,
    });

    // Conversion Mutation
    const convertMutation = useMutation({
        mutationFn: ({ id, date }: { id: string, date: string }) => convertEstimateToOrder(id, date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['estimates'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardData'] }); // Fix: Update dashboard stats
            queryClient.invalidateQueries({ queryKey: ['analytics'] }); // Fix: Update analytics if present
            toast.success('Estimate converted to order successfully!');
            setShowConvertModal(false);
            navigate('/order-lists?tab=orders');
        },
        onError: (err: Error) => {
            toast.error(err.message || "Failed to convert estimate");
        }
    });

    // Handlers
    const handleConfirmConversion = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!deliveryDate) {
            toast.error("Please select an expected delivery date");
            return;
        }
        const dateString = formatDateToLocalISO(deliveryDate);
        convertMutation.mutate({ id: estimateId!, date: dateString });
    };

    const handleExportPdf = async () => {
        if (!estimateData) return;
        setIsPrinting(true);
        try {
            // Import from local components folder
            const EstimatePDF = (await import('../components/EstimatePDF')).default;

            const doc = <EstimatePDF data={estimateData} />;
            const blob = await generatePdfBlob(doc);

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (err) {
            console.error("PDF Export failed", err);
            toast.error("Failed to generate PDF");
        } finally {
            setIsPrinting(false);
        }
    };

    const handleGoBack = () => {
        navigate('/order-lists?tab=estimates');
    };

    return {
        state: {
            estimateData,
            isLoading,
            error,
            isPrinting,
            showConvertModal,
            deliveryDate,
            isConverting: convertMutation.isPending,
            permissions: {
                canConvertToOrder,
                canExportPdf
            }
        },
        actions: {
            onExportPdf: handleExportPdf,
            onGoBack: handleGoBack,
            onOpenConvertModal: () => setShowConvertModal(true),
            onCloseConvertModal: () => setShowConvertModal(false),
            onConfirmConversion: handleConfirmConversion,
            setDeliveryDate
        }
    };
};
