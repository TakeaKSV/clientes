import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_EXCHANGE = "cliente_event";
const RABBITMQ_ROUTING_KEY = "cliente.created";
const USER_QUEUE = "cliente_to_user_queue"; // Añadir esta cola específica

export async function clienteCreatedEvent(clienteUser) {
  let connection;
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672');
    
    const channel = await connection.createChannel();

    // Declarar exchange
    await channel.assertExchange(RABBITMQ_EXCHANGE, "topic", { durable: true });
    
    // Asegurar que existe la cola para el servicio de usuarios
    await channel.assertQueue(USER_QUEUE, { durable: true });
    await channel.bindQueue(USER_QUEUE, RABBITMQ_EXCHANGE, RABBITMQ_ROUTING_KEY);

    // Publicar el evento
    const message = JSON.stringify(clienteUser);
    channel.publish(
      RABBITMQ_EXCHANGE,
      RABBITMQ_ROUTING_KEY,
      Buffer.from(message)
    );

    console.log(
      `✅ Evento publicado en exchange "${RABBITMQ_EXCHANGE}", routing key "${RABBITMQ_ROUTING_KEY}": ${message}`
    );
    
    // Esperar a que se complete la publicación antes de cerrar
    await channel.close();
  } catch (error) {
    console.error("Error publicando evento de producto creado:", error);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error al cerrar conexión RabbitMQ:", err);
      }
    }
  }
}