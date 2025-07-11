import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { expenses, budgets, period } = await request.json();

    // Calculate spending by category
    const spendingByCategory: { [key: string]: number } = {};
    const budgetByCategory: { [key: string]: number } = {};

    // Group expenses by category
    expenses.forEach((expense: any) => {
      if (!spendingByCategory[expense.category]) {
        spendingByCategory[expense.category] = 0;
      }
      spendingByCategory[expense.category] += expense.amount;
    });

    // Group budgets by category
    budgets.forEach((budget: any) => {
      budgetByCategory[budget.category] = budget.amount;
    });

    // Calculate percentages and totals
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

    const totalSpent = Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);
    const totalBudget = Object.values(budgetByCategory).reduce((sum, amount) => sum + amount, 0);
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const prompt = `Evaluate spending habits for ${period} period:

${analysis.map(item => 
  `${item.category}: ₹${item.spent}/${item.budget} (${item.percentage}%)`
).join(' | ')}

Total: ₹${totalSpent}/${totalBudget} (${Math.round(overallPercentage)}%)

Respond with ONE WORD only:
- "need help" (severe overspending, >120% in multiple categories)
- "struggling" (moderate overspending, >100% in some categories)  
- "average" (close to budget, mixed over/under)
- "good" (mostly under budget, good control)
- "excellent" (well under budget, great discipline)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a financial advisor evaluating spending habits. Respond with only the single word assessment.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 10,
      temperature: 0.3
    });

    const assessment = completion.choices[0].message.content?.trim().toLowerCase();

    return NextResponse.json({ 
      assessment,
      analysis,
      totalSpent,
      totalBudget,
      overallPercentage: Math.round(overallPercentage)
    });

  } catch (error) {
    console.error('Error evaluating spending:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate spending habits' },
      { status: 500 }
    );
  }
} 