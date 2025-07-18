export type DashboardCardProps = {
    title: React.ReactNode;
    value: React.ReactNode;
    increase?: boolean;
}

export type ExpModal = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode
}
export type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  user_id: string;
};

export type Budget = {
  category: string;
  amount: number;
};

export type FormData = {
    title: string,
    amount: string,
    date: string
}