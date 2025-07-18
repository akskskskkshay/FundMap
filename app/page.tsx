import Link from 'next/link';
import { ArrowRight, PieChart, Target, TrendingUp, Shield } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

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

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_20px_#A855F7]/10 hover:shadow-[0_0_30px_#A855F7]/20 transition-all duration-300">
              <h3 className="text-2xl font-bold text-purple-300 mb-2">Free</h3>
              <div className="text-4xl font-extrabold text-white mb-4">$0<span className="text-lg font-medium text-white/60">/mo</span></div>
              <ul className="text-white/80 mb-6 space-y-2">
                <li>Up to 50 transactions/month</li>
                <li>Basic budgeting tools</li>
                <li>Pie chart analytics</li>
                <li>Email support</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold py-2 rounded-xl animate-gradient transition-all cursor-pointer">Get Started</button>
            </div>
            {/* Pro Plan */}
            <div className="bg-white/20 backdrop-blur-lg border-2 border-purple-400/40 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_30px_#A855F7]/20 hover:shadow-[0_0_40px_#A855F7]/30 transition-all duration-300 scale-105">
              <h3 className="text-2xl font-bold text-purple-200 mb-2">Pro</h3>
              <div className="text-4xl font-extrabold text-white mb-4">$7<span className="text-lg font-medium text-white/60">/mo</span></div>
              <ul className="text-white/90 mb-6 space-y-2">
                <li>Unlimited transactions</li>
                <li>Advanced budgeting & analytics</li>
                <li>AI-powered spending evaluation</li>
                <li>Priority email support</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold py-2 rounded-xl animate-gradient transition-all cursor-pointer">Upgrade to Pro</button>
            </div>
            {/* Ultimate Plan */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_20px_#A855F7]/10 hover:shadow-[0_0_30px_#A855F7]/20 transition-all duration-300">
              <h3 className="text-2xl font-bold text-purple-300 mb-2">Ultimate</h3>
              <div className="text-4xl font-extrabold text-white mb-4">$15<span className="text-lg font-medium text-white/60">/mo</span></div>
              <ul className="text-white/80 mb-6 space-y-2">
                <li>Everything in Pro</li>
                <li>Personalized AI financial coaching</li>
                <li>Early access to new features</li>
                <li>1-on-1 onboarding</li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold py-2 rounded-xl animate-gradient transition-all cursor-pointer">Go Ultimate</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/10 backdrop-blur-lg border border-purple-400/20 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_20px_#A855F7]/10 hover:shadow-[0_0_30px_#A855F7]/20 transition-all duration-300">
              <Image src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" width={64} height={64} className="w-16 h-16 rounded-full border-4 border-purple-300 mb-4 shadow-lg" />
              <p className="text-white/80 text-lg mb-4 italic">“FundMap helped me finally stick to my budget and save for my dream vacation. The AI tips are spot on!”</p>
              <span className="text-purple-300 font-bold">Priya S.</span>
              <span className="text-white/50 text-sm">Marketing Manager</span>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white/10 backdrop-blur-lg border border-purple-400/20 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_20px_#A855F7]/10 hover:shadow-[0_0_30px_#A855F7]/20 transition-all duration-300">
              <Image src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" width={64} height={64} className="w-16 h-16 rounded-full border-4 border-purple-300 mb-4 shadow-lg" />
              <p className="text-white/80 text-lg mb-4 italic">“The dashboard is beautiful and easy to use. I love seeing my spending breakdown and getting instant feedback.”</p>
              <span className="text-purple-300 font-bold">Alex R.</span>
              <span className="text-white/50 text-sm">Software Engineer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white/10 backdrop-blur-lg border-t border-purple-400/20 py-8 px-4 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-purple-300 drop-shadow-[0_0_10px_#A855F7]">[FM]</span>
          </div>
          <div className="flex gap-6 text-white/70 text-sm">
            <a href="#" className="hover:text-purple-300 transition-colors">About</a>
            <a href="#" className="hover:text-purple-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-purple-300 transition-colors">Contact</a>
          </div>
          <div className="text-white/40 text-xs">&copy; {new Date().getFullYear()} FundMap. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
