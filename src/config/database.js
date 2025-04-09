import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

// Debug: Imprimir variables de entorno (solo para depuración)
console.log("Variables de entorno de BD:", {
  url: process.env.MYSQL_URL,
});

const sequelize = process.env.MYSQL_URL
  ? new Sequelize(process.env.MYSQL_URL, {
      dialect: "mysql",
      logging: false, // Puedes activarlo para ver las consultas SQL
      dialectOptions: {
        connectTimeout: 60000 // Para darle más tiempo a la conexión
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD || process.env.DB_PASS, // Intentar ambas variables
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false, // Puedes activarlo para ver las consultas SQL
        dialectOptions: {
          connectTimeout: 60000 // Para darle más tiempo a la conexión
        },
      }
    );

// Función de conexión con reintentos
const connectWithRetry = async (maxRetries = 5, retryInterval = 5000) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log("✅ Conexión a la base de datos establecida correctamente");
      return true;
    } catch (error) {
      retries++;
      console.error(`❌ Intento ${retries}/${maxRetries} fallido: ${error.message}`);
      
      if (retries < maxRetries) {
        console.log(`Reintentando en ${retryInterval/1000} segundos...`);
        await new Promise(resolve => setTimeout(resolve, retryInterval));
      }
    }
  }
  
  console.error("⛔ No se pudo conectar a la base de datos después de múltiples intentos");
  return false;
};

// Intentar la conexión con reintentos
connectWithRetry();

export default sequelize;