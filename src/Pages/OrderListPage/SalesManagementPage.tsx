import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import { useAuth } from '../../api/authService';
import { Navigate } from 'react-router-dom';
import { ClipboardList, FileText } from 'lucide-react';
import ErrorBoundary from '../../components/ui/ErrorBoundary/ErrorBoundary';

// Sub-Modules
import OrdersTab from './Orders/OrdersTab';
import EstimatesTab from './Estimates/EstimatesTab';
import NavigationTabs from '../../components/ui/NavigationTabs/NavigationTabs';

const SalesManagementPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get('tab') as 'orders' | 'estimates') || 'orders';

    const { hasPermission } = useAuth();

    // Permission Checks
    const canViewOrders = hasPermission('invoices', 'viewList');
    const canViewEstimates = hasPermission('estimates', 'viewList');

    // Ensure tab param exists in URL for consistency, respecting permissions
    React.useEffect(() => {
        if (!searchParams.get('tab')) {
            if (canViewOrders) {
                setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set('tab', 'orders');
                    return newParams;
                }, { replace: true });
            } else if (canViewEstimates) {
                setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set('tab', 'estimates');
                    return newParams;
                }, { replace: true });
            }
        }
    }, [searchParams, setSearchParams, canViewOrders, canViewEstimates]);

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
                    <NavigationTabs
                        tabs={salesTabs}
                        activeTab={activeTab}
                        onTabChange={(tabId) => handleTabChange(tabId)}
                    />

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