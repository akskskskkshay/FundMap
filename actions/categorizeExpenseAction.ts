'use server'

import { categorizeExpense } from '@/lib/categorizeExpense'

export async function categorizeFromClient(description: string): Promise<string> {
  return await categorizeExpense(description)
}
