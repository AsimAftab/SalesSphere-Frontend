import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errors';

/**
 * 1. Interface Segregation
 */
export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  incurredDate: string;
  entryDate: string;
  category: string;
  categoryId?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  receipt?: string | null;
  images?: string[];
  party?: { id: string; companyName: string; } | null;
  createdBy: UserInfo;
  reviewer?: UserInfo | null;
  approvedBy?: UserInfo | null;
  approvedAt?: string | null;
  createdAt: string;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  category: string;
  incurredDate: string;
  partyId?: string;
  description?: string;
}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
  month?: string;
  submittedBy?: string;
}

/**
 * 2. API Response Interfaces
 */
interface ApiUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
}

interface ApiExpenseResponse {
  _id: string;
  title: string;
  amount: number;
  incurredDate?: string;
  createdAt: string;
  category?: { _id: string; name: string };
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  receipt?: string;
  party?: { _id: string; partyName?: string; companyName?: string };
  createdBy?: ApiUser;
  approvedBy?: ApiUser;
  approvedAt?: string;
}

/**
 * 3. Mapper Logic
 */
class ExpenseMapper {
  static toFrontend(apiExp: ApiExpenseResponse): Expense {
    const userMap = (u?: ApiUser): UserInfo => ({
      id: u?._id || u?.id || '',
      name: u?.name || 'Unknown',
      email: u?.email || ''
    });

    return {
      id: apiExp._id,
      title: apiExp.title,
      amount: apiExp.amount,
      incurredDate: apiExp.incurredDate ? new Date(apiExp.incurredDate).toISOString().split('T')[0] : '',
      entryDate: apiExp.createdAt ? new Date(apiExp.createdAt).toLocaleDateString() : '',
      category: apiExp.category?.name || 'Uncategorized',
      categoryId: apiExp.category?._id,
      description: apiExp.description || '',
      status: apiExp.status,
      receipt: apiExp.receipt || null,
      images: apiExp.receipt ? [apiExp.receipt] : [],
      party: apiExp.party ? {
        id: apiExp.party._id,
        companyName: apiExp.party.partyName || apiExp.party.companyName || 'N/A'
      } : null,
      createdBy: userMap(apiExp.createdBy),
      reviewer: apiExp.approvedBy ? userMap(apiExp.approvedBy) : null,
      approvedBy: apiExp.approvedBy ? userMap(apiExp.approvedBy) : null,
      approvedAt: apiExp.approvedAt,
      createdAt: apiExp.createdAt,
    };
  }
}

/**
 * 4. Centralized Endpoints
 */
const ENDPOINTS = API_ENDPOINTS.expenses;

/**
 * 5. Repository Pattern
 */
