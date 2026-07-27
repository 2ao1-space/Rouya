export type AccountType = "cash" | "mobile_wallet" | "card" | "bank";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  icon: string;
  order: number;
}

export type TransactionType =
  | "income"
  | "expense"
  | "transfer"
  | "debt"
  | "loan"
  | "salary";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  accountId: string;
  toAccountId?: string;
  reason: string;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface TransactionReason {
  id: string;
  label: string;
  type: TransactionType;
  usageCount: number;
}

export type DebtLoanStatus = "pending" | "partially_paid" | "paid";

export interface DebtRecord {
  id: string;
  creditorName: string;
  amount: number;
  paidAmount: number;
  accountId: string;
  date: string;
  notes?: string;
  status: DebtLoanStatus;
}

export interface LoanRecord {
  id: string;
  personName: string;
  amount: number;
  paidAmount: number;
  accountId: string;
  date: string;
  notes?: string;
  status: DebtLoanStatus;
}

export interface SalaryRecord {
  id: string;
  amount: number;
  accountId: string;
  date: string;
  month: string;
}

export interface ZakatMonth {
  month: string;
  dueAmount: number;
  paidAmount: number;
  carriedFromPrevious: number;
}

export interface ZakatPayment {
  id: string;
  amount: number;
  date: string;
  recipient: string;
  accountId: string;
  proofImageUrl?: string;
  notes?: string;
}
