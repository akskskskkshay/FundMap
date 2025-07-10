import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Expense } from '@/types';

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

const COLORS = [
  '#a855f7', '#818cf8', '#f472b6', '#facc15', '#34d399', '#38bdf8', '#f87171', '#fbbf24', '#4ade80', '#c084fc', '#f472b6'
];

interface BudgetBarChartProps {
  expenses: Expense[];
}

export default function BudgetBarChart({ expenses }: BudgetBarChartProps) {
  // Group expenses by category
  const data = categories.map((cat) => ({
    category: cat,
    spent: expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  }));

  return (
    <div className="w-full bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-6">
      <h2 className="text-xl font-bold text-purple-300 mb-4 text-center">Spending by Category (Bar Chart)</h2>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="category" stroke="#fff" tick={{ fontSize: 12, fill: '#fff' }} axisLine={false} tickLine={false} />
            <YAxis stroke="#fff" tick={{ fontSize: 12, fill: '#fff' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#18181b', borderRadius: '0.5rem', border: '1px solid #a855f7', color: '#fff', fontSize: '0.95rem' }}
              formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
            />
            <Bar dataKey="spent" radius={[8, 8, 0, 0]}>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 