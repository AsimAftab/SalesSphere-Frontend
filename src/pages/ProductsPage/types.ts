export interface ProductViewState {
    currentPage: number;
    searchTerm: string;
    selectedCategoryIds: string[];
    selectedCreators: string[];
    creators: string[];
    isFilterVisible: boolean;
    exportingStatus: 'pdf' | 'excel' | null;
    selectedProduct: import('../../api/productService').Product | null;
    selectedIds: string[];
    filteredProducts: import('../../api/productService').Product[];
    currentProducts: import('../../api/productService').Product[];
    totalPages: number;
    startIndex: number;
    previewImages: { url: string, description: string }[];
    modals: {
        add: boolean;
        edit: boolean;
        delete: boolean;
        bulkDelete: boolean;
        bulkUpload: boolean;
        preview: boolean;
    };
    ITEMS_PER_PAGE: number;
}

export interface ProductActions {
    modals: {
        openAdd: () => void;
        closeAdd: () => void;
        openEdit: (product: import('../../api/productService').Product) => void;
        closeEdit: () => void;
        openDelete: (product: import('../../api/productService').Product) => void;
        closeDelete: () => void;
        openBulkDelete: () => void;
        closeBulkDelete: () => void;
        openBulkUpload: () => void;
        closeBulkUpload: () => void;
        openPreview: (product: import('../../api/productService').Product) => void;
        closePreview: () => void;
    };
    filters: {
        setSearch: (term: string) => void;
        toggleVisibility: () => void;
        handleCategoryChange: (names: string[]) => void;
        handleCreatorChange: (names: string[]) => void;
        reset: () => void;
    };
    data: {
        setPage: (page: number) => void;
        toggleRow: (id: string) => void;
        selectAll: (checked: boolean) => void;
        confirmSingleDelete: () => Promise<void>;
        confirmBulkDelete: () => Promise<void>;
        saveEdit: (formData: import('../../api/productService').UpdateProductFormData) => Promise<import('../../api/productService').Product>;
    };
    export: {
        pdf: () => Promise<void>;
        excel: () => Promise<void>;
    };
}
