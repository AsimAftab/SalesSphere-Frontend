// src/api/tourPlanService.ts

export interface TourPlan {
  _id: string;
  employee: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  placeOfVisit: string;
  startDate: string;
  endDate: string;
  noOfDays: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewer: string;
}

export const getTourPlans = async (): Promise<TourPlan[]> => {
  // Simulating an API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      _id: "1",
      employee: { name: "Anish Pokhrel", role: "Sales Executive" },
      placeOfVisit: "Kathmandu, Nepal",
      startDate: "2025-12-15T00:00:00.000Z",
      endDate: "2025-12-18T00:00:00.000Z",
      noOfDays: 4,
      status: "Pending",
      reviewer: "Ashok Admin",
    },
    {
      _id: "2",
      employee: { name: "Ankit Gupta", role: "Manager" },
      placeOfVisit: "Pokhara, Nepal",
      startDate: "2025-12-20T00:00:00.000Z",
      endDate: "2025-12-25T00:00:00.000Z",
      noOfDays: 6,
      status: "Approved",
      reviewer: "System Admin",
    },
    {
      _id: "3",
      employee: { name: "Suman Sharma", role: "Salesperson" },
      placeOfVisit: "Butwal, Nepal",
      startDate: "2025-12-28T00:00:00.000Z",
      endDate: "2025-12-30T00:00:00.000Z",
      noOfDays: 3,
      status: "Rejected",
      reviewer: "Asim Manager",
    }
  ];
};