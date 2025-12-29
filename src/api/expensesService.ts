// /src/api/expenseService.ts

export interface Expense {
  _id: string;
  title: string;
  incurredDate: string;
  entryDate: string;
  amount: number;
  category: string;
  description: string;
  createdBy: { name: string; avatarUrl?: string };
  reviewedBy?: { name: string; avatarUrl?: string }; // Approved/Rejected by
  status: "pending" | "approved" | "rejected";
  images: string[];
}

export interface GetExpensesOptions {
  page: number;
  limit: number;
  date?: string;
  month?: string;
  year?: string;
}

export interface GetExpensesResponse {
  data: Expense[];
  pagination: {
    total: number;
    pages: number;
  };
}

// Mock Data
const MOCK_EXPENSES: Expense[] = Array.from({ length: 25 }, (_, i) => ({
  _id: `exp-${i}`,
  title: `Office Supplies ${i + 1}`,
  incurredDate: "2023-12-20",
  entryDate: "2023-12-21",
  amount: 1200 + i * 100,
  category: i % 2 === 0 ? "Stationery" : "Travel",
  description: "Bought notebooks and pens for the team.",
  createdBy: { name: "John Doe" },
  reviewedBy: i % 3 === 0 ? { name: "Admin User" } : undefined,
  status: i % 3 === 0 ? "approved" : i % 3 === 1 ? "pending" : "rejected",
  images: ["https://via.placeholder.com/400"],
}));

export const getExpenses = async (options: GetExpensesOptions): Promise<GetExpensesResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const start = (options.page - 1) * options.limit;
  const end = start + options.limit;
  
  return {
    data: MOCK_EXPENSES.slice(start, end),
    pagination: {
      total: MOCK_EXPENSES.length,
      pages: Math.ceil(MOCK_EXPENSES.length / options.limit),
    },
  };
};

export const getExpenseById = async (id: string): Promise<Expense> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  // In a real app, this would be: return axios.get(`/expenses/${id}`).then(res => res.data);
  const expense = MOCK_EXPENSES.find(e => e._id === id);
  if (!expense) throw new Error("Expense not found");
  
  return expense;
};