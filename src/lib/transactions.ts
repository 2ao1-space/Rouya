import { Transaction } from "@/types/finance"

export interface AccountDelta {
  accountId: string
  delta: number
}

export function getTransactionDeltas(tx: Transaction): AccountDelta[] {
  switch (tx.type) {
    case "income":
    case "debt":
    case "salary":
      return [{ accountId: tx.accountId, delta: tx.amount }]
    case "expense":
    case "loan":
      return [{ accountId: tx.accountId, delta: -tx.amount }]
    case "transfer":
      return [
        { accountId: tx.accountId, delta: -tx.amount },
        { accountId: tx.toAccountId as string, delta: tx.amount },
      ]
  }
}

export function reverseDeltas(deltas: AccountDelta[]): AccountDelta[] {
  return deltas.map((d) => ({ accountId: d.accountId, delta: -d.delta }))
}