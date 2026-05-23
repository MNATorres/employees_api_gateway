import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 8080;

// IMPORTANTE: No uses app.use(express.json()) globalmente aquí.
// Si parseas el body en el gateway antes del proxy, puedes romper las peticiones POST/PUT hacia los microservicios.

console.log("🔀 Inicializando API Gateway...");

// 1. Proxy para el Microservicio de Empleados
app.use(
  "/api/employees",
  createProxyMiddleware({
    target: process.env.EMPLOYEES_SERVICE_URL,
    changeOrigin: true,
    // Opcional: Si tu microservicio de empleados no espera el prefijo "/api", puedes quitárselo con pathRewrite
    // pathRewrite: { '^/api/employees': '/employees' },
  }),
);

// 2. Proxy para el Microservicio de Departamentos
app.use(
  "/api/departments",
  createProxyMiddleware({
    target: process.env.DEPARTMENTS_SERVICE_URL,
    changeOrigin: true,
  }),
);

// Ruta de diagnóstico del propio Gateway
app.get("/gateway-health", (_req, res) => {
  res.status(200).json({ status: "Gateway is up and running" });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway escuchando en http://localhost:${PORT}`);
});
