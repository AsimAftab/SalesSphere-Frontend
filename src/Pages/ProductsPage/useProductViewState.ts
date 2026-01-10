import { useState, useMemo } from 'react';
import type { Product, Category, UpdateProductFormData } from '../../api/productService';
import { useTableSelection } from '../../components/hooks/useTableSelection';

interface UseProductViewStateProps {
    data: Product[] | null;
    categories: Category[];
    onUpdateProduct: (id: string, data: UpdateProductFormData) => Promise<Product>;
    onDeleteProduct: (id: string) => Promise<any>;
    onBulkDelete: (ids: string[]) => Promise<any>;
}

export const useProductViewState = ({
    data,
    categories,
    onUpdateProduct,
    onDeleteProduct,
    onBulkDelete
}: UseProductViewStateProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);

    // Modal Visibility State
    const [modals, setModals] = useState({
        add: false,
        edit: false,
        delete: false,
        bulkDelete: false,
        bulkUpload: false,
        preview: false
    });

    const [previewImages, setPreviewImages] = useState<{ url: string, description: string }[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const ITEMS_PER_PAGE = 10;

    const filteredProducts = useMemo(() => {
        if (!data) return [];
        return data.filter(product => {
            const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategoryIds.length === 0 ||
                (product.category?._id && selectedCategoryIds.includes(product.category._id));
            return matchesSearch && matchesCategory;
        });
    }, [data, searchTerm, selectedCategoryIds]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const { selectedIds, toggleRow, selectAll, clearSelection } = useTableSelection(filteredProducts);

    // Grouped Actions Object
    const actions = {
        modals: {
            openAdd: () => setModals(m => ({ ...m, add: true })),
            closeAdd: () => setModals(m => ({ ...m, add: false })),

            openEdit: (product: Product) => {
                setSelectedProduct(product);
                setModals(m => ({ ...m, edit: true }));
            },
            closeEdit: () => {
                setSelectedProduct(null);
                setModals(m => ({ ...m, edit: false }));
            },

            openDelete: (product: Product) => {
                setSelectedProduct(product);
                setModals(m => ({ ...m, delete: true }));
            },
            closeDelete: () => setModals(m => ({ ...m, delete: false })),

            openBulkDelete: () => setModals(m => ({ ...m, bulkDelete: true })),
            closeBulkDelete: () => setModals(m => ({ ...m, bulkDelete: false })),

            openBulkUpload: () => setModals(m => ({ ...m, bulkUpload: true })),
            closeBulkUpload: () => setModals(m => ({ ...m, bulkUpload: false })),

            openPreview: (product: Product) => {
                if (product.image?.url) {
                    setPreviewImages([{ url: product.image.url, description: product.productName }]);
                    setModals(m => ({ ...m, preview: true }));
                }
            },
            closePreview: () => setModals(m => ({ ...m, preview: false }))
        },

        filters: {
            setSearch: setSearchTerm,
            toggleVisibility: () => setIsFilterVisible(!isFilterVisible),
            handleCategoryChange: (names: string[]) => {
                const ids = categories.filter(c => names.includes(c.name)).map(c => c._id);
                setSelectedCategoryIds(ids);
                setCurrentPage(1);
            },
            reset: () => {
                setSelectedCategoryIds([]);
                setSearchTerm('');
                setIsFilterVisible(false);
                setCurrentPage(1);
            }
        },

        data: {
            setPage: setCurrentPage,
            toggleRow,
            selectAll,
            confirmSingleDelete: async () => {
                if (selectedProduct) await onDeleteProduct(selectedProduct.id);
                setModals(m => ({ ...m, delete: false }));
            },
            confirmBulkDelete: async () => {
                if (selectedIds.length > 0) {
                    await onBulkDelete(selectedIds);
                    clearSelection();
                    setModals(m => ({ ...m, bulkDelete: false }));
                }
            },
            saveEdit: async (formData: UpdateProductFormData) => {
                if (!selectedProduct) throw new Error("No selection");
                const res = await onUpdateProduct(selectedProduct.id, formData);
                actions.modals.closeEdit();
                return res;
            }
        },

        export: {
            pdf: async () => {
                setExportingStatus('pdf');
                try {
                    const ProductListPDF = (await import('./ProductListPDF')).default;
                    const { ExportProductService } = await import('./components/ExportProductService');
                    await ExportProductService.exportToPdf(filteredProducts, ProductListPDF);
                } finally { setExportingStatus(null); }
            },
            excel: async () => {
                setExportingStatus('excel');
                try {
                    const { ExportProductService } = await import('./components/ExportProductService');
                    await ExportProductService.exportToExcel(filteredProducts);
                } finally { setExportingStatus(null); }
            }
        }
    };

    return {
        state: {
            currentPage,
            searchTerm,
            selectedCategoryIds,
            isFilterVisible,
            exportingStatus,
            selectedProduct,
            selectedIds,
            filteredProducts,
            currentProducts,
            totalPages,
            startIndex,
            previewImages,
            modals,
            ITEMS_PER_PAGE,
            isLoading: false, // Placeholder
            error: null as string | null // Placeholder
        },
        actions
    };
};