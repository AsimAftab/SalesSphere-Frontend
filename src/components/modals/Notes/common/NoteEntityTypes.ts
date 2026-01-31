/**
 * Entity interfaces for Notes module
 * These types represent the entities that notes can be linked to
 */

/**
 * Base entity reference with common fields
 */
export interface EntityReference {
    id: string;
    _id?: string;
    name?: string;
}

/**
 * Party entity from the parties module
 */
export interface PartyEntity extends EntityReference {
    partyName?: string;
    companyName?: string;
}

/**
 * Prospect entity from the prospects module
 */
export interface ProspectEntity extends EntityReference {
    prospectName?: string;
    prospect_name?: string;
}

/**
 * Site entity from the sites module
 */
export interface SiteEntity extends EntityReference {
    siteName?: string;
    site_name?: string;
}

/**
 * Union type for all linkable entities
 */
export type LinkableEntity = PartyEntity | ProspectEntity | SiteEntity;

/**
 * Represents an image already stored on the server.
 * Single source of truth — used by useFileGallery, ImageUploadSection, and form components.
 */
export interface ExistingImage {
    imageUrl: string;
    publicId?: string;
    _id?: string;
}
