import { useState, useMemo } from 'react';
import type { Product, Category, UpdateProductFormData } from '../../api/productService';
import { useTableSelection } from '../../components/hooks/useTableSelection';
import toast from 'react-hot-toast';

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
    // --- STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [exportingStatus, setExportingStatus] = useState<'pdf' | 'excel' | null>(null);

    // Modal State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isBulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
    const [isBulkModalOpen, setBulkModalOpen] = useState(false);
    const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewImages, setPreviewImages] = useState<{ url: string, description: string }[]>([]);

    // Selection Item State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const ITEMS_PER_PAGE = 10;

    // --- DERIVED STATE: Filtered Products ---
    const filteredProducts = useMemo(() => {
        if (!data) return [];
        return data.filter(product => {
            const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategoryIds.length === 0 ||
                (product.category?._id && selectedCategoryIds.includes(product.category._id));
            return matchesSearch && matchesCategory;
        });
    }, [data, searchTerm, selectedCategoryIds]);

    // --- PAGINATION ---
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // --- HOOK: Table Selection ---
    // We pass filteredProducts so "Select All" selects everything matching current filter
    const { selectedIds, toggleRow, selectAll, clearSelection } = useTableSelection(filteredProducts);

    // --- HANDLERS ---
    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    };

    const handleDeleteClick = (product: Product) => {
        setSelectedProduct(product);
        setDeleteModalOpen(true);
    };

    const handleImageClick = (product: Product) => {
        if (product.image?.url) {
            setPreviewImages([{ url: product.image.url, description: product.productName }]);
            setPreviewModalOpen(true);
        }
    };

    const confirmSingleDelete = async () => {
        if (selectedProduct) {
            await onDeleteProduct(selectedProduct.id);
        }
        setDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    const handleBulkDeleteConfirm = async () => {
        if (selectedIds.length > 0) {
            await onBulkDelete(selectedIds);
            clearSelection();
            setBulkDeleteModalOpen(false);
        }
    };

    const handleSaveEdit = async (formData: UpdateProductFormData): Promise<Product> => {
        if (!selectedProduct) throw new Error("No product selected");
        const updatedProduct = await onUpdateProduct(selectedProduct.id, formData);
        setEditModalOpen(false);
        setSelectedProduct(null);
        return updatedProduct;
    };

    const handleExportPdf = async () => {
        setExportingStatus('pdf');
        try {
            // Dynamic import to keep bundle size low if not used
            const ProductListPDF = (await import('./ProductListPDF')).default;
            const { ExportProductService } = await import('./components/ExportProductService');
            await ExportProductService.exportToPdf(filteredProducts, ProductListPDF);
        } catch (err) {
            console.error(err);
            toast.error('Failed to export PDF.');
        } finally {
            setExportingStatus(null);
        }
    };

    const handleExportExcel = async () => {
        setExportingStatus('excel');
        try {
            const { ExportProductService } = await import('./components/ExportProductService');
            await ExportProductService.exportToExcel(filteredProducts);
        } catch (error) {
            console.error(error);
            toast.error('Failed to export Excel.');
        } finally {
            setExportingStatus(null);
        }
    };

    const handleResetFilters = () => {
        setSelectedCategoryIds([]);
        setSearchTerm('');
        setIsFilterVisible(false);
        setCurrentPage(1); // Also reset page on filter reset
    };

    const handleCategoryChange = (names: string[]) => {
        const ids = categories.filter(c => names.includes(c.name)).map(c => c._id);
        setSelectedCategoryIds(ids);
        setCurrentPage(1); // Reset page on filter change
    };

    return {
        state: {
            currentPage,
            searchTerm,
            selectedCategoryIds,
            isFilterVisible,
            exportingStatus,
            isAddModalOpen,
            isEditModalOpen,
            isDeleteModalOpen,
            isBulkDeleteModalOpen,
            isBulkModalOpen,
            isPreviewModalOpen,
            previewImages,
            selectedProduct,
            selectedIds,
            filteredProducts,
            currentProducts,
            totalPages,
            startIndex,
            ITEMS_PER_PAGE
        },
        actions: {
            setCurrentPage,
            setSearchTerm,
            setIsFilterVisible,
            setAddModalOpen,
            setEditModalOpen,
            setDeleteModalOpen, // Exposed for cancel
            setBulkDeleteModalOpen,
            setBulkModalOpen,
            setPreviewModalOpen, // Exposed for close
            setSelectedProduct, // Exposed for cancel/close
            toggleRow,
            selectAll,
            handleEditClick,
            handleDeleteClick,
            handleImageClick,
            confirmSingleDelete,
            handleBulkDeleteConfirm,
            handleSaveEdit,
            handleExportPdf,
            handleExportExcel,
            handleResetFilters,
            handleCategoryChange
        }
    };
};
