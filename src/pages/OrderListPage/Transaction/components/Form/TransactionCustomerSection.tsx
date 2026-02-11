import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2, User } from 'lucide-react';
import type { Party } from '@/api/partyService';
import { DatePicker } from '@/components/ui';

interface TransactionCustomerSectionProps {
    parties: Party[] | undefined;
    selectedPartyId: string;
    isOrder: boolean;
    deliveryDate: Date | null;
    isLoadingParties: boolean;
    onSelectParty: (id: string) => void;
    onDateChange: (date: Date | null) => void;
}

const TransactionCustomerSection: React.FC<TransactionCustomerSectionProps> = ({
    parties,
    selectedPartyId,
    isOrder,
    deliveryDate,
    isLoadingParties,
    onSelectParty,
    onDateChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredParties = parties?.filter((p) => p.companyName.toLowerCase().includes(search.toLowerCase())) || [];
    const selectedParty = parties?.find((p) => p.id === selectedPartyId);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    Customer Details
                </h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        Select Customer <span className="text-red-500">*</span>
                    </label>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className={`w-full flex justify-between items-center px-4 py-3 border rounded-xl text-sm bg-white transition-all shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <span className={`font-semibold ${selectedParty ? 'text-gray-900' : 'text-gray-400'}`}>
                                {selectedParty ? selectedParty.companyName : "Search for a customer..."}
                            </span>
                            {isLoadingParties ? (
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            ) : (
                                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            )}
                        </button>

                        {isOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-3 bg-gray-50 border-b border-gray-100 sticky top-0">
                                    <input
                                        type="text"
                                        placeholder="Type to search..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                                        autoFocus
                                    />
                                </div>
                                <div className="overflow-y-auto custom-scrollbar flex-1 p-1">
                                    {filteredParties.length > 0 ? (
                                        filteredParties.map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    onSelectParty(p.id);
                                                    setIsOpen(false);
                                                    setSearch('');
                                                }}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between group ${selectedPartyId === p.id
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="font-medium">{p.companyName}</span>
                                                {selectedPartyId === p.id && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-400 text-sm italic">
                                            No customers found matching "{search}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Date Selection */}
                {isOrder && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Expected Delivery Date
                        </label>
                        <DatePicker
                            value={deliveryDate}
                            onChange={onDateChange}
                            placeholder="Select Date"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm font-semibold shadow-sm hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionCustomerSection;
