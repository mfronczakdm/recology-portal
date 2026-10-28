import type {
  Account,
  Activity,
  AchAccount,
  CardAccount,
  CollectionSchedule,
  Invoice,
} from "@/lib/amcs/types";

export const demoPassword = "demo1234";

export const accounts: Account[] = [
  {
    id: "acc-10458291",
    accountNumber: "10458291",
    serviceAddress: "1234 Market Street, San Francisco, CA 94103",
    balanceDue: 86.42,
    dueDate: "2026-11-15",
    autopay: false,
    paperless: false,
    nextCollection: {
      date: "2026-11-03",
      streams: ["garbage", "recycling", "compost"],
    },
  },
  {
    id: "acc-20933104",
    accountNumber: "20933104",
    serviceAddress: "88 Folsom Street, San Francisco, CA 94105",
    balanceDue: 0,
    dueDate: null,
    autopay: true,
    paperless: true,
    nextCollection: {
      date: "2026-11-04",
      streams: ["garbage", "recycling"],
    },
  },
];

const marketInvoice: Invoice = {
  id: "inv-104582",
  accountId: "acc-10458291",
  number: "INV104582",
  date: "2026-10-01",
  period: "Sep 1 – Sep 30, 2026",
  type: "Invoice",
  amount: 86.42,
  status: "Unpaid",
  lineItems: [
    { description: "Residential garbage service", amount: 42.18 },
    { description: "Recycling", amount: 18.06 },
    { description: "Compost", amount: 16.4 },
    { description: "City franchise fee", amount: 9.78 },
  ],
};

export const invoices: Invoice[] = [
  marketInvoice,
  {
    id: "stm-104400",
    accountId: "acc-10458291",
    number: "STM104400",
    date: "2026-09-15",
    period: "Aug 1 – Aug 31, 2026",
    type: "Statement",
    amount: 79.15,
    status: "Paid",
    lineItems: [
      { description: "Previous balance", amount: 79.15 },
      { description: "Payment received — thank you", amount: -79.15 },
      { description: "Balance", amount: 0 },
    ],
  },
  {
    id: "inv-104210",
    accountId: "acc-10458291",
    number: "INV104210",
    date: "2026-09-01",
    period: "Aug 1 – Aug 31, 2026",
    type: "Invoice",
    amount: 79.15,
    status: "Paid",
    lineItems: [
      { description: "Residential garbage service", amount: 40.5 },
      { description: "Recycling", amount: 17.2 },
      { description: "Compost", amount: 15.1 },
      { description: "City franchise fee", amount: 6.35 },
    ],
  },
  {
    id: "inv-103880",
    accountId: "acc-10458291",
    number: "INV103880",
    date: "2026-08-01",
    period: "Jul 1 – Jul 31, 2026",
    type: "Invoice",
    amount: 91.15,
    status: "Paid",
    lineItems: [
      { description: "Residential garbage service", amount: 40.5 },
      { description: "Recycling", amount: 17.2 },
      { description: "Compost", amount: 15.1 },
      { description: "Extra compost cart", amount: 12.0 },
      { description: "City franchise fee", amount: 6.35 },
    ],
  },
  {
    id: "inv-209331",
    accountId: "acc-20933104",
    number: "INV209331",
    date: "2026-10-01",
    period: "Sep 1 – Sep 30, 2026",
    type: "Invoice",
    amount: 64.2,
    status: "Paid",
    lineItems: [
      { description: "Commercial garbage service", amount: 48.0 },
      { description: "Recycling", amount: 16.2 },
    ],
  },
  {
    id: "stm-209100",
    accountId: "acc-20933104",
    number: "STM209100",
    date: "2026-09-15",
    period: "Aug 1 – Aug 31, 2026",
    type: "Statement",
    amount: 64.2,
    status: "Paid",
    lineItems: [
      { description: "Previous balance", amount: 64.2 },
      { description: "Payment received — thank you", amount: -64.2 },
      { description: "Balance", amount: 0 },
    ],
  },
];

export const activity: Activity[] = [
  {
    id: "act-1",
    accountId: "acc-10458291",
    date: "2026-10-01",
    description: "Invoice INV104582",
    type: "Invoice",
    amount: 86.42,
  },
  {
    id: "act-2",
    accountId: "acc-10458291",
    date: "2026-09-18",
    description: "Payment — Visa •••• 4242",
    type: "Payment",
    amount: -79.15,
  },
  {
    id: "act-3",
    accountId: "acc-10458291",
    date: "2026-09-01",
    description: "Invoice INV104210",
    type: "Invoice",
    amount: 79.15,
  },
  {
    id: "act-4",
    accountId: "acc-10458291",
    date: "2026-08-12",
    description: "Courtesy adjustment — missed pickup",
    type: "Adjustment",
    amount: -12.0,
  },
  {
    id: "act-5",
    accountId: "acc-10458291",
    date: "2026-08-04",
    description: "Payment — Visa •••• 4242",
    type: "Payment",
    amount: -91.15,
  },
  {
    id: "act-6",
    accountId: "acc-20933104",
    date: "2026-10-03",
    description: "Autopay — Checking •••• 8891",
    type: "Payment",
    amount: -64.2,
  },
  {
    id: "act-7",
    accountId: "acc-20933104",
    date: "2026-10-01",
    description: "Invoice INV209331",
    type: "Invoice",
    amount: 64.2,
  },
  {
    id: "act-8",
    accountId: "acc-20933104",
    date: "2026-09-02",
    description: "Autopay — Checking •••• 8891",
    type: "Payment",
    amount: -64.2,
  },
];

export const cards: CardAccount[] = [
  {
    id: "card-4242",
    brand: "Visa",
    last4: "4242",
    expiry: "08/28",
    holder: "Jordan Lee",
    primary: true,
    isAutoPay: false,
  },
  {
    id: "card-5512",
    brand: "Mastercard",
    last4: "5512",
    expiry: "01/27",
    holder: "Jordan Lee",
    primary: false,
    isAutoPay: false,
  },
];

export const achAccounts: AchAccount[] = [
  {
    id: "ach-8891",
    bankName: "Bank of America",
    accountType: "Checking",
    last4: "8891",
    primary: true,
    isAutoPay: false,
  },
];

export const collectionSchedules: Record<string, CollectionSchedule> = {
  "acc-10458291": {
    weekday: 2,
    streams: ["garbage", "recycling", "compost"],
  },
  "acc-20933104": {
    weekday: 3,
    streams: ["garbage", "recycling"],
  },
};

export const guestPaymentReference = "PMT-482913";
