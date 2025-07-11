import type { Expense } from '@/types';

interface Budget {
  category: string;
  amount: number;
}

interface SpendingEvaluation {
  assessment: string;
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

export async function evaluateSpending(
  expenses: Expense[], 
  budgets: Budget[], 
  period: 'month' | 'year'
): Promise<SpendingEvaluation> {
  try {
    const response = await fetch('/api/evaluate-spending', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expenses,
        budgets,
        period
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate spending');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error evaluating spending:', error);
    throw error;
  }
} 