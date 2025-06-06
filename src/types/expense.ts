
export interface Expense {
  id: string;
  amount: number;
  category: 'Rental' | 'Groceries' | 'Entertainment' | 'Travel' | 'Others';
  notes: string;
  date: string;
  paymentMode: 'UPI' | 'Credit Card' | 'Net Banking' | 'Cash';
  createdAt: string;
}

export type DateFilter = 'This month' | 'Last 30 days' | 'Last 90 days' | 'All time';
