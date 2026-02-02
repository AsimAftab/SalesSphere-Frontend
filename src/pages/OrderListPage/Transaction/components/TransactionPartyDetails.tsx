import React, { useState, useRef, useEffect } from 'react';
import { UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import type { Party } from '../useTransactionManager';
import { DatePicker } from '@/components/ui';

interface TransactionPartyDetailsProps {
    parties: Party[] | undefined;
    selectedPartyId: string;
    itemsCount: number;
    totals: { subtotal: number };
    isOrder: boolean;
    deliveryDate: Date | null;
    isLoadingParties: boolean;
    onSelectParty: (id: string) => void;
    onDateChange: (date: Date | null) => void;
}

const TransactionPartyDetails: React.FC<TransactionPartyDetailsProps> = ({
    parties,
    selectedPartyId,
    itemsCount,
    totals,
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full">
            <div className="p-5 border-b bg-gray-50/50 shrink-0">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-blue-500" />{isOrder ? 'Order' : 'Estimate'} Details
                </h2>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                <div className="relative" ref={dropdownRef}>
                    <label className="text-sm text-gray-800 tracking-widest mb-1.5 block">Select Party</label>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex justify-between items-center p-3 border border-gray-200 rounded-xl text-sm bg-white transition-all shadow-sm focus:ring-2 focus:ring-secondary"
                    >
                        <span className="font-semibold text-gray-400">
                            {selectedParty ? selectedParty.companyName : "Choose party..."}
                        </span>
                        {isLoadingParties ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                    </button>

                    {isOpen && (
                        <div className="absolute w-full mt-2 border border-gray-100 bg-white rounded-xl shadow-2xl z-50 max-h-64 overflow-hidden flex flex-col">
                            <div className="p-3 bg-gray-50 border-b">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search party..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-secondary"
                                />
                            </div>
                            <div className="overflow-y-auto custom-scrollbar">
                                {filteredParties.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => { onSelectParty(p.id); setIsOpen(false); setSearch(''); }}
                                        className="px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        {p.companyName}
                                    </div>
                                ))}
                                {filteredParties.length === 0 && <div className="p-4 text-center text-gray-400 text-sm">No parties found</div>}
                            </div>
                        </div>
                    )}
                </div>

                {isOrder && (
                    <div>
                        <label className="text-sm text-gray-800 tracking-widest mb-1.5 block">Expected Delivery</label>
                        <DatePicker
                            value={deliveryDate}
                            onChange={onDateChange}
                            placeholder="Select Date"
                            className="w-full p-3 border border-gray-200 rounded-xl bg-white text-sm font-semibold"
                        />
                    </div>
                )}

                <div className="border-t pt-4 mt-auto">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total Unique Items:</span>
                            <span className="font-medium">{itemsCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Gross Subtotal:</span>
                            <span className="font-medium text-blue-600">Rs {totals.subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionPartyDetails;
