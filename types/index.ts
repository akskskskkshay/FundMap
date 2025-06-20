export type DashboardCardProps = {
    title: string;
    value: string | number;
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

export type FormData = {
    title: string,
    amount: string,
    category: string,
    date: string
}