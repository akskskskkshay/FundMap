import { useEffect, useState, useRef } from 'react';
import type { Expense } from '@/types';
import type { User } from '@supabase/supabase-js';
import { getBudgetTips, BudgetTipsResult } from '@/lib/budgetTips';
import { BarChart2, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

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

const DEFAULTS = {
  month: { budget: 50000 },
  year: { budget: 500000 },
};

interface EvaluationTabProps {
  expenses: Expense[];
  user: User | null;
}

export default function EvaluationTab({ expenses, user }: EvaluationTabProps) {
  const [tips, setTips] = useState<string>('');
  const [result, setResult] = useState<BudgetTipsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const [budgets, setBudgets] = useState<{ [key: string]: number }>({});
  const [budgetsLoaded, setBudgetsLoaded] = useState(false);
  const lastCallRef = useRef<string>('');

  // Fetch user budgets from Supabase
  useEffect(() => {
    const fetchBudgets = async () => {
      // Clear budgets and tips first when period changes
      setBudgets({});
      setTips('');
      setResult(null);
      setLoading(true); // Show loader during period change
      setBudgetsLoaded(false);
      
      if (!user) {
        // Set default budgets if no user
        const defaultBudgets = Object.fromEntries(
          categories.map((cat) => [cat, DEFAULTS[period].budget])
        );
        setBudgets(defaultBudgets);
        setBudgetsLoaded(true);
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('budgets')
          .select('category, amount')
          .eq('user_id', user.id)
          .eq('period', period);

        if (error) {
          console.error('Error fetching budgets:', error);
          // Set defaults on error
          setBudgets(Object.fromEntries(categories.map((cat) => [cat, DEFAULTS[period].budget])));
          setBudgetsLoaded(true);
          setLoading(false);
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
        // Set defaults on error
        setBudgets(Object.fromEntries(categories.map((cat) => [cat, DEFAULTS[period].budget])));
      } finally {
        setBudgetsLoaded(true);
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [user, period]);

  useEffect(() => {
    const fetchTips = async () => {
      if (!budgetsLoaded) return; // Wait for budgets to be fully loaded
      if (Object.keys(budgets).length === 0) return; // Wait for budgets to load
      if (expenses.length === 0) return; // Don't call API if no expenses
      
      // Create a unique key for this call to prevent duplicates
      const callKey = `${period}-${JSON.stringify(budgets)}-${expenses.length}`;
      if (lastCallRef.current === callKey) return; // Skip if we've already made this exact call
      
      lastCallRef.current = callKey;
      setLoading(true); // Show loader while fetching tips
      
      try {
        const budgetsArray = Object.entries(budgets).map(([category, amount]) => ({
          category,
          amount
        }));
        
        console.log('Sending budgets to API:', budgetsArray);
        console.log('Sending expenses to API:', expenses);
        console.log('Current period:', period);
        
        const res = await getBudgetTips(expenses, budgetsArray, period);
        console.log('API response:', res);
        
        setTips(res.tips);
        setResult(res);
      } catch (e) {
        console.error('Error fetching tips:', e);
        setTips('Could not fetch evaluation.');
        setResult(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTips();
  }, [expenses, period, budgetsLoaded]); // Removed budgets from dependencies

  return (
    <div className="w-full py-8">
      <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-1.5 rounded-lg font-semibold border transition-all duration-200 cursor-pointer text-sm mr-2 ${period === 'month' ? 'text-purple-400 border-purple-400 bg-white/10' : 'text-white border-white hover:text-purple-400 hover:border-purple-400'}`}
            onClick={() => setPeriod('month')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-1.5 rounded-lg font-semibold border transition-all duration-200 cursor-pointer text-sm ${period === 'year' ? 'text-purple-400 border-purple-400 bg-white/10' : 'text-white border-white hover:text-purple-400 hover:border-purple-400'}`}
            onClick={() => setPeriod('year')}
          >
            Yearly
          </button>
        </div>
        <div className="w-full bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 className="text-purple-300 w-7 h-7" />
            <h2 className="text-2xl font-bold text-purple-300">Budget Evaluation & Tips</h2>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="loader mb-4"></div>
              <span className="text-white/70">Evaluating your budgets...</span>
            </div>
          ) : tips ? (
            <div className="text-white/90 whitespace-pre-line text-lg">
              {tips.split('\n').map((line, i) => (
                line.trim() && (
                  <div key={i} className="mb-2 flex items-start gap-2">
                    {line.startsWith('-') ? (
                      line.toLowerCase().includes('overspent') ? <AlertTriangle className="text-yellow-400 w-5 h-5 mt-1" /> : <CheckCircle2 className="text-green-400 w-5 h-5 mt-1" />
                    ) : <Info className="text-purple-300 w-5 h-5 mt-1" />}
                    <span>{line}</span>
                  </div>
                )
              ))}
            </div>
          ) : (
            <span className="text-white/70">No evaluation available.</span>
          )}
          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-purple-300 mb-2">Overspent Categories</h3>
              {result.analysis.filter(item => item.spent > item.budget).length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {result.analysis.filter(item => item.spent > item.budget).map((item) => (
                      <div key={item.category} className="bg-white/10 rounded-xl p-3 flex flex-col items-start">
                        <span className="font-semibold text-white">{item.category}</span>
                        <span className="text-white/80 text-sm">Spent: <span className="font-bold">₹{item.spent.toLocaleString('en-IN')}</span></span>
                        <span className="text-white/80 text-sm">Budget: <span className="font-bold">₹{item.budget.toLocaleString('en-IN')}</span></span>
                        <span className="text-red-400 text-xs font-bold mt-1">Overspent by {item.percentage - 100}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-white/80 text-center">
                    <span className="font-bold">Total Spent:</span> ₹{result.totalSpent.toLocaleString('en-IN')} &nbsp;|&nbsp; <span className="font-bold">Total Budget:</span> ₹{result.totalBudget.toLocaleString('en-IN')} &nbsp;|&nbsp; <span className="font-bold">Overall:</span> {result.overallPercentage}%
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <span className="text-green-400 font-semibold">Great job! You're staying within budget across all categories.</span>
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
} 