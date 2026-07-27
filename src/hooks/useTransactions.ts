import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"
import { Transaction } from "@/types/finance"

async function fetchMonthTransactions(): Promise<Transaction[]> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .gte("date", startOfMonth)
    .order("date", { ascending: false })

  if (error) throw error

  return data.map((row) => ({
    id: row.id,
    type: row.type,
    amount: Number(row.amount),
    accountId: row.account_id,
    toAccountId: row.to_account_id ?? undefined,
    reason: row.reason,
    notes: row.notes ?? undefined,
    date: row.date,
    createdAt: row.created_at,
  }))
}

export function useMonthTransactions() {
  return useQuery({ queryKey: ["transactions", "month"], queryFn: fetchMonthTransactions })
}