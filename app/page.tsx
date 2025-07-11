import Link from 'next/link';
import { ArrowRight, PieChart, Target, TrendingUp, Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | FundMap',
  description: 'Smart budgeting, expense tracking, and AI-powered insights to help you achieve your financial goals.',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        <div className="text-center z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Take Control of Your
            <span className="block text-purple-300 drop-shadow-[0_0_20px_#A855F7]"> Financial Future</span>
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Smart budgeting, expense tracking, and AI-powered insights to help you achieve your financial goals.
          </p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white backdrop-blur-md border border-purple-400/40 shadow-[0_0_20px_#A855F7] hover:shadow-[0_0_30px_#A855F7] transition-all p-4 font-bold cursor-pointer duration-200 rounded-xl text-lg animate-gradient"
          >
            Start Budgeting Now
            <ArrowRight size={20} />
          </Link>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose <span className="text-purple-300">FundMap</span>?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Analytics</h3>
              <p className="text-white/70">
                Visual insights into your spending patterns with interactive charts and AI-powered analysis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Goal Setting</h3>
              <p className="text-white/70">
                Set monthly and yearly budgets for different categories and track your progress in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Evaluation</h3>
              <p className="text-white/70">
                Get instant feedback on your spending habits with AI-powered financial health assessments.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure & Private</h3>
              <p className="text-white/70">
                Your financial data is encrypted and secure. We never share your personal information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
