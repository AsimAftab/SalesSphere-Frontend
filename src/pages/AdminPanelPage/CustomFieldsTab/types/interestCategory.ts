import type { ProspectCategoryData } from '@/api/prospectService';
import type { SiteCategoryData, Technician } from '@/api/siteService';

export type InterestCategory = SiteCategoryData | ProspectCategoryData;

export interface InterestFormState {
  name: string;
  brands: string[];
  technicians: Technician[];
}

