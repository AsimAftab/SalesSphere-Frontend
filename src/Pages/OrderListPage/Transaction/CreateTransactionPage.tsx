import React from 'react';
import { motion } from 'framer-motion';
import { SkeletonTheme } from 'react-loading-skeleton';
import Sidebar from '../../../components/layout/Sidebar/Sidebar';
import { useTransactionManager } from './useTransactionManager';

// --- SOLID Components ---
import TransactionHeader from './components/TransactionHeader';
import TransactionPartyDetails from './components/TransactionPartyDetails';
import TransactionProductBrowser from './components/TransactionProductBrowser';
import TransactionCart from './components/TransactionCart';
import TransactionSkeleton from './components/TransactionSkeleton';

const itemVariants = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const CreateTransactionPage: React.FC = () => {
    const { state, actions } = useTransactionManager();

    const {
        isOrder, selectedPartyId, deliveryDate, overallDiscount,
        searchTerm, selectedCategories, items,
        parties, partiesLoading, productsLoading, categories,
        filteredProducts, totals, isSubmitting
    } = state;

    const {
        setSelectedPartyId, setDeliveryDate, setOverallDiscount,
        setSearchTerm, setSelectedCategories, toggleCategory,
        toggleProduct, removeItem, updateItem, handleSubmit
    } = actions;

    return (
        <Sidebar>
            <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
                <div className="p-1 min-h-screen">
                    {(partiesLoading || productsLoading) ? (
                        <TransactionSkeleton />
                    ) : (
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="show"
                        >
                            <TransactionHeader
                                isOrder={isOrder}
                                isSubmitting={isSubmitting}
                                onSubmit={handleSubmit}
                            />

                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                                variants={itemVariants}
                            >
                                {/* Column 1: Details */}
                                <TransactionPartyDetails
                                    parties={parties || []}
                                    selectedPartyId={selectedPartyId}
                                    itemsCount={items.length}
                                    totals={totals}
                                    isOrder={isOrder}
                                    deliveryDate={deliveryDate}
                                    isLoadingParties={partiesLoading}
                                    onSelectParty={setSelectedPartyId}
                                    onDateChange={setDeliveryDate}
                                />

                                {/* Column 2: Product Browser */}
                                <TransactionProductBrowser
                                    products={filteredProducts}
                                    categories={categories}
                                    isLoading={productsLoading}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    selectedCategories={selectedCategories}
                                    onToggleCategory={toggleCategory}
                                    onClearCategories={() => setSelectedCategories([])}
                                    items={items}
                                    onToggleProduct={toggleProduct}
                                />

                                {/* Column 3: Active Cart */}
                                <TransactionCart
                                    items={items}
                                    totals={totals}
                                    overallDiscount={overallDiscount}
                                    setOverallDiscount={setOverallDiscount}
                                    onUpdateItem={updateItem}
                                    onRemoveItem={removeItem}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </SkeletonTheme>
        </Sidebar>
    );
};

export default CreateTransactionPage;
