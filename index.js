import express from "express";
import { swaggerUi, specs } from './src/api-docs.js';
import cors from "cors";
import sequelize from "./src/config/database.js";
import clienteRoutes from "./src/routes/clienteRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/clientes", clienteRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Conectar a la base de datos
sequelize
  .sync()
  .then(() => console.log("✅ Base de datos sincronizada"))
  .catch((error) => console.error("❌ Error al conectar a la base de datos:", error));

// Levantar el servidor
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
