import { useState, useMemo, useEffect } from 'react';
import type { Expense } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

const categories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Travel',
  'Subscriptions',
  'Luxury',
  'Investment',
];

const mid = Math.ceil(categories.length / 2);
const leftCategories = categories.slice(0, mid);
const rightCategories = categories.slice(mid);

interface BudgetingProps {
  expenses: Expense[];
  user: User | null;
}

const PERIODS = [
  { label: 'Monthly', value: 'month' },
  { label: 'Yearly', value: 'year' },
];

const DEFAULTS = {
  month: { budget: 50000, max: 200000 },
  year: { budget: 500000, max: 1000000 },
};

export default function Budgeting({ expenses, user }: BudgetingProps) {
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const [budgets, setBudgets] = useState<{ [key: string]: number }>(
    Object.fromEntries(categories.map((cat) => [cat, DEFAULTS['month'].budget]))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch existing budgets from Supabase
  useEffect(() => {
    const fetchBudgets = async () => {
      if (!user) {
        setIsInitialLoading(false);
        return;
      }
      
      try {
        setIsInitialLoading(true);
        const { data, error } = await supabase
          .from('budgets')
          .select('category, amount')
          .eq('user_id', user.id)
          .eq('period', period);

        if (error) {
          console.error('Error fetching budgets:', error);
          return;
        }

        if (data && data.length > 0) {
          const fetchedBudgets: { [key: string]: number } = {};
          data.forEach((budget) => {
            fetchedBudgets[budget.category] = budget.amount;
          });
          
          // Merge with defaults for missing categories
          const mergedBudgets = Object.fromEntries(
            categories.map((cat) => [cat, fetchedBudgets[cat] || DEFAULTS[period].budget])
          );
          setBudgets(mergedBudgets);
        } else {
          // No existing budgets, set defaults
          setBudgets(Object.fromEntries(categories.map((cat) => [cat, DEFAULTS[period].budget])));
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchBudgets();
  }, [user, period]);

  // Update budget in Supabase when slider changes
  const updateBudget = async (category: string, amount: number) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      console.log('Updating budget:', { user_id: user.id, category, amount, period });
      
      // Use upsert to handle both insert and update
      const { error } = await supabase
        .from('budgets')
        .upsert({
          user_id: user.id,
          category: category,
          amount: Number(amount),
          period: period
        }, {
          onConflict: 'user_id,category,period'
        });

      if (error) {
        console.error('Error upserting budget:', error);
      } else {
        console.log('Budget upserted successfully');
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter expenses by selected period
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    if (period === 'month') {
      return expenses.filter((exp) => {
        const d = new Date(exp.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      });
    } else {
      return expenses.filter((exp) => {
        const d = new Date(exp.date);
        return d.getFullYear() === now.getFullYear();
      });
    }
  }, [expenses, period]);

  // Calculate total spent per category for the selected period
  const spentPerCategory = useMemo(() => {
    const totals: { [key: string]: number } = {};
    for (const cat of categories) totals[cat] = 0;
    for (const exp of filteredExpenses) {
      if (categories.includes(exp.category)) {
        totals[exp.category] += exp.amount;
      }
    }
    return totals;
  }, [filteredExpenses]);

  function renderSlider(cat: string) {
    return (
      <div key={cat} className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <span className="w-32 text-white font-semibold text-md text-left">{cat}</span>
        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={DEFAULTS[period].max}
            step={100}
            value={budgets[cat]}
            onChange={(e) => {
              const newAmount = Number(e.target.value);
              setBudgets((prev) => ({ ...prev, [cat]: newAmount }));
            }}
            onMouseUp={(e) => {
              const newAmount = Number(e.currentTarget.value);
              updateBudget(cat, newAmount);
            }}
            onTouchEnd={(e) => {
              const newAmount = Number(e.currentTarget.value);
              updateBudget(cat, newAmount);
            }}
            className="accent-purple-400 h-2 rounded-lg appearance-none cursor-pointer bg-white/20 w-full"
            disabled={isInitialLoading}
          />
        </div>
        <span className="w-24 text-purple-300 font-bold text-lg text-right">₹{budgets[cat].toLocaleString('en-IN')}</span>
      </div>
    );
  }

  function renderProgressBar(cat: string) {
    const budget = budgets[cat];
    const spent = spentPerCategory[cat] || 0;
    const percent = budget === 0 ? 0 : Math.min((spent / budget) * 100, 100);
    const overBudget = spent > budget;
    return (
      <div key={cat} className="flex items-center gap-4 w-full mb-2">
        <span className="w-32 text-white font-semibold text-md text-left">{cat}</span>
        <div className="flex-1 relative h-5 bg-white/20 rounded-full overflow-hidden border border-white/30 shadow-md">
          <div
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${overBudget ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="w-36 text-xs text-right flex flex-col items-end">
          <span className={`font-bold ${overBudget ? 'text-red-400' : 'text-green-400'}`}>₹{spent.toLocaleString('en-IN')}</span>
          <span className="text-white/70">/ ₹{budget.toLocaleString('en-IN')}</span>
        </span>
        <span className="w-12 text-white font-bold text-xs text-right">{budget === 0 ? '0%' : `${Math.round((spent / budget) * 100)}%`}</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col gap-8">
      {isInitialLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="loader mb-4"></div>
          <p className="text-white/70 text-lg">Loading your budgets...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <h2 className="text-2xl font-bold text-purple-300 text-center">Set Your Budgets</h2>
            <div className="flex gap-2 justify-center sm:justify-end">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value as 'month' | 'year')}
                  className={`px-4 py-1.5 rounded-lg font-semibold border transition-all duration-200 cursor-pointer text-sm
                    ${period === p.value ? 'text-purple-400 border-purple-400 bg-white/10' : 'text-white border-white hover:text-purple-400 hover:border-purple-400'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="flex-1 flex flex-col gap-6">
              {leftCategories.map(renderSlider)}
            </div>
            <div className="flex-1 flex flex-col gap-6">
              {rightCategories.map(renderSlider)}
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-bold text-purple-300 mb-4 text-center">Budget Usage Progress ({period === 'month' ? 'This Month' : 'This Year'})</h3>
            <div className="flex flex-col gap-2 w-full">
              {categories.map(renderProgressBar)}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 