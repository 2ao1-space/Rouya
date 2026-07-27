import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

async function fetchZakatSummary() {
  const { data, error } = await supabase
    .from("zakat_summary")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return {
    due: Number(data?.total_due ?? 0),
    paid: Number(data?.total_paid ?? 0),
  };
}

export function useZakatSummary() {
  return useQuery({ queryKey: ["zakat"], queryFn: fetchZakatSummary });
}

export function usePayZakat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      amount: number;
      accountId: string;
      recipient: string;
      proofImageUrl?: string;
      notes?: string;
    }) => {
      const { error } = await supabase.rpc("pay_zakat", {
        p_amount: input.amount,
        p_account_id: input.accountId,
        p_recipient: input.recipient,
        p_proof_image_url: input.proofImageUrl ?? null,
        p_notes: input.notes ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["zakat"] });
    },
  });
}

export interface ZakatPaymentRecord {
  id: string;
  amount: number;
  date: string;
  recipient: string;
  accountId: string;
  proofImageUrl: string | null;
  notes: string | null;
}

export function useZakatPayments() {
  return useQuery({
    queryKey: ["zakatPayments"],
    queryFn: async (): Promise<ZakatPaymentRecord[]> => {
      const { data, error } = await supabase
        .from("zakat_payments")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data.map((row) => ({
        id: row.id,
        amount: Number(row.amount),
        date: row.date,
        recipient: row.recipient,
        accountId: row.account_id,
        proofImageUrl: row.proof_image_url,
        notes: row.notes,
      }));
    },
  });
}

export function useDeleteZakatPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase.rpc("delete_zakat_payment", {
        p_payment_id: paymentId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["zakat"] });
      queryClient.invalidateQueries({ queryKey: ["zakatPayments"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
