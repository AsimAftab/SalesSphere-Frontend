import { BuildingOfficeIcon, BriefcaseIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { useFormContext, Controller } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { DropDown } from '@/components/ui';

interface EntitySpecificProps {
  props: {
    entityType: string;
    subOrgsList?: string[];
    partyTypesList?: string[];
    panVatMode: 'required' | 'optional' | 'hidden';
  };
}

export const EntitySpecific = ({ props }: EntitySpecificProps) => {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext();
  const { entityType, subOrgsList, partyTypesList, panVatMode } = props;

  // Watch values for conditional logic
  const subOrgName = watch('subOrgName');
  const partyType = watch('partyType');

  // Helper logic for "Add New" visibility states
  const isAddingNewSubOrg = subOrgName === 'ADD_NEW' || (subOrgName && !subOrgsList?.includes(subOrgName));
  const isAddingNewPartyType = partyType === 'ADD_NEW' || (partyType && !partyTypesList?.includes(partyType));

  const inputClass = (name: string) =>
    `w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${errors[name] ? 'border-red-500 ring-1 ring-red-100 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary'
    }`;

  const renderError = (name: string) => {
    const errorMsg = errors[name]?.message as string;
    if (!errorMsg) return null;
    return <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errorMsg}</p>;
  };

  return (
    <>
      {/* --- SITE SPECIFIC Logic --- */}
      {entityType === 'Site' && (
        <>
          <div className="md:col-span-1">
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BuildingOfficeIcon className="w-4 h-4 text-gray-500" /> Sub Organization <span className="text-red-500">*</span>
            </label>
            <Controller
              name="subOrgName"
              control={control}
              render={({ field }) => (
                <DropDown
                  value={subOrgsList?.includes(field.value) ? field.value : (field.value ? 'ADD_NEW' : '')}
                  onChange={(val) => field.onChange(val)}
                  options={[
                    ...(subOrgsList?.map((org: string) => ({ value: org, label: org })) ?? []),
                    { value: 'ADD_NEW', label: '+ Add New Sub Organization', className: 'text-blue-600 font-bold' }
                  ]}
                  placeholder="Select Sub Organization"
                  error={errors.subOrgName?.message as string}
                />
              )}
            />
            {renderError('subOrgName')}
          </div>

          {isAddingNewSubOrg ? (
            <div className="md:col-span-1">
              <label className="text-sm font-semibold text-gray-700 mb-2">New Sub Org Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={inputClass('subOrgName')}
                placeholder="Enter new organization"
                value={subOrgName === 'ADD_NEW' ? '' : subOrgName}
                onChange={(e) => setValue('subOrgName', e.target.value, { shouldValidate: true })}
                autoFocus
              />
            </div>
          ) : null}

          {panVatMode !== 'hidden' && (
            <div className="md:col-span-1">
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <IdentificationIcon className="w-4 h-4 text-gray-500" /> PAN/VAT {panVatMode === 'required' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                maxLength={15}
                className={inputClass('panVat')}
                placeholder="Enter PAN/VAT number"
                {...register('panVat', {
                  onChange: (e) => setValue('panVat', e.target.value.toUpperCase())
                })}
              />
              {renderError('panVat')}
            </div>
          )}
        </>
      )}

      {/* --- PARTY SPECIFIC Logic --- */}
      {entityType === 'Party' && (
        <>
          <div className="md:col-span-1">
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BriefcaseIcon className="w-4 h-4 text-gray-500" /> Party Type
            </label>
            <Controller
              name="partyType"
              control={control}
              render={({ field }) => (
                <DropDown
                  value={partyTypesList?.includes(field.value) ? field.value : (field.value ? 'ADD_NEW' : '')}
                  onChange={(val) => field.onChange(val)}
                  options={[
                    ...(partyTypesList?.map((type: string) => ({ value: type, label: type })) ?? []),
                    { value: 'ADD_NEW', label: '+ Add New Party Type', className: 'text-blue-600 font-bold' }
                  ]}
                  placeholder="Select Party Type"
                  error={errors.partyType?.message as string}
                />
              )}
            />
            {renderError('partyType')}
          </div>

          {isAddingNewPartyType ? (
            <div className="md:col-span-1">
              <label className="text-sm font-semibold text-gray-700 mb-2">New Party Type Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={inputClass('partyType')}
                placeholder="Enter new party type name"
                value={partyType === 'ADD_NEW' ? '' : partyType}
                onChange={(e) => setValue('partyType', e.target.value, { shouldValidate: true })}
                autoFocus
              />
            </div>
          ) : null}

          {panVatMode !== 'hidden' && (
            <div className="md:col-span-1">
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <IdentificationIcon className="w-4 h-4 text-gray-500" /> PAN/VAT {panVatMode === 'required' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                maxLength={15}
                className={inputClass('panVat')}
                placeholder="Enter PAN/VAT number"
                {...register('panVat', {
                  onChange: (e) => setValue('panVat', e.target.value.toUpperCase())
                })}
              />
              {renderError('panVat')}
            </div>
          )}
        </>
      )}
    </>
  );
};