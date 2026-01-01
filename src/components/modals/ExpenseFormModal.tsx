import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Search, Check, Plus, ChevronDown, User } from 'lucide-react';
import Button from '../UI/Button/Button';
import DatePicker from '../UI/DatePicker/DatePicker';
import { type Expense } from '../../api/expensesService';
import { type Party } from '../../api/partyService';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any, receiptFile: File | null) => Promise<void>;
  /**
   * SOLID: The modal identifies intent; the Parent handles confirmation and persistence.
   */
  onDeleteReceipt?: () => Promise<void>; 
  initialData?: Expense | null;
  categories?: string[]; 
  parties?: Party[];      
  isSaving: boolean;
  isDeletingReceipt?: boolean; 
}

/**
 * SRP: Isolated Searchable Select component
 */
const SearchableSelect = ({ label, value, options, onSelect, placeholder, partyId }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!isOpen) setSearch(''); }, [isOpen]);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => { 
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); 
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const filtered = options.filter((opt: any) => 
    opt.label?.toLowerCase().includes(search.toLowerCase()) || 
    opt.subLabel?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={ref}>
      <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 tracking-wider uppercase">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-full px-4 py-2.5 border rounded-xl cursor-pointer flex justify-between items-center transition-all duration-200 bg-white ${isOpen ? 'border-secondary ring-2 ring-secondary shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm'}`}
      >
        <span className={`text-sm truncate ${value ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} className="absolute z-[200] w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
            <div className="p-3 border-b border-gray-50 bg-gray-50/30">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors" size={16} />
                <input autoFocus className="w-full pl-10 pr-10 py-2 text-sm border-none bg-white rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-secondary shadow-sm transition-all" placeholder="Search by company or owner..." value={search} onChange={(e) => setSearch(e.target.value)} />
                {search && <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"><X size={14} /></button>}
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              <div onClick={() => { onSelect({ id: '' }); setIsOpen(false); }} className="px-4 py-3 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer border-b border-gray-50 flex items-center justify-between font-bold">
                Clear Selection {!partyId && <Check size={16} className="text-secondary" />}
              </div>
              {filtered.map((opt: any) => (
                <div key={opt.id} onClick={() => { onSelect(opt); setIsOpen(false); }} className={`px-4 py-3 text-sm cursor-pointer flex justify-between items-center transition-colors border-b border-gray-50/50 last:border-0 hover:bg-blue-50/50 ${opt.id === partyId ? 'bg-blue-50/80' : ''}`}>
                  <div className="flex flex-col gap-0.5">
                    <span className={`font-bold ${opt.id === partyId ? 'text-secondary' : 'text-gray-800'}`}>{opt.label}</span>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium lowercase"><User size={10} /> {opt.subLabel}</div>
                  </div>
                  {opt.id === partyId && <div className="bg-secondary text-white p-1 rounded-full shadow-sm"><Check size={12} strokeWidth={3} /></div>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen, onClose, onSave, onDeleteReceipt, initialData, categories = [], parties = [], isSaving, isDeletingReceipt
}) => {
  const [formData, setFormData] = useState({
    title: '', amount: '', incurredDate: null as Date | null, category: '', newCategory: '', description: '', partyId: '',
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const isAddingNewCategory = formData.category === 'ADD_NEW';

  /**
   * Identifies if the current preview matches the existing record on the server.
   */
  const isServerImage = previewUrl && initialData?.receipt === previewUrl;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    if (isCategoryOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isCategoryOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || '', 
          amount: initialData.amount?.toString() || '',
          incurredDate: initialData.incurredDate ? new Date(initialData.incurredDate) : null,
          category: initialData.category || '', 
          newCategory: '', 
          description: initialData.description || '',
          partyId: initialData.party?.id || (initialData as any).partyId || '',
        });
        setPreviewUrl(initialData.receipt || null);
      } else {
        setFormData({ title: '', amount: '', incurredDate: null, category: '', newCategory: '', description: '', partyId: '' });
        setReceiptFile(null); 
        setPreviewUrl(null);
      }
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setReceiptFile(file); 
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /**
   * FIX: Browser confirm removed. 
   * Local cleanup stays local; Server cleanup triggers the Parent's UI confirmation flow.
   */
  const handleRemoveImage = async () => {
    if (isServerImage && onDeleteReceipt) {
      // Direct notification to Parent (which now handles the ConfirmationModal)
      await onDeleteReceipt();
    } else {
      // Local UI cleanup only
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setReceiptFile(null); 
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const finalCategory = isAddingNewCategory ? formData.newCategory : formData.category;
  
  // --- FIX START: Normalize date to prevent "One Day Back" bug ---
  let normalizedDate = formData.incurredDate;
  if (normalizedDate) {
    // Create a new date object to avoid mutating state
    const dateCopy = new Date(normalizedDate);
    // Force the time to be Noon (12:00) to safely stay within the correct day regardless of timezone shift
    dateCopy.setHours(12, 0, 0, 0); 
    normalizedDate = dateCopy;
  }
  // --- FIX END ---

  onSave({ 
    ...formData, 
    category: finalCategory, 
    incurredDate: normalizedDate, // Use the normalized date
    amount: Math.abs(parseFloat(formData.amount)) || 0 
  }, receiptFile);
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">{initialData ? 'Edit Expense Record' : 'Create New Expense'}</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-red-200 rounded-full transition-colors group">
            <X size={20} className="group-hover:rotate-90 transition-transform text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto custom-scrollbar flex-grow flex flex-col">
          <div className="p-6 space-y-6"> 
            
            <div className="relative z-[40]">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 tracking-wider uppercase">Title</label>
              <input required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary outline-none transition-all shadow-sm font-medium" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Expense Title" />
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-[30]">
              <div className="relative overflow-visible">
                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 tracking-wider uppercase">Incurred Date</label>
                <DatePicker value={formData.incurredDate} onChange={(date) => setFormData({...formData, incurredDate: date})} placeholder="Select date" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 tracking-wider uppercase">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 select-none">RS</span>
                  <input type="number" min="0" required step="any" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-secondary font-medium" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="0.00" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start relative z-[20]">
              <div className="relative" ref={categoryRef}>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 tracking-wider uppercase">Category</label>
                <div onClick={() => setIsCategoryOpen(!isCategoryOpen)} className={`w-full px-4 py-2.5 border rounded-xl cursor-pointer flex justify-between items-center transition-all bg-white shadow-sm ${isCategoryOpen ? 'border-secondary ring-1 ring-secondary' : 'border-gray-200 hover:border-gray-300'}`}>
                  <span className={`font-medium ${formData.category ? 'text-gray-900 font-bold': 'text-gray-400 '}`}>{formData.category === 'ADD_NEW' ? 'Adding New...' : (formData.category || 'Select Category')}</span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-[120] w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden">
                      <div className="max-h-48 overflow-y-auto">
                        {categories.map((cat: string) => (
                          <div key={cat} onClick={() => { setFormData({...formData, category: cat}); setIsCategoryOpen(false); }} className="px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0 font-bold text-gray-700">
                            {cat} {formData.category === cat && <Check size={16} className="text-secondary" />}
                          </div>
                        ))}
                      </div>
                      <div onClick={() => { setFormData({...formData, category: 'ADD_NEW'}); setIsCategoryOpen(false); }} className="px-4 py-3 text-sm text-secondary font-black hover:bg-gray-50 cursor-pointer flex items-center gap-2 border-t border-gray-100 transition-colors tracking-widest uppercase"><Plus size={16} strokeWidth={3}/> Add New Category</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isAddingNewCategory && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="md:col-span-1">
                   <label className="block text-xs font-bold text-secondary mb-1.5 ml-1 tracking-wider uppercase">New Category Name <span className="text-red-500">*</span></label>
                   <div className="relative"><input required autoFocus className="w-full px-4 py-2.5 border-2 border-secondary rounded-xl outline-none shadow-sm font-bold" placeholder="Type name..." value={formData.newCategory} onChange={(e) => setFormData({...formData, newCategory: e.target.value})} /><button type="button" onClick={() => setFormData({...formData, category: ''})} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"><X size={16}/></button></div>
                </motion.div>
              )}

              <div className="md:col-span-1">
                <SearchableSelect label="Linked Entity (Optional)" placeholder="Select or Search Party" partyId={formData.partyId} value={parties.find(p => p.id === formData.partyId)?.companyName || ''}
                  options={parties.map(p => ({ id: p.id, label: p.companyName || (p as any).partyName, subLabel: p.ownerName }))}
                  onSelect={(opt: any) => setFormData({...formData, partyId: opt.id})}
                />
              </div>
            </div>

            <div className="relative z-[10]">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 tracking-wider uppercase">Description / Justification</label>
              <textarea className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none shadow-sm resize-none focus:ring-2 focus:ring-secondary transition-all font-medium" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Provide context for this audit entry..." />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 tracking-wider uppercase">Evidence Log Attachment</label>
              {!previewUrl ? (
                <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:border-secondary hover:bg-blue-50/20 transition-all text-center cursor-pointer group bg-gray-50">
                  <div className="bg-white p-3 rounded-full shadow-sm w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6 text-gray-400 group-hover:text-secondary" />
                  </div>
                  <p className="text-sm text-gray-600 font-bold group-hover:text-secondary tracking-tight">Attach receipt documentation</p>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 group aspect-video bg-gray-100 shadow-inner ring-4 ring-gray-50">
                  {isDeletingReceipt && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 backdrop-blur-[2px]">
                      <Loader2 className="animate-spin text-secondary" size={32} />
                    </div>
                  )}
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  <button 
                    type="button" 
                    onClick={handleRemoveImage} 
                    disabled={isDeletingReceipt}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 active:scale-95 disabled:opacity-50"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 flex gap-3 sticky bottom-0 bg-white flex-shrink-0 mt-auto border-t border-gray-50">
            <Button variant="ghost" type="button" onClick={onClose} className="flex-1 font-bold text-gray-400 hover:bg-gray-100 hover:text-gray-600">Cancel</Button>
            <Button type="submit" disabled={isSaving || isDeletingReceipt} className="flex-1 flex justify-center items-center gap-2 font-bold shadow-lg shadow-blue-200">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : initialData ? 'Save changes' : 'Create Expense'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ExpenseFormModal;