import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SkeletonTheme } from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { DetailPageHeader } from '@/components/ui/PageHeader/PageHeader';
import { useTransactionManager } from './hooks/useTransactionManager';

// --- Enterprise Layout Configuration ---
import TransactionCustomerSection from './components/Form/TransactionCustomerSection';
import TransactionLinesTable from './components/Form/TransactionLinesTable';
import TransactionSummarySection from './components/Form/TransactionSummarySection';
import { ProductPickerModal } from '@/components/modals/Order';
import TransactionSkeleton from './components/TransactionSkeleton';

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
};

const CreateTransactionPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, actions } = useTransactionManager();

    // Local state for Product Modal
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    const {
        isOrder, selectedPartyId, deliveryDate,
        items, parties, partiesLoading, productsLoading
    } = state;

    const {
        setSelectedPartyId, setDeliveryDate,
        toggleProduct, removeItem, updateItem, updateItemById
    } = actions;

    return (
        <Sidebar>
            <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
                <div className="min-h-screen pb-20">
                    {(partiesLoading || productsLoading) ? (
                        <div className="p-6 max-w-7xl mx-auto">
                            <TransactionSkeleton />
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="max-w-6xl mx-auto p-4 md:p-8 space-y-6"
                        >
                            {/* --- Page Header --- */}
                            <DetailPageHeader
                                title={isOrder ? 'Create New Order' : 'Create New Estimate'}
                                subtitle="Fill in the details below to generate a new transaction."
                                onBack={() => navigate(isOrder ? '/order-lists' : '/order-lists?tab=estimates')}
                                backLabel={isOrder ? 'Back to Orders' : 'Back to Estimates'}
                            />

                            {/* --- Section 1: Customer Details --- */}
                            <motion.div variants={itemVariants}>
                                <TransactionCustomerSection
                                    parties={parties || []}
                                    selectedPartyId={selectedPartyId}
                                    isOrder={isOrder}
                                    deliveryDate={deliveryDate}
                                    isLoadingParties={partiesLoading}
                                    onSelectParty={setSelectedPartyId}
                                    onDateChange={setDeliveryDate}
                                />
                            </motion.div>

                            {/* --- Section 2: Order Lines --- */}
                            <motion.div variants={itemVariants}>
                                <TransactionLinesTable
                                    items={items}
                                    onUpdateItem={updateItem}
                                    onRemoveItem={removeItem}
                                    onAddProductsClick={() => setIsProductModalOpen(true)}
                                />
                            </motion.div>

                            {/* --- Section 3: Summary & Actions --- */}
                            <motion.div variants={itemVariants}>
                                <TransactionSummarySection
                                    items={state.items}
                                    totals={state.totals}
                                    overallDiscount={state.overallDiscount}
                                    setOverallDiscount={actions.setOverallDiscount}
                                    tax={state.tax}
                                    setTax={actions.setTax}
                                    isSubmitting={state.isSubmitting}
                                    onSubmit={actions.handleSubmit}
                                    onCancel={() => navigate('/order-lists')}
                                    isOrder={state.isOrder}
                                />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* --- Product Modal --- */}
                    <ProductPickerModal
                        isOpen={isProductModalOpen}
                        onClose={() => setIsProductModalOpen(false)}
                        products={state.productsList}
                        isLoading={productsLoading}
                        cartItems={items}
                        onAddProduct={toggleProduct}
                        onRemoveProduct={removeItem}
                        onUpdateQuantity={updateItemById}
                    />
                </div>
            </SkeletonTheme>
        </Sidebar>
    );
};

export default CreateTransactionPage;
