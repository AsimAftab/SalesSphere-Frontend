import React from 'react';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { CartItem } from '../../hooks/useTransactionManager';
import { Button, DataTable } from '@/components/ui';
import type { TableColumn, TableAction } from '@/components/ui/DataTable/types';

interface TransactionLinesTableProps {
    items: CartItem[];
    onUpdateItem: (index: number, field: keyof CartItem, val: string | number) => void;
    onRemoveItem: (id: string) => void;
    onAddProductsClick: () => void;
}

const TransactionLinesTable: React.FC<TransactionLinesTableProps> = ({
    items,
    onUpdateItem,
    onRemoveItem,
    onAddProductsClick
}) => {

    // Define columns with custom renderers for inputs
    const columns: TableColumn<CartItem>[] = [
        {
            key: 'productName',
            label: 'Product Details',
            render: (_val, item) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 text-sm">{item.productName}</span>
                    {item.quantity >= 100 && (
                        <span className="w-fit mt-0.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wide uppercase">Bulk Order</span>
                    )}
                </div>
            )
        },
        {
            key: 'quantity',
            label: 'Qty',
            width: 'w-28',
            align: 'center',
            headerClassName: 'text-center',
            render: (_val, item, index) => {
                const isMaxed = item.quantity >= item.maxQty;
                return (
                    <div className="flex items-center justify-center">
                        <input
                            type="number"
                            min="1"
                            max={item.maxQty}
                            value={item.quantity}
                            disabled={isMaxed}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val > 0 && val <= item.maxQty) {
                                    onUpdateItem(index, 'quantity', val);
                                } else if (val > item.maxQty) {
                                    onUpdateItem(index, 'quantity', item.maxQty);
                                } else if (val >= 1) {
                                    onUpdateItem(index, 'quantity', Math.max(1, val));
                                }
                            }}
                            onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (val < 1) {
                                    onUpdateItem(index, 'quantity', 1);
                                } else if (val > item.maxQty) {
                                    onUpdateItem(index, 'quantity', item.maxQty);
                                }
                            }}
                            className={`w-16 text-center px-1 py-1.5 rounded-lg text-sm font-bold transition-all outline-none ${isMaxed
                                    ? 'bg-red-50 border border-red-200 text-red-600 cursor-not-allowed'
                                    : 'bg-gray-50 hover:bg-white focus:bg-white border border-transparent hover:border-gray-200 focus:border-blue-500'
                                }`}
                            title={isMaxed ? 'Maximum stock reached' : undefined}
                        />
                    </div>
                );
            }
        },
        {
            key: 'price',
            label: 'Price',
            width: 'w-36',
            align: 'center',
            headerClassName: 'text-center',
            render: (_val, item, index) => (
                <div className="relative group flex items-center justify-center">
                    <span className="text-gray-400 absolute left-2 text-xs font-medium pointer-events-none transition-colors group-focus-within:text-blue-500">RS</span>
                    <input
                        type="number"
                        min="0"
                        className="w-full pl-8 pr-2 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-transparent hover:border-gray-200 focus:border-blue-500 rounded-lg transition-all text-center font-semibold text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-gray-300"
                        value={item.price}
                        onChange={(e) => onUpdateItem(index, 'price', Number(e.target.value))}
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                        <button
                            onClick={() => onUpdateItem(index, 'price', item.price + 10)}
                            className="p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                            type="button"
                        >
                            <ChevronUp className="h-2.5 w-2.5" />
                        </button>
                        <button
                            onClick={() => onUpdateItem(index, 'price', Math.max(0, item.price - 10))}
                            className="p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                            type="button"
                        >
                            <ChevronDown className="h-2.5 w-2.5" />
                        </button>
                    </div>
                </div>
            )
        },
        {
            key: 'discount',
            label: 'Disc',
            width: 'w-24',
            align: 'center',
            headerClassName: 'text-center',
            render: (_val, item, index) => (
                <div className="relative group flex items-center justify-center">
                    <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full pl-2 pr-6 py-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-transparent hover:border-gray-200 focus:border-blue-500 rounded-lg transition-all text-center font-semibold text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={item.discount}
                        onChange={(e) => onUpdateItem(index, 'discount', Math.min(100, Math.max(0, Number(e.target.value))))}
                    />
                    <span className="text-gray-400 absolute right-2 text-xs pointer-events-none group-focus-within:text-blue-500">%</span>
                </div>
            ),
        },
        {
            key: 'total',
            label: 'Total',
            width: 'w-36',
            align: 'right',
            headerClassName: 'text-right',
            render: (_val, item) => {
                const total = (item.price * item.quantity) * (1 - (item.discount / 100));
                return (
                    <span className="font-bold text-gray-900 tabular-nums tracking-tight block text-right">
                        RS {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                );
            }
        }
    ];

    // Define actions for Delete
    const actions: TableAction<CartItem>[] = [
        {
            label: 'Delete',
            icon: Trash2,
            onClick: (item) => onRemoveItem(item.productId),
            className: 'text-red-500 hover:bg-red-50 p-2 rounded-lg'
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-700">Order Lines</h3>
                <Button
                    type="button"
                    onClick={onAddProductsClick}
                    variant="secondary"
                    className="h-8 text-xs"
                >
                    Add Products
                </Button>
            </div>

            <DataTable
                data={items}
                columns={columns}
                actions={actions}
                keyExtractor={(item) => item.productId}
                showSerialNumber={true}
                hideOnMobile={false}
                emptyMessage="No items added yet. Add products to build your order."
                tableClassName="border-none"
                className="border-none shadow-none rounded-none"
            />
        </div>
    );
};

export default TransactionLinesTable;
