import { BuildingOfficeIcon, BriefcaseIcon, IdentificationIcon } from '@heroicons/react/24/outline';

export const EntitySpecific = ({ props, formData, setFormData, errors }: any) => {
  const { entityType, subOrgsList, partyTypesList, panVatMode } = props;

  const inputClass = (name: string) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors[name] ? 'border-red-500' : 'border-gray-300'
    }`;

  // Helper logic for "Add New" visibility states
  const isAddingNewSubOrg = formData.subOrgName === 'ADD_NEW' || (formData.subOrgName && !subOrgsList.includes(formData.subOrgName));
  const isAddingNewPartyType = formData.partyType === 'ADD_NEW' || (formData.partyType && !partyTypesList.includes(formData.partyType));

  return (
    <>
      {/* --- SITE SPECIFIC Logic --- */}
      {entityType === 'Site' && (
        <>
          <div className="md:col-span-1">
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <BuildingOfficeIcon className="w-4 h-4 text-gray-500" /> Sub Organization <span className="text-red-500">*</span>
            </label>
            <select
              value={subOrgsList.includes(formData.subOrgName) ? formData.subOrgName : (formData.subOrgName ? 'ADD_NEW' : '')}
              onChange={(e) => setFormData({ ...formData, subOrgName: e.target.value })}
              className={inputClass('subOrgName')}
            >
              <option value="" disabled>Select Sub Organization</option>
              {subOrgsList.map((org: string) => <option key={org} value={org}>{org}</option>)}
              <option value="ADD_NEW" className="font-bold text-blue-600">Add New Sub Organization</option>
            </select>
            {errors.subOrgName && <p className="text-red-500 text-sm mt-1">{errors.subOrgName}</p>}
          </div>

          {isAddingNewSubOrg ? (
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-700 mb-2">New Sub Org Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={inputClass('subOrgName')}
                placeholder="Enter new organization"
                value={formData.subOrgName === 'ADD_NEW' ? '' : formData.subOrgName}
                onChange={(e) => setFormData({ ...formData, subOrgName: e.target.value })}
                autoFocus
              />
              {errors.subOrgName && <p className="text-red-500 text-sm mt-1">{errors.subOrgName}</p>}
            </div>
          ) : null}

          {panVatMode !== 'hidden' && (
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <IdentificationIcon className="w-4 h-4 text-gray-500" /> PAN/VAT {panVatMode === 'required' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="panVat"
                value={formData.panVat}
                onChange={(e) => setFormData({ ...formData, panVat: e.target.value.toUpperCase() })}
                className={inputClass('panVat')}
                placeholder="Enter PAN/VAT number"
              />
              {/* PAN/VAT message added here */}
              {errors.panVat && <p className="text-red-500 text-sm mt-1">{errors.panVat}</p>}
            </div>
          )}
        </>
      )}

      {/* --- PARTY SPECIFIC Logic --- */}
      {entityType === 'Party' && (
        <>
          <div className="md:col-span-1">
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <BriefcaseIcon className="w-4 h-4 text-gray-500" /> Party Type
            </label>
            <select
              value={partyTypesList.includes(formData.partyType) ? formData.partyType : (formData.partyType ? 'ADD_NEW' : '')}
              onChange={(e) => setFormData({ ...formData, partyType: e.target.value })}
              className={inputClass('partyType')}
            >
              <option value="" disabled>Select Party Type</option>
              {partyTypesList.map((type: string) => <option key={type} value={type}>{type}</option>)}
              <option value="ADD_NEW" className="font-bold text-blue-600">Add New Party Type</option>
            </select>
            {errors.partyType && <p className="text-red-500 text-sm mt-1">{errors.partyType}</p>}
          </div>

          {isAddingNewPartyType ? (
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-700 mb-2">New Party Type Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={inputClass('partyType')}
                placeholder="Enter new party type name"
                value={formData.partyType === 'ADD_NEW' ? '' : formData.partyType}
                onChange={(e) => setFormData({ ...formData, partyType: e.target.value })}
                autoFocus
              />
              {errors.partyType && <p className="text-red-500 text-sm mt-1">{errors.partyType}</p>}
            </div>
          ) : null}

          {panVatMode !== 'hidden' && (
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <IdentificationIcon className="w-4 h-4 text-gray-500" /> PAN/VAT {panVatMode === 'required' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="panVat"
                value={formData.panVat}
                onChange={(e) => setFormData({ ...formData, panVat: e.target.value.toUpperCase() })}
                className={inputClass('panVat')}
                placeholder="Enter PAN/VAT number"
              />
              {/* Validation message for PAN/VAT in Party flow */}
              {errors.panVat && <p className="text-red-500 text-sm mt-1">{errors.panVat}</p>}
            </div>
          )}
        </>
      )}
    </>
  );
};