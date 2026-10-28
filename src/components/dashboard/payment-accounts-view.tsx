"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DemoNotice, PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AchAccount, CardAccount, PaymentAccounts } from "@/lib/amcs/types";

export function PaymentAccountsView({ accounts }: { accounts: PaymentAccounts }) {
  const [cards, setCards] = useState(accounts.cards);
  const [ach, setAch] = useState(accounts.ach);
  const [cardOpen, setCardOpen] = useState(false);
  const [achOpen, setAchOpen] = useState(false);

  function setPrimary(kind: "card" | "ach", id: string, value: boolean) {
    if (kind === "card") {
      setCards((current) =>
        current.map((card) => ({
          ...card,
          primary: card.id === id ? value : value ? false : card.primary,
        })),
      );
    } else {
      setAch((current) =>
        current.map((account) => ({
          ...account,
          primary: account.id === id ? value : value ? false : account.primary,
        })),
      );
    }
  }

  function setAutoPay(kind: "card" | "ach", id: string, value: boolean) {
    setCards((current) =>
      current.map((card) => ({
        ...card,
        isAutoPay: kind === "card" && card.id === id ? value : value ? false : card.isAutoPay,
      })),
    );
    setAch((current) =>
      current.map((account) => ({
        ...account,
        isAutoPay: kind === "ach" && account.id === id ? value : value ? false : account.isAutoPay,
      })),
    );
  }

  return (
    <div>
      <PageHeader
        title="Payment Accounts"
        description="Saved cards and bank accounts for this portal. Changes stay in this demo session."
      />
      <div className="mb-4">
        <DemoNotice>Demo – no payment method is stored with a bank or card network.</DemoNotice>
      </div>
      <Tabs defaultValue="card">
        <TabsList className="h-11">
          <TabsTrigger value="card">Credit Card</TabsTrigger>
          <TabsTrigger value="ach">ACH</TabsTrigger>
        </TabsList>
        <TabsContent value="card" className="mt-4 space-y-3">
          {cards.length === 0 ? <Empty label="No saved cards." /> : null}
          {cards.map((card) => (
            <MethodCard
              key={card.id}
              id={card.id}
              title={`${card.brand} •••• ${card.last4}`}
              detail={`${card.holder} · Expires ${card.expiry}`}
              primary={card.primary}
              isAutoPay={card.isAutoPay}
              onPrimary={(value) => setPrimary("card", card.id, value)}
              onAutoPay={(value) => setAutoPay("card", card.id, value)}
            />
          ))}
          <Button type="button" onClick={() => setCardOpen(true)}>
            Save New Card
          </Button>
        </TabsContent>
        <TabsContent value="ach" className="mt-4 space-y-3">
          {ach.length === 0 ? <Empty label="No saved bank accounts." /> : null}
          {ach.map((account) => (
            <MethodCard
              key={account.id}
              id={account.id}
              title={`${account.bankName} •••• ${account.last4}`}
              detail={account.accountType}
              primary={account.primary}
              isAutoPay={account.isAutoPay}
              onPrimary={(value) => setPrimary("ach", account.id, value)}
              onAutoPay={(value) => setAutoPay("ach", account.id, value)}
            />
          ))}
          <Button type="button" onClick={() => setAchOpen(true)}>
            Save New Account
          </Button>
        </TabsContent>
      </Tabs>

      <SaveCardDialog
        open={cardOpen}
        onOpenChange={setCardOpen}
        onSave={(card) => {
          setCards((current) => [...current, card]);
          toast.success("Card saved");
        }}
      />
      <SaveAchDialog
        open={achOpen}
        onOpenChange={setAchOpen}
        onSave={(account) => {
          setAch((current) => [...current, account]);
          toast.success("Account saved");
        }}
      />
    </div>
  );
}

function MethodCard({
  id,
  title,
  detail,
  primary,
  isAutoPay,
  onPrimary,
  onAutoPay,
}: {
  id: string;
  title: string;
  detail: string;
  primary: boolean;
  isAutoPay: boolean;
  onPrimary: (value: boolean) => void;
  onAutoPay: (value: boolean) => void;
}) {
  const primaryId = `${id}-primary`;
  const autoId = `${id}-autopay`;
  return (
    <article className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{detail}</p>
        {primary ? <Badge className="mt-2">Primary</Badge> : null}
      </div>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch id={primaryId} checked={primary} onCheckedChange={onPrimary} />
          <Label htmlFor={primaryId}>Primary</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id={autoId} checked={isAutoPay} onCheckedChange={onAutoPay} />
          <Label htmlFor={autoId}>Is Auto Pay</Label>
        </div>
      </div>
    </article>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="rounded-xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-foreground/10">{label}</p>;
}

function SaveCardDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (card: CardAccount) => void;
}) {
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [error, setError] = useState<string | null>(null);

  function save() {
    const digits = number.replace(/\D/g, "");
    if (holder.trim().length < 2 || digits.length < 13 || !/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Enter the name, a card number, and an expiration in MM/YY.");
      return;
    }
    const brand = digits.startsWith("5") ? "Mastercard" : digits.startsWith("3") ? "Amex" : digits.startsWith("6") ? "Discover" : "Visa";
    onSave({
      id: `card-${digits.slice(-4)}-${cardsafe()}`,
      brand,
      last4: digits.slice(-4),
      expiry,
      holder: holder.trim(),
      primary: false,
      isAutoPay: false,
    });
    setHolder("");
    setNumber("");
    setExpiry("");
    setError(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save New Card</DialogTitle>
          <DialogDescription>Demo – no payment processed. The card is kept only in this browser session.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {error ? <p role="alert" className="text-sm font-medium text-destructive">{error}</p> : null}
          <div className="space-y-2">
            <Label htmlFor="new-card-name">Name on card</Label>
            <Input id="new-card-name" value={holder} onChange={(event) => setHolder(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-card-number">Card number</Label>
            <Input id="new-card-number" inputMode="numeric" value={number} onChange={(event) => setNumber(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-card-expiry">Expiration</Label>
            <Input id="new-card-expiry" placeholder="MM/YY" value={expiry} onChange={(event) => setExpiry(event.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={save}>Save New Card</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SaveAchDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (account: AchAccount) => void;
}) {
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [error, setError] = useState<string | null>(null);

  function save() {
    const digits = account.replace(/\D/g, "");
    if (bank.trim().length < 2 || digits.length < 4) {
      setError("Enter the bank name and account number.");
      return;
    }
    onSave({
      id: `ach-${digits.slice(-4)}-${cardsafe()}`,
      bankName: bank.trim(),
      accountType: "Checking",
      last4: digits.slice(-4),
      primary: false,
      isAutoPay: false,
    });
    setBank("");
    setAccount("");
    setError(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save New Account</DialogTitle>
          <DialogDescription>Demo – no payment processed. The account is kept only in this browser session.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {error ? <p role="alert" className="text-sm font-medium text-destructive">{error}</p> : null}
          <div className="space-y-2">
            <Label htmlFor="new-bank">Bank name</Label>
            <Input id="new-bank" value={bank} onChange={(event) => setBank(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-ach">Account number</Label>
            <Input id="new-ach" inputMode="numeric" value={account} onChange={(event) => setAccount(event.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={save}>Save New Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function cardsafe() {
  return Math.random().toString(36).slice(2, 7);
}
