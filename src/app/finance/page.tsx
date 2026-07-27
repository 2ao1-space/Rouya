"use client";

import { useState } from "react";
import { Transaction, TransactionType } from "@/types/finance";
import { useAccounts } from "@/hooks/useAccounts";
import { useMonthTransactions } from "@/hooks/useTransactions";
import {
  useAddTransaction,
  useAddTransfer,
  useDeleteTransaction,
  useUpdateTransaction,
} from "@/hooks/useTransactionMutations";
import {
  useZakatSummary,
  usePayZakat,
  ZakatPaymentRecord,
} from "@/hooks/useZakat";
import { useReasonSuggestions } from "@/hooks/useReasons";

import { BalanceCard } from "@/components/finance/Balancecard";
import { AccountChips } from "@/components/finance/Accountchips";
import { QuickActions } from "@/components/finance/Quickactions";
import { DailySummary } from "@/components/finance/Dailysummary";
import { ZakatSection } from "@/components/finance/Zakatsection";
import { TransactionsList } from "@/components/finance/Transactionslist";
import { IncomeExpenseModal } from "@/components/finance/modals/IncomeExpenseModal";
import { TransferModal } from "@/components/finance/modals/TransferModal";
import { DebtModal } from "@/components/finance/modals/DebtModal";
import { LoanModal } from "@/components/finance/modals/LoanModal";
import { SalaryModal } from "@/components/finance/modals/SalaryModal";
import { ZakatPayModal } from "@/components/finance/modals/ZakatPayModal";
import { MonthlyTransactionsModal } from "@/components/finance/modals/MonthlyTransactionsModal";
import { EditTransactionModal } from "@/components/finance/modals/EditTransactionModal";
import { ZakatHistoryModal } from "@/components/finance/modals/ZakatHistoryModal";
import { supabase } from "@/lib/supabase/client";
import { uploadZakatProof } from "@/lib/supabase/storage";

type ModalKind = TransactionType | "zakatPay" | null;

