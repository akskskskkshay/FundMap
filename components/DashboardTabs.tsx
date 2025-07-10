import { useState } from 'react';
import TopExpTable from './TopExpTable';
import CategPie from './CategPie';
import Budgeting from './Budgeting';
import BudgetBarChart from './BudgetBarChart';
import type { Expense } from '@/types';
import { User } from '@supabase/supabase-js';

interface DashboardTabsProps {
  expenses: Expense[];
  user: User | null;
}

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Budgeting', value: 'budgeting' },
];

export default function DashboardTabs({ expenses, user }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className='w-full'>
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-1.5 text-sm rounded-lg font-semibold border transition-all duration-200 cursor-pointer
              ${activeTab === tab.value
                ? 'text-purple-400 border-purple-400'
                : 'text-white border-white hover:text-purple-400 hover:border-purple-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === 'overview' && (
          <div className="flex flex-col md:flex-row w-full gap-8 items-center">
            <div className="flex-1 min-w-0">
              <TopExpTable expense={expenses} />
            </div>
            <div className="flex-1 min-w-0">
              <CategPie expense={expenses} />
            </div>
          </div>
        )}
        {activeTab === 'budgeting' && (
          <Budgeting expenses={expenses} user={user} />
        )}
      </div>
    </div>
  );
} 