export type ServiceStream = "garbage" | "recycling" | "compost";

export type Account = {
  id: string;
  accountNumber: string;
  serviceAddress: string;
  balanceDue: number;
  dueDate: string | null;
  autopay: boolean;
  paperless: boolean;
  nextCollection: {
    date: string;
    streams: ServiceStream[];
  };
};

export type InvoiceLine = {
  description: string;
  amount: number;
};

export type Invoice = {
  id: string;
  accountId: string;
  number: string;
  date: string;
  period: string;
  type: "Invoice" | "Statement";
  amount: number;
  status: "Unpaid" | "Paid";
  lineItems: InvoiceLine[];
};

export type ActivityType = "Invoice" | "Payment" | "Adjustment";

export type Activity = {
  id: string;
  accountId: string;
  date: string;
  description: string;
  type: ActivityType;
  amount: number;
};

export type CardAccount = {
  id: string;
  brand: "Visa" | "Mastercard" | "Discover" | "Amex";
  last4: string;
  expiry: string;
  holder: string;
  primary: boolean;
  isAutoPay: boolean;
};

export type AchAccount = {
  id: string;
  bankName: string;
  accountType: "Checking" | "Savings";
  last4: string;
  primary: boolean;
  isAutoPay: boolean;
};

export type AccountSummary = {
  accounts: Account[];
  activity: Activity[];
};

export type PaymentAccounts = {
  cards: CardAccount[];
  ach: AchAccount[];
};

export type CollectionSchedule = {
  /** JavaScript weekday, 0 = Sunday. Residential routes in this demo run on Tuesday. */
  weekday: number;
  streams: ServiceStream[];
};

export type PortalUser = {
  email: string;
  name: string;
};

export type LoginResult =
  | { ok: true; user: PortalUser }
  | { ok: false; error: string };

export type RegisterInput = {
  email: string;
  password: string;
  telephone?: string;
  accountNumber?: string;
  invoiceNumber?: string;
  activationCode?: string;
  pin?: string;
};

export type RegisterResult =
  | { ok: true; user: PortalUser }
  | { ok: false; error: string };

export type GuestInvoiceMatch = {
  account: Account;
  invoice: Invoice;
};

export type GuestPaymentInput = {
  accountNumber: string;
  invoiceNumber: string;
  amount: number;
  method: "card" | "ach";
};

export type GuestPaymentResult = {
  reference: string;
  amount: number;
  accountNumber: string;
  invoiceNumber: string;
  method: "card" | "ach";
  paidOn: string;
};

export type ServiceRequestInput = {
  name: string;
  email: string;
  accountNumber: string;
  message: string;
};

export type ServiceRequestResult = {
  ok: true;
  confirmation: string;
};
