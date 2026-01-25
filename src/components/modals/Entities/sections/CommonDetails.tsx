import { UserIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import DatePicker from '../../../UI/DatePicker/DatePicker';

export const CommonDetails = ({ 
  formData, 
  onChange, 
  dateJoined, 
  setDateJoined, 
  errors, 
  labels,
  isReadOnlyDate // Prop passed from the EditEntityModal index
}: any) => {
  
  const inputClass = (name: string) => 
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary outline-none transition-all ${
      errors[name] ? 'border-red-500' : 'border-gray-300'
    }`;

  // Formatter for the read-only display
  const formatDateForDisplay = (date: any) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return date; // Return original string if conversion fails
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <div className="md:col-span-2 pb-2 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-secondary" /> General Details
        </h3>
      </div>

      {/* Entity Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {labels.name} <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={onChange} 
          className={inputClass('name')} 
          placeholder={`Enter ${labels.name.toLowerCase()}`} 
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Owner Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {labels.owner} <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          name="ownerName" 
          value={formData.ownerName} 
          onChange={onChange} 
          className={inputClass('ownerName')} 
          placeholder="Enter owner name" 
        />
        {errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>}
      </div>

      {/* Date Joined - Conditional Logic */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <CalendarDaysIcon className="w-4 h-4 text-gray-500"/> Date Joined 
          {!isReadOnlyDate && <span className="text-red-500">*</span>}
        </label>
        
        {isReadOnlyDate ? (
          /* READ-ONLY VIEW (Edit Modal) */
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed min-h-[42px] flex items-center">
            {formatDateForDisplay(dateJoined)}
          </div>
        ) : (
          /* EDITABLE PICKER (Add Modal) */
          <>
            <DatePicker 
              value={dateJoined} 
              onChange={setDateJoined} 
              placeholder="YYYY-MM-DD" 
            />
            {errors.dateJoined && (
              <p className="text-red-500 text-sm mt-1">{errors.dateJoined}</p>
            )}
          </>
        )}
      </div>
    </>
  );
};