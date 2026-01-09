import { UserCircle, ShoppingCart, DollarSign, Map } from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface EmployeeTabNavigationProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const EmployeeTabNavigation: React.FC<EmployeeTabNavigationProps> = ({ activeTab, onTabChange }) => {
    const tabs: Tab[] = [
        { id: 'details', label: 'Details', icon: <UserCircle className="w-5 h-5" /> },
        { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
        { id: 'collections', label: 'Collections', icon: <DollarSign className="w-5 h-5" /> },
        { id: 'mapping', label: 'Mapping', icon: <Map className="w-5 h-5" /> },
    ];

    return (
        <div className="bg-gray-100">
            <div className="flex gap-2 px-6 py-3">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
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
    );
};

export default EmployeeTabNavigation;
