import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function categorizeExpense(description: string): Promise<string> {

    const knownVendors: Record<string, string> = {
        uber: 'Transport',
        swiggy: 'Food',
        zomato: 'Food',
        netflix: 'Entertainment',
        spotify: 'Subscriptions',
        amazon: 'Shopping',
        myntra: 'Shopping',
        flipkart: 'Shopping',
        ola: 'Transport',
        bigbasket: 'Food',
        cred: 'Bills',
        }

        const lowerDesc = description.toLowerCase()

    for (const vendor in knownVendors) {
        if (lowerDesc.includes(vendor)) {
        return knownVendors[vendor]
        }
    }

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that categorizes user expenses into one of the following categories: Food, Transport, Shopping, Bills, Entertainment, Health, Travel, Subscriptions, Luxury, or Other.',
        },
        {
          role: 'user',
          content: `Categorize this expense: "${description}". Respond with only one category word.`,
        },
      ],
    })

    return res.choices[0].message.content?.trim() || 'Other'
  } catch (error) {
    console.error('Error categorizing expense:', error)
    return 'Other'
  }
}