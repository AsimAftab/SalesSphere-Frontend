import { type MappingItem } from './useEntityMapping';

interface AssignedListProps {
    items: MappingItem[];
    onUnassign: (id: string) => void;
    title: string;
    icon?: React.ReactNode;
}

const AssignedList: React.FC<AssignedListProps> = ({ items, onUnassign, title, icon }) => {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    {icon}
                </div>
                <p className="font-medium text-gray-500">No {title.toLowerCase()} assigned yet.</p>
                <p className="text-sm mt-1">Select from the list on the right to assign.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-secondary">{icon}</span>
                Assigned {title} ({items.length})
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 no-scrollbar">
                {items.map(item => (
                    <div
                        key={item._id}
                        className="group flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all hover:border-secondary/30"
                    >
                        <div className="flex items-center gap-3">
                            {/* Avatar removed as per user request */}

                            <div>
                                <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                {item.subText && (
                                    <p className="text-xs text-gray-500 line-clamp-1">{item.subText}</p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => onUnassign(item._id)}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove assignment"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignedList;
