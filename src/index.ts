import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 8080;

console.log("🔀 Inicializando API Gateway...");

// 1. Proxy para el Microservicio de Empleados
app.use(
  "/api/employees",
  createProxyMiddleware({
    target: process.env.EMPLOYEES_SERVICE_URL + "/api/employees",
    changeOrigin: true,
    // Opcional: Si tu microservicio de empleados no espera el prefijo "/api", puedes quitárselo con pathRewrite
    // pathRewrite: { '^/api/employees': '/employees' },
  }),
);

// 2. Proxy para el Microservicio de Departamentos
app.use(
  "/api/departments",
  createProxyMiddleware({
    target: process.env.DEPARTMENTS_SERVICE_URL + "/api/departments",
    changeOrigin: true,
  }),
);

app.listen(PORT, () => {
  console.log(`🚀 API Gateway escuchando en http://localhost:${PORT}`);
});
