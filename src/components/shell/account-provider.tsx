"use client";

import { createContext, useContext, useState } from "react";
import { accounts as accountList } from "@/lib/amcs/mock-data";
import type { Account } from "@/lib/amcs/types";

type AccountContextValue = {
  accounts: Account[];
  account: Account;
  setAccountId: (id: string) => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountId] = useState(accountList[0]?.id ?? "");
  const account = accountList.find((item) => item.id === accountId) ?? accountList[0];

  if (!account) return null;

  return (
    <AccountContext.Provider value={{ accounts: accountList, account, setAccountId }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const value = useContext(AccountContext);
  if (!value) {
    throw new Error("useAccount must be used within AccountProvider");
  }
  return value;
}