export default function FinancePage() {
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: transactions = [], isLoading: transactionsLoading } =
    useMonthTransactions();
  const { data: zakat = { due: 0, paid: 0 } } = useZakatSummary();
  const { data: expenseReasons = [] } = useReasonSuggestions("expense");
  const { data: incomeReasons = [] } = useReasonSuggestions("income");

  const addTransaction = useAddTransaction();
  const addTransfer = useAddTransfer();
  const deleteTransaction = useDeleteTransaction();
  const updateTransaction = useUpdateTransaction();
  const payZakat = usePayZakat();

  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [showZakatHistory, setShowZakatHistory] = useState(false);
  const [editingZakatPayment, setEditingZakatPayment] =
    useState<ZakatPaymentRecord | null>(null);

  if (accountsLoading || transactionsLoading) {
    return (
      <p className="p-6 text-center text-sm text-neutral-400">
        بنجهزلك بياناتك...
      </p>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const today = new Date().toDateString();
  const todayTransactions = transactions.filter(
    (t) => new Date(t.date).toDateString() === today,
  );
  const todayIncome = todayTransactions
    .filter(
      (t) => t.type === "income" || t.type === "salary" || t.type === "debt",
    )
    .reduce((sum, t) => sum + t.amount, 0);
  const todayExpense = todayTransactions
    .filter((t) => t.type === "expense" || t.type === "loan")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-lg px-4 py-6 pb-24 flex flex-col gap-5"
    >
      <BalanceCard totalBalance={totalBalance} />
      <AccountChips accounts={accounts} />
      <QuickActions onAction={(type) => setActiveModal(type)} />
      <DailySummary todayIncome={todayIncome} todayExpense={todayExpense} />
      <ZakatSection
        due={zakat.due}
        paid={zakat.paid}
        onPayClick={() => setActiveModal("zakatPay")}
        onDetailsClick={() => setShowZakatHistory(true)}
      />
      <TransactionsList
        transactions={todayTransactions}
        accounts={accounts}
        onViewAll={() => setShowMonthlyModal(true)}
        onEdit={setEditingTransaction}
        onDelete={(tx) => deleteTransaction.mutate(tx.id)}
      />

      {(activeModal === "income" || activeModal === "expense") && (
        <IncomeExpenseModal
          type={activeModal}
          accounts={accounts}
          reasonSuggestions={
            activeModal === "income" ? incomeReasons : expenseReasons
          }
          onClose={() => setActiveModal(null)}
          onSubmit={(data) =>
            addTransaction.mutate({
              type: activeModal,
              amount: data.amount,
              accountId: data.accountId,
              reason: data.reason,
              notes: data.notes,
            })
          }
        />
      )}

      {activeModal === "transfer" && (
        <TransferModal
          accounts={accounts}
          onClose={() => setActiveModal(null)}
          onSubmit={(data) => addTransfer.mutate(data)}
        />
      )}

      {activeModal === "debt" && (
        <DebtModal
          accounts={accounts}
          onClose={() => setActiveModal(null)}
          onSubmit={(data) =>
            addTransaction.mutate({
              type: "debt",
              amount: data.amount,
              accountId: data.accountId,
              reason: data.creditorName,
              notes: data.notes,
            })
          }
        />
      )}

      {activeModal === "loan" && (
        <LoanModal
          accounts={accounts}
          onClose={() => setActiveModal(null)}
          onSubmit={(data) =>
            addTransaction.mutate({
              type: "loan",
              amount: data.amount,
              accountId: data.accountId,
              reason: data.personName,
              notes: data.notes,
            })
          }
        />
      )}

      {activeModal === "salary" && (
        <SalaryModal
          accounts={accounts}
          onClose={() => setActiveModal(null)}
          onSubmit={(data) =>
            addTransaction.mutate({
              type: "salary",
              amount: data.amount,
              accountId: data.accountId,
              reason: "راتب",
            })
          }
        />
      )}

      {activeModal === "zakatPay" && (
        <ZakatPayModal
          accounts={accounts}
          remaining={zakat.due - zakat.paid}
          onClose={() => setActiveModal(null)}
          onSubmit={async (data) => {
            let proofImageUrl: string | undefined;
            if (data.proofFile) {
              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (user)
                proofImageUrl = await uploadZakatProof(data.proofFile, user.id);
            }
            payZakat.mutate({
              amount: data.amount,
              accountId: data.accountId,
              recipient: data.recipient,
              notes: data.notes,
              proofImageUrl,
            });
            setActiveModal(null);
          }}
        />
      )}

      {showMonthlyModal && (
        <MonthlyTransactionsModal
          transactions={transactions}
          accounts={accounts}
          onClose={() => setShowMonthlyModal(false)}
        />
      )}

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          accounts={accounts}
          reasonSuggestions={
            editingTransaction.type === "income"
              ? incomeReasons
              : expenseReasons
          }
          onClose={() => setEditingTransaction(null)}
          onSave={(data) =>
            updateTransaction.mutate({
              transactionId: editingTransaction.id,
              amount: data.amount,
              accountId: data.accountId,
              toAccountId: data.toAccountId,
              reason: data.reason,
              notes: data.notes,
            })
          }
        />
      )}

      {showZakatHistory && (
        <ZakatHistoryModal
          accounts={accounts}
          onClose={() => setShowZakatHistory(false)}
          onEdit={(payment) => {
            setShowZakatHistory(false);
            setEditingZakatPayment(payment);
          }}
        />
      )}

      {editingZakatPayment && (
        <ZakatPayModal
          accounts={accounts}
          remaining={zakat.due - zakat.paid + editingZakatPayment.amount}
          onClose={() => setEditingZakatPayment(null)}
          onSubmit={async (data) => {
            let proofImageUrl: string | undefined =
              editingZakatPayment.proofImageUrl ?? undefined;
            if (data.proofFile) {
              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (user)
                proofImageUrl = await uploadZakatProof(data.proofFile, user.id);
            }
            await supabase.rpc("delete_zakat_payment", {
              p_payment_id: editingZakatPayment.id,
            });
            payZakat.mutate({
              amount: data.amount,
              accountId: data.accountId,
              recipient: data.recipient,
              notes: data.notes,
              proofImageUrl,
            });
            setEditingZakatPayment(null);
          }}
        />
      )}
    </div>
  );
}
