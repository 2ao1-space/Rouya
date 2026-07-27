import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"

export function useAddTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      type: "income" | "expense" | "debt" | "loan" | "salary"
      amount: number
      accountId: string
      reason: string
      notes?: string
    }) => {
      const { error } = await supabase.rpc("add_transaction", {
        p_type: input.type,
        p_amount: input.amount,
        p_account_id: input.accountId,
        p_reason: input.reason,
        p_notes: input.notes ?? null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["zakat"] })
      queryClient.invalidateQueries({ queryKey: ["reasons"] })
    },
  })
}

export function useAddTransfer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { amount: number; fromAccountId: string; toAccountId: string }) => {
      const { error } = await supabase.rpc("add_transfer", {
        p_amount: input.amount,
        p_from_account_id: input.fromAccountId,
        p_to_account_id: input.toAccountId,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (transactionId: string) => {
      const { error } = await supabase.rpc("delete_transaction", { p_transaction_id: transactionId })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["zakat"] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      transactionId: string
      amount: number
      accountId: string
      toAccountId?: string
      reason?: string
      notes?: string
    }) => {
      const { error } = await supabase.rpc("update_transaction", {
        p_transaction_id: input.transactionId,
        p_amount: input.amount,
        p_account_id: input.accountId,
        p_to_account_id: input.toAccountId ?? null,
        p_reason: input.reason ?? null,
        p_notes: input.notes ?? null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["zakat"] })
    },
  })
}