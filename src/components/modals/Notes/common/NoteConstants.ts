export const ENTITY_TYPE_CONFIG = {
    party: {
        label: 'Party',
        key: 'party',
        nameField: 'partyName'
    },
    prospect: {
        label: 'Prospect',
        key: 'prospect',
        nameField: 'prospectName'
    },
    site: {
        label: 'Site',
        key: 'site',
        nameField: 'siteName'
    }
} as const;

export const MAX_IMAGES = 2;

export const FORM_PLACEHOLDERS = {
    title: 'Note Title',
    description: 'Provide context...',
    entitySelect: (entityType: string) => `Select ${entityType}`
} as const;

export const IMAGE_LABELS = {
    saved: 'SAVED',
    new: 'NEW'
} as const;
