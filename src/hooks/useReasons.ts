import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"

export function useReasonSuggestions(type: "income" | "expense") {
  return useQuery({
    queryKey: ["reasons", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reasons")
        .select("label")
        .eq("type", type)
        .order("usage_count", { ascending: false })
      if (error) throw error
      return data.map((r) => r.label)
    },
  })
}