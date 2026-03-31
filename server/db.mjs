import fs from "node:fs";
import path from "node:path";
import sqlite3 from "sqlite3";
import { mockUsers } from "./mock-users.mjs";

const dataDir = path.resolve(process.cwd(), "server/data");
const dbPath = path.join(dataDir, "onda.sqlite");

fs.mkdirSync(dataDir, { recursive: true });

const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbPath);

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function onRun(error) {
            if (error) {
                reject(error);
                return;
            }

            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (error, row) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(row ?? null);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (error, rows) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(rows);
        });
    });
}

function mapDashboard(userRow, transactionRows) {
    return {
        totalBalance: userRow.total_balance,
        portfolioPerformance: userRow.portfolio_performance,
        percentageChange: userRow.percentage_change,
        investments: userRow.investments,
        liquidity: userRow.liquidity,
        creditScore: userRow.credit_score,
        availableLimit: userRow.available_limit,
        nextBillDate: userRow.next_bill_date,
        transactions: transactionRows.map((transaction) => ({
            id: transaction.id,
            date: transaction.date,
            description: transaction.description,
            category: transaction.category,
            status: transaction.status,
            amount: transaction.amount,
            type: transaction.type,
        })),
    };
}

async function getUserRowByAccount(agencia, conta) {
    return get(`SELECT * FROM users WHERE agencia = ? AND conta = ?`, [agencia, conta]);
}

async function getTransactionsByUserId(userId) {
    return all(
        `SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC, rowid DESC`,
        [userId]
    );
}

async function seedDatabase() {
    const row = await get(`SELECT COUNT(*) AS count FROM users`);
    if (row?.count > 0) {
        return;
    }

    for (const user of mockUsers) {
        const result = await run(
            `INSERT INTO users (
                name, role, document, bank_name, agencia, conta, senha, avatar,
                total_balance, portfolio_performance, percentage_change, investments,
                liquidity, credit_score, available_limit, next_bill_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user.name,
                user.role,
                user.document,
                user.bankName,
                user.agencia,
                user.conta,
                user.senha,
                user.avatar ?? null,
                user.dashboardData.totalBalance,
                user.dashboardData.portfolioPerformance,
                user.dashboardData.percentageChange,
                user.dashboardData.investments,
                user.dashboardData.liquidity,
                user.dashboardData.creditScore,
                user.dashboardData.availableLimit,
                user.dashboardData.nextBillDate,
            ]
        );

        for (const transaction of user.dashboardData.transactions) {
            await run(
                `INSERT INTO transactions (
                    id, user_id, date, description, category, status, amount, type, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    transaction.id,
                    result.lastID,
                    transaction.date,
                    transaction.description,
                    transaction.category,
                    transaction.status,
                    transaction.amount,
                    transaction.type,
                    new Date().toISOString(),
                ]
            );
        }
    }
}

export async function initializeDatabase() {
    await run(`PRAGMA foreign_keys = ON`);
    await run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            document TEXT NOT NULL,
            bank_name TEXT NOT NULL,
            agencia TEXT NOT NULL,
            conta TEXT NOT NULL,
            senha TEXT NOT NULL,
            avatar TEXT,
            total_balance REAL NOT NULL,
            portfolio_performance REAL NOT NULL,
            percentage_change REAL NOT NULL,
            investments REAL NOT NULL,
            liquidity REAL NOT NULL,
            credit_score INTEGER NOT NULL,
            available_limit REAL NOT NULL,
            next_bill_date TEXT NOT NULL,
            UNIQUE(agencia, conta)
        )
    `);
    await run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            status TEXT NOT NULL,
            amount REAL NOT NULL,
            type TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    await seedDatabase();
}

export async function authenticateUser(agencia, conta, senha) {
    const userRow = await get(
        `SELECT * FROM users WHERE agencia = ? AND conta = ? AND senha = ?`,
        [agencia, conta, senha]
    );

    if (!userRow) {
        return null;
    }

    const transactionRows = await getTransactionsByUserId(userRow.id);

    return {
        name: userRow.name,
        role: userRow.role,
        document: userRow.document,
        bankName: userRow.bank_name,
        agencia: userRow.agencia,
        conta: userRow.conta,
        senha: userRow.senha,
        avatar: userRow.avatar ?? undefined,
        dashboardData: mapDashboard(userRow, transactionRows),
    };
}

export async function getDashboardData(agencia, conta) {
    const userRow = await getUserRowByAccount(agencia, conta);

    if (!userRow) {
        throw new Error("Usuário não encontrado.");
    }

    const transactionRows = await getTransactionsByUserId(userRow.id);
    return mapDashboard(userRow, transactionRows);
}

export async function updateDashboardBalance({ agencia, conta, amount, transaction }) {
    const userRow = await getUserRowByAccount(agencia, conta);

    if (!userRow) {
        throw new Error("Usuário não encontrado.");
    }

    await run("BEGIN TRANSACTION");

    try {
        await run(
            `UPDATE users
             SET total_balance = total_balance + ?, liquidity = liquidity + ?
             WHERE id = ?`,
            [amount, amount, userRow.id]
        );

        if (transaction) {
            await run(
                `INSERT INTO transactions (
                    id, user_id, date, description, category, status, amount, type, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    transaction.id,
                    userRow.id,
                    transaction.date,
                    transaction.description,
                    transaction.category,
                    transaction.status,
                    transaction.amount,
                    transaction.type,
                    new Date().toISOString(),
                ]
            );
        }

        await run("COMMIT");
    } catch (error) {
        await run("ROLLBACK");
        throw error;
    }

    return getDashboardData(agencia, conta);
}

export async function createTransfer({ agencia, conta, amount, transaction }) {
    if (amount <= 0) {
        throw new Error("O valor da transferência deve ser maior que zero.");
    }

    const userRow = await getUserRowByAccount(agencia, conta);

    if (!userRow) {
        throw new Error("Usuário não encontrado.");
    }

    if (userRow.total_balance < amount) {
        throw new Error("Saldo insuficiente para realizar a transferência.");
    }

    await run("BEGIN TRANSACTION");

    try {
        await run(
            `UPDATE users
             SET total_balance = total_balance - ?, liquidity = liquidity - ?
             WHERE id = ?`,
            [amount, amount, userRow.id]
        );

        await run(
            `INSERT INTO transactions (
                id, user_id, date, description, category, status, amount, type, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                transaction.id,
                userRow.id,
                transaction.date,
                transaction.description,
                transaction.category,
                transaction.status,
                transaction.amount,
                transaction.type,
                new Date().toISOString(),
            ]
        );

        await run("COMMIT");
    } catch (error) {
        await run("ROLLBACK");
        throw error;
    }

    return getDashboardData(agencia, conta);
}
