export type DashboardCardProps = {
    title: string;
    value: string | number;
}

export type ExpModal = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode
}