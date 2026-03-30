import type { DashboardData, User } from "@/types";

export const mockUsers: User[] = [
    {
        name: "Alex Sterling",
        role: "Premium Member",
        document: "12.345.678/0001-90",
        bankName: "Onda Institutional Bank",
        agencia: "0001",
        conta: "12345",
        senha: "admin1",
        avatar: "https://github.com/shadcn.png",
        dashboardData: {
            totalBalance: 2482901.42,
            portfolioPerformance: 342100.18,
            percentageChange: 12.4,
            investments: 1840200.00,
            liquidity: 642701.00,
            creditScore: 880,
            availableLimit: 1200000.00,
            nextBillDate: "Nov 05, 2023",
            transactions: [
                {
                    id: "TX-90210",
                    date: "Oct 24, 2023",
                    description: "BlackRock Equity Fund",
                    category: "INVESTMENTS",
                    status: "Completed",
                    amount: 12450.00,
                    type: "income"
                },
                {
                    id: "TX-90211",
                    date: "Oct 22, 2023",
                    description: "Amazon Web Services",
                    category: "OPERATIONS",
                    status: "Completed",
                    amount: 1840.50,
                    type: "expense"
                },
                {
                    id: "TX-90212",
                    date: "Oct 20, 2023",
                    description: "Internal Transfer",
                    category: "TRANSFER",
                    status: "Pending",
                    amount: 5000.00,
                    type: "expense"
                },
                {
                    id: "TX-90213",
                    date: "Oct 18, 2023",
                    description: "Global Partners LLC",
                    category: "REVENUE",
                    status: "Completed",
                    amount: 42000.00,
                    type: "income"
                },
                {
                    id: "TX-90214",
                    date: "Oct 14, 2023",
                    description: "Treasury Bond Purchase",
                    category: "INVESTMENTS",
                    status: "Completed",
                    amount: 180000.00,
                    type: "expense"
                },
            ]
        }
    },
    {
        name: "João Silva",
        role: "Basic Member",
        document: "123.456.789-10",
        bankName: "Onda Digital",
        agencia: "1111",
        conta: "22222",
        senha: "joao12",
        dashboardData: {
            totalBalance: 45200.00,
            portfolioPerformance: 1200.50,
            percentageChange: 2.1,
            investments: 15000.00,
            liquidity: 30200.00,
            creditScore: 680,
            availableLimit: 5000.00,
            nextBillDate: "Out 20, 2023",
            transactions: [
                {
                    id: "TX-11111",
                    date: "Out 15, 2023",
                    description: "Supermercado Extra",
                    category: "MARKET",
                    status: "Completed",
                    amount: 450.20,
                    type: "expense"
                },
                {
                    id: "TX-11112",
                    date: "Out 12, 2023",
                    description: "Transferência Recebida",
                    category: "TRANSFER",
                    status: "Completed",
                    amount: 2500.00,
                    type: "income"
                },
                {
                    id: "TX-11113",
                    date: "Out 10, 2023",
                    description: "Fatura Internet",
                    category: "UTILITIES",
                    status: "Completed",
                    amount: 129.90,
                    type: "expense"
                },
                {
                    id: "TX-11114",
                    date: "Out 08, 2023",
                    description: "Salário",
                    category: "INCOME",
                    status: "Completed",
                    amount: 6800.00,
                    type: "income"
                },
                {
                    id: "TX-11115",
                    date: "Out 06, 2023",
                    description: "Reserva de Emergência",
                    category: "SAVINGS",
                    status: "Pending",
                    amount: 500.00,
                    type: "expense"
                }
            ]
        }
    },
    {
        name: "Maria Oliveira",
        role: "Gold Member",
        document: "987.654.321-00",
        bankName: "Onda Private",
        agencia: "9999",
        conta: "88888",
        senha: "maria7",
        dashboardData: {
            totalBalance: 850700.00,
            portfolioPerformance: 75200.00,
            percentageChange: 8.5,
            investments: 600000.00,
            liquidity: 250700.00,
            creditScore: 780,
            availableLimit: 50000.00,
            nextBillDate: "Nov 15, 2023",
            transactions: [
                {
                    id: "TX-22222",
                    date: "Out 30, 2023",
                    description: "Dividendos Petrobras",
                    category: "REVENUE",
                    status: "Completed",
                    amount: 3200.00,
                    type: "income"
                },
                {
                    id: "TX-22223",
                    date: "Out 28, 2023",
                    description: "Restaurante Lux",
                    category: "FOOD",
                    status: "Completed",
                    amount: 890.00,
                    type: "expense"
                },
                {
                    id: "TX-22224",
                    date: "Out 26, 2023",
                    description: "Compra de CDB",
                    category: "INVESTMENTS",
                    status: "Completed",
                    amount: 12000.00,
                    type: "expense"
                },
                {
                    id: "TX-22225",
                    date: "Out 24, 2023",
                    description: "Rendimento de Fundos",
                    category: "REVENUE",
                    status: "Completed",
                    amount: 7450.00,
                    type: "income"
                },
                {
                    id: "TX-22226",
                    date: "Out 20, 2023",
                    description: "Viagem Executiva",
                    category: "TRAVEL",
                    status: "Failed",
                    amount: 2150.00,
                    type: "expense"
                }
            ]
        }
    }
];

export function findMockUser(agencia: string, conta: string) {
    return mockUsers.find((user) => user.agencia === agencia && user.conta === conta) ?? null;
}

export function getMockDashboardData(agencia: string, conta: string): DashboardData {
    const user = findMockUser(agencia, conta);

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }

    return user.dashboardData;
}

export function updateMockDashboardData(
    agencia: string,
    conta: string,
    updater: (current: DashboardData) => DashboardData
) {
    const user = findMockUser(agencia, conta);

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }

    user.dashboardData = updater(user.dashboardData);

    return user.dashboardData;
}
