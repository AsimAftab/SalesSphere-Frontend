import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import { useAuth } from '../../api/authService';
import { Navigate } from 'react-router-dom';
import { ClipboardList, FileText } from 'lucide-react';
import ErrorBoundary from '../../components/UI/ErrorBoundary';

// Sub-Modules
import OrdersTab from './Orders/OrdersTab';
import EstimatesTab from './Estimates/EstimatesTab';

const SalesManagementPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get('tab') as 'orders' | 'estimates') || 'orders';

    // Ensure tab param exists in URL for consistency
    React.useEffect(() => {
        if (!searchParams.get('tab')) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('tab', 'orders');
                return newParams;
            }, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const { hasPermission } = useAuth();

    // Permission Checks
    const canViewOrders = hasPermission('invoices', 'viewList');
    const canViewEstimates = hasPermission('estimates', 'viewList');

    // Redirect if trying to access unauthorized tab, or if neither is allowed
    // Note: If both false, this acts as a gate. If one true, it redirects.
    if (!canViewOrders && !canViewEstimates) {
        return <Navigate to="/dashboard" replace />;
    }

    // Force redirect to permitted tab if current choice is not allowed
    if (activeTab === 'orders' && !canViewOrders && canViewEstimates) {
        return <Navigate to="/order-lists?tab=estimates" replace />;
    }
    if (activeTab === 'estimates' && !canViewEstimates && canViewOrders) {
        return <Navigate to="/order-lists?tab=orders" replace />;
    }

    const handleTabChange = (tabId: string) => {
        setSearchParams({ tab: tabId });
    };

    const salesTabs = [
        ...(canViewOrders ? [{ id: 'orders', label: 'Order List', icon: <ClipboardList className="w-4 h-4" /> }] : []),
        ...(canViewEstimates ? [{ id: 'estimates', label: 'Estimates', icon: <FileText className="w-4 h-4" /> }] : [])
    ];

    return (
        <Sidebar>
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-10 h-[calc(100vh-4rem)]">
                <div className="flex flex-col h-full overflow-hidden pt-6">
                    <div className="bg-gray-100">
                        <div className="flex gap-2 px-6 py-3">
                            {salesTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id as 'orders' | 'estimates')}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                                        ${tab.id === activeTab
                                            ? 'bg-secondary text-white shadow-sm'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                        }
                                    `}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="py-2 px-6 flex-1 overflow-y-auto">
                        <ErrorBoundary>
                            {activeTab === 'orders' ? (
                                <OrdersTab />
                            ) : (
                                <EstimatesTab />
                            )}
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default SalesManagementPage;