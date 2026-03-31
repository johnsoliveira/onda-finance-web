import http from "node:http";
import { URL } from "node:url";
import {
    authenticateUser,
    createTransfer,
    getDashboardData,
    initializeDatabase,
    updateDashboardBalance,
} from "./db.mjs";

const PORT = Number(process.env.API_PORT ?? 3001);

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
        "Content-Type": "application/json",
    });
    response.end(JSON.stringify(payload));
}

function parseBody(request) {
    return new Promise((resolve, reject) => {
        let body = "";

        request.on("data", (chunk) => {
            body += chunk;
        });

        request.on("end", () => {
            if (!body) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("JSON inválido."));
            }
        });

        request.on("error", reject);
    });
}

const server = http.createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

    if (request.method === "OPTIONS") {
        sendJson(response, 204, {});
        return;
    }

    try {
        if (request.method === "GET" && url.pathname === "/api/health") {
            sendJson(response, 200, { status: "ok" });
            return;
        }

        if (request.method === "POST" && url.pathname === "/api/auth/login") {
            const body = await parseBody(request);
            const user = await authenticateUser(body.agencia, body.conta, body.senha);

            if (!user) {
                sendJson(response, 401, { message: "Agência, conta ou senha incorretos." });
                return;
            }

            sendJson(response, 200, user);
            return;
        }

        if (request.method === "GET" && url.pathname === "/api/dashboard") {
            const agencia = url.searchParams.get("agencia");
            const conta = url.searchParams.get("conta");

            if (!agencia || !conta) {
                sendJson(response, 400, { message: "Credenciais do usuário indisponíveis." });
                return;
            }

            const dashboardData = await getDashboardData(agencia, conta);
            sendJson(response, 200, dashboardData);
            return;
        }

        if (request.method === "PATCH" && url.pathname === "/api/dashboard/balance") {
            const body = await parseBody(request);
            const dashboardData = await updateDashboardBalance(body);
            sendJson(response, 200, dashboardData);
            return;
        }

        if (request.method === "POST" && url.pathname === "/api/transfers") {
            const body = await parseBody(request);
            const dashboardData = await createTransfer(body);
            sendJson(response, 200, dashboardData);
            return;
        }

        sendJson(response, 404, { message: "Rota não encontrada." });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erro interno no servidor.";
        sendJson(response, 400, { message });
    }
});

initializeDatabase()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Mini API rodando em http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Falha ao iniciar a Mini API:", error);
        process.exit(1);
    });
