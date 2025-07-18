import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { Expense, Budget } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { expenses, budgets, period } = await request.json();
    
    console.log('API received:', { expenses, budgets, period });

    // Calculate spending by category
    const spendingByCategory: { [key: string]: number } = {};
    const budgetByCategory: { [key: string]: number } = {};

    expenses.forEach((expense: Expense) => {
      if (!spendingByCategory[expense.category]) {
        spendingByCategory[expense.category] = 0;
      }
      spendingByCategory[expense.category] += expense.amount;
    });
    budgets.forEach((budget: Budget) => {
      budgetByCategory[budget.category] = budget.amount;
    });

    const analysis = Object.keys(budgetByCategory).map(category => {
      const spent = spendingByCategory[category] || 0;
      const budget = budgetByCategory[category];
      const percentage = budget > 0 ? (spent / budget) * 100 : 0;
      return {
        category,
        spent,
        budget,
        percentage: Math.round(percentage)
      };
    });

    console.log('Analysis:', analysis);
    console.log('Spending by category:', spendingByCategory);
    console.log('Budget by category:', budgetByCategory);

    // Filter to only overspent categories for the AI prompt
    const overspentAnalysis = analysis.filter(item => item.spent > item.budget);
    
    console.log('Overspent analysis:', overspentAnalysis);

    const totalSpent = Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);
    const totalBudget = Object.values(budgetByCategory).reduce((sum, amount) => sum + amount, 0);
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const prompt = `
You are a financial dashboard assistant. Analyze the user's ${period} spending vs. their budgets. 

IMPORTANT: Only analyze and mention the categories listed below. These are the ONLY categories where the user has overspent (spent > budget).

For each overspent category listed, output a bullet point in this format:
- Category: <name> - Overspent by X%. Tip: <actionable tip>

If no overspent categories are listed below, say "Great job! You're staying within budget across all categories."

CRITICAL: Do not mention any categories that are not listed in the data below. Only work with the categories provided.

Data (ONLY overspent categories):
${overspentAnalysis.length > 0 ? overspentAnalysis.map(item => `${item.category}: Spent ₹${item.spent}/₹${item.budget} (${item.percentage}%)`).join(' | ') : 'No overspent categories'}
Total: ₹${totalSpent}/₹${totalBudget} (${Math.round(overallPercentage)}%)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a financial dashboard assistant. Be concise, actionable, and friendly.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.5
    });

    const tips = completion.choices[0].message.content?.trim();

    return NextResponse.json({ 
      tips,
      analysis,
      totalSpent,
      totalBudget,
      overallPercentage: Math.round(overallPercentage)
    });

  } catch (error) {
    console.error('Error evaluating budget tips:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate budget tips' },
      { status: 500 }
    );
  }
} 