import type { Expense } from '@/types';

interface Budget {
  category: string;
  amount: number;
}

export interface BudgetTipsResult {
  tips: string;
  analysis: Array<{
    category: string;
    spent: number;
    budget: number;
    percentage: number;
  }>;
  totalSpent: number;
  totalBudget: number;
  overallPercentage: number;
}

export async function getBudgetTips(
  expenses: Expense[],
  budgets: Budget[],
  period: 'month' | 'year'
): Promise<BudgetTipsResult> {
  const response = await fetch('/api/budget-tips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expenses, budgets, period })
  });
  if (!response.ok) throw new Error('Failed to get budget tips');
  return response.json();
} 