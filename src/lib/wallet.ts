import { useEffect, useState } from "react";

export type WalletTransaction = {
  id: string;
  amount: number;
  fee: number;
  sub: string;
  name: string;
  date: string;
  kind: string;
  out: boolean;
};

export type WalletState = {
  balance: number;
  transactions: WalletTransaction[];
};

const STORAGE_KEY = "instapay-wallet-v1";
const EVENT = "instapay-wallet-change";
const INITIAL_BALANCE = 2394.48;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatTransactionDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const h12 = d.getHours() % 12 || 12;
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} ${pad(h12)}:${pad(d.getMinutes())} ${ampm}`;
}

export function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

const defaultState: WalletState = { balance: INITIAL_BALANCE, transactions: [] };

export function readWallet(): WalletState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<WalletState>;
    return {
      balance: typeof parsed.balance === "number" ? parsed.balance : INITIAL_BALANCE,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
    };
  } catch {
    return defaultState;
  }
}

function writeWallet(state: WalletState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(EVENT));
}

export function recordTransfer(input: {
  amount: number;
  fee: number;
  phone: string;
  name?: string;
}) {
  const state = readWallet();
  const tx: WalletTransaction = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    amount: input.amount,
    fee: input.fee,
    sub: input.name ?? "Eman A S****",
    name: input.phone,
    date: formatTransactionDate(new Date()),
    kind: "إرسال نقود",
    out: true,
  };
  writeWallet({
    balance: state.balance - (input.amount + input.fee),
    transactions: [tx, ...state.transactions],
  });
  return tx;
}

export function useWallet(): WalletState {
  const [state, setState] = useState<WalletState>(defaultState);

  useEffect(() => {
    const sync = () => setState(readWallet());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return state;
}
