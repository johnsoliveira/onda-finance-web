export interface Transaction {
    id: string;
    date: string;
    description: string;
    category: string;
    status: "Completed" | "Pending" | "Failed";
    amount: number;
    type: "income" | "expense";
}

export interface DashboardData {
    totalBalance: number;
    portfolioPerformance: number;
    percentageChange: number;
    investments: number;
    liquidity: number;
    creditScore: number;
    availableLimit: number;
    nextBillDate: string;
    transactions: Transaction[];
}

export interface User {
    name: string;
    role: string;
    document: string;
    bankName: string;
    agencia: string;
    conta: string;
    senha: string;
    avatar?: string;
    dashboardData: DashboardData;
}
