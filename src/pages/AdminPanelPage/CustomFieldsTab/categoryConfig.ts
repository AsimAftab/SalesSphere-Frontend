import { ExpenseRepository } from '@/api/expenseService';
import { SiteRepository } from '@/api/siteService';
import { ProspectRepository } from '@/api/prospectService';
import { PartyRepository } from '@/api/partyService';
import { ProductRepository } from '@/api/productService';
import { CollectionRepository } from '@/api/collectionService';

import productsIcon from '@/assets/images/icons/products-icon.svg';
import partiesIcon from '@/assets/images/icons/parties-icon.svg';
import prospectsIcon from '@/assets/images/icons/prospects-icon.svg';
import sitesIcon from '@/assets/images/icons/sites-icon.svg';
import collectionIcon from '@/assets/images/icons/collection.svg';
import expensesIcon from '@/assets/images/icons/expenses-icon.svg';

export interface CustomizableEntity {
  _id: string;
  name: string;
}

export interface CategoryConfig {
  key: string;
  label: string;
  description: string;
  icon: string;
  module: string;
  queryKey: string[];
  supportsCreate: boolean;
  api: {
    fetch: () => Promise<CustomizableEntity[]>;
    create?: (name: string) => Promise<CustomizableEntity>;
    update: (id: string, name: string) => Promise<CustomizableEntity>;
    delete: (id: string) => Promise<boolean>;
  };
  messages: {
    entityName: string;
    emptyTitle: string;
    emptyDescription: string;
  };
}

// Ordered to match entity flow and main sidebar behavior.
export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    key: 'productCategories',
    label: 'Product Categories',
    description: 'Manage categories for products',
    icon: productsIcon,
    module: 'products',
    queryKey: ['customization', 'productCategories'],
    supportsCreate: true,
    api: {
      fetch: async () => {
        const categories = await ProductRepository.getCategories();
        return categories.map((c) => ({ _id: c._id, name: c.name }));
      },
      create: async (name: string) => {
        const category = await ProductRepository.createCategory(name);
        return { _id: category._id, name: category.name };
      },
      update: async (id: string, name: string) => {
        const category = await ProductRepository.updateCategory(id, name);
        return { _id: category._id, name: category.name };
      },
      delete: (id: string) => ProductRepository.deleteCategory(id),
    },
    messages: {
      entityName: 'product category',
      emptyTitle: 'No Product Categories',
      emptyDescription: 'Create your first product category to get started.',
    },
  },
  {
    key: 'partyTypes',
    label: 'Party Types',
    description: 'Manage types for parties',
    icon: partiesIcon,
    module: 'parties',
    queryKey: ['customization', 'partyTypes'],
    supportsCreate: true,
    api: {
      fetch: () => PartyRepository.getPartyTypeItems(),
      create: (name: string) => PartyRepository.createPartyType(name),
      update: (id: string, name: string) => PartyRepository.updatePartyType(id, name),
      delete: (id: string) => PartyRepository.deletePartyType(id),
    },
    messages: {
      entityName: 'party type',
      emptyTitle: 'No Party Types',
      emptyDescription: 'Create your first party type to get started.',
    },
  },
  {
    key: 'prospectInterestCategories',
    label: 'Prospect Interest',
    description: 'Manage categories for prospect interests',
    icon: prospectsIcon,
    module: 'prospects',
    queryKey: ['customization', 'prospectInterestCategories'],
    supportsCreate: true,
    api: {
      fetch: () => ProspectRepository.getProspectCategoryItems(),
      create: (name: string) => ProspectRepository.createProspectCategory(name),
      update: (id: string, name: string) => ProspectRepository.updateProspectCategory(id, name),
      delete: (id: string) => ProspectRepository.deleteProspectCategory(id),
    },
    messages: {
      entityName: 'prospect interest category',
      emptyTitle: 'No Prospect Interest Categories',
      emptyDescription: 'Create your first prospect interest category to get started.',
    },
  },
  {
    key: 'subOrganizations',
    label: 'Sub-Organizations',
    description: 'Manage sub-organizations for sites',
    icon: sitesIcon,
    module: 'sites',
    queryKey: ['customization', 'subOrganizations'],
    supportsCreate: true,
    api: {
      fetch: () => SiteRepository.getSubOrganizationItems(),
      create: (name: string) => SiteRepository.createSubOrganization(name),
      update: (id: string, name: string) => SiteRepository.updateSubOrganization(id, name),
      delete: (id: string) => SiteRepository.deleteSubOrganization(id),
    },
    messages: {
      entityName: 'sub-organization',
      emptyTitle: 'No Sub-Organizations',
      emptyDescription: 'Create your first sub-organization to get started.',
    },
  },
  {
    key: 'siteInterestCategories',
    label: 'Site Interest',
    description: 'Manage categories for site interests',
    icon: sitesIcon,
    module: 'sites',
    queryKey: ['customization', 'siteInterestCategories'],
    supportsCreate: true,
    api: {
      fetch: () => SiteRepository.getSiteCategoryItems(),
      create: (name: string) => SiteRepository.createSiteCategory(name),
      update: (id: string, name: string) => SiteRepository.updateSiteCategory(id, name),
      delete: (id: string) => SiteRepository.deleteSiteCategory(id),
    },
    messages: {
      entityName: 'site interest category',
      emptyTitle: 'No Site Interest Categories',
      emptyDescription: 'Create your first site interest category to get started.',
    },
  },
  {
    key: 'bankNames',
    label: 'Bank Names',
    description: 'Manage bank names used in collections',
    icon: collectionIcon,
    module: 'collections',
    queryKey: ['customization', 'bankNames'],
    supportsCreate: true,
    api: {
      fetch: () => CollectionRepository.getBankNames(),
      create: (name: string) => CollectionRepository.createBankName(name),
      update: (id: string, name: string) => CollectionRepository.updateBankName(id, name),
      delete: (id: string) => CollectionRepository.deleteBankName(id),
    },
    messages: {
      entityName: 'bank name',
      emptyTitle: 'No Bank Names',
      emptyDescription: 'Add your first bank name to get started.',
    },
  },
  {
    key: 'expenseCategories',
    label: 'Expense Categories',
    description: 'Manage categories for expense claims',
    icon: expensesIcon,
    module: 'expenses',
    queryKey: ['customization', 'expenseCategories'],
    supportsCreate: true,
    api: {
      fetch: () => ExpenseRepository.getExpenseCategoryItems(),
      create: (name: string) => ExpenseRepository.createExpenseCategory(name),
      update: (id: string, name: string) => ExpenseRepository.updateExpenseCategory(id, name),
      delete: (id: string) => ExpenseRepository.deleteExpenseCategory(id),
    },
    messages: {
      entityName: 'expense category',
      emptyTitle: 'No Expense Categories',
      emptyDescription: 'Create your first expense category to get started.',
    },
  },
];