export const ExpenseRepository = {
  async getExpenses(options?: ExpenseFilters): Promise<Expense[]> {
    try {
      const response = await api.get(ENDPOINTS.BASE, { params: options });
      return response.data.success ? response.data.data.map(ExpenseMapper.toFrontend) : [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch expenses');
    }
  },

  async getExpenseById(id: string): Promise<Expense> {
    try {
      const response = await api.get(ENDPOINTS.DETAIL(id));
      return ExpenseMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch expense details');
    }
  },

  /**
   * CREATE: Sequential Text then Image
   */
  async createExpense(expenseData: CreateExpenseRequest, receiptFile?: File | null): Promise<Expense> {
    try {
      const payload = {
        ...expenseData,
        party: expenseData.partyId
      };
      const response = await api.post(ENDPOINTS.BASE, payload);
      const created = response.data.data;

      if (receiptFile instanceof File && created._id) {
        await ExpenseRepository.uploadExpenseReceipt(created._id, receiptFile);
        const fresh = await api.get(ENDPOINTS.DETAIL(created._id));
        return ExpenseMapper.toFrontend(fresh.data.data);
      }

      return ExpenseMapper.toFrontend(created);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to create expense');
    }
  },

  /**
   * UPDATE: Parallel execution for speed
   */
  async updateExpense(id: string, expenseData: Partial<CreateExpenseRequest>, receiptFile?: File | null): Promise<Expense> {
    try {
      const promises: Promise<unknown>[] = [];

      // 1. Queue text update
      if (Object.keys(expenseData).length > 0) {
        const payload: Record<string, string | number | undefined> = {
          ...expenseData,
          amount: expenseData.amount ? Number(expenseData.amount) : undefined,
          party: expenseData.partyId,
        };

        promises.push(api.put(ENDPOINTS.DETAIL(id), payload));
      }

      // 2. Queue image upload
      if (receiptFile instanceof File) {
        promises.push(ExpenseRepository.uploadExpenseReceipt(id, receiptFile));
      }

      // 3. Parallel trigger
      await Promise.all(promises);

      // 4. Final synchronization fetch
      const fresh = await api.get(ENDPOINTS.DETAIL(id));
      return ExpenseMapper.toFrontend(fresh.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update expense');
    }
  },

  async uploadExpenseReceipt(id: string, file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('receipt', file);

      await api.post(ENDPOINTS.RECEIPT(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to upload receipt');
    }
  },

  async deleteExpenseReceipt(id: string): Promise<Expense> {
    try {
      // 1. Perform the deletion on the server
      await api.delete(ENDPOINTS.RECEIPT(id));

      // 2. Delay slightly or bypass cache if necessary to ensure DB consistency
      const response = await api.get(ENDPOINTS.DETAIL(id), {
        params: { _t: Date.now() } // Cache buster
      });

      // 3. Map and return the fresh data so React Query updates the UI state
      return ExpenseMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete receipt');
    }
  },

  async deleteExpense(id: string): Promise<boolean> {
    try {
      const response = await api.delete(ENDPOINTS.DETAIL(id));
      return response.data.success;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete expense');
    }
  },

  async bulkDeleteExpenses(ids: string[]): Promise<boolean> {
    try {
      const response = await api.delete(ENDPOINTS.BULK_DELETE, { data: { ids } });
      return response.data.success;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete expenses');
    }
  },

  async updateExpenseStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<Expense> {
    try {
      const response = await api.put(ENDPOINTS.STATUS(id), { status });
      return ExpenseMapper.toFrontend(response.data.data);
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update expense status');
    }
  },

  async getExpenseCategories(): Promise<string[]> {
    try {
      const response = await api.get(ENDPOINTS.CATEGORIES);
      return response.data.success ? response.data.data.map((cat: { name: string }) => cat.name) : [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch expense categories');
    }
  },

  async getExpenseCategoryItems(): Promise<{ _id: string; name: string }[]> {
    try {
      const response = await api.get(ENDPOINTS.CATEGORIES);
      return response.data.success ? response.data.data : [];
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to fetch expense categories');
    }
  },

  async createExpenseCategory(name: string): Promise<{ _id: string; name: string }> {
    try {
      const response = await api.post(ENDPOINTS.CATEGORIES, { name });
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to create expense category');
    }
  },

  async updateExpenseCategory(id: string, name: string): Promise<{ _id: string; name: string }> {
    try {
      const response = await api.put(ENDPOINTS.CATEGORY_DETAIL(id), { name });
      return response.data.data;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to update expense category');
    }
  },

  async deleteExpenseCategory(id: string): Promise<boolean> {
    try {
      const response = await api.delete(ENDPOINTS.CATEGORY_DETAIL(id));
      return response.data.success;
    } catch (error: unknown) {
      throw handleApiError(error, 'Failed to delete expense category');
    }
  }
};

export const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  deleteExpenseReceipt,
  uploadExpenseReceipt,
  bulkDeleteExpenses,
  updateExpenseStatus,
  getExpenseCategories,
  getExpenseCategoryItems,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory
} = ExpenseRepository;