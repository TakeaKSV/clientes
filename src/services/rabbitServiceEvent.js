import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBIT_HOST || "amqp://admin:admin@localhost";
const RABBITMQ_EXCHANGE = "cliente_event";
const RABBITMQ_ROUTING_KEY = "cliente.created";

export async function clienteCreatedEvent(clienteUser) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Declarar exchange
    await channel.assertExchange(RABBITMQ_EXCHANGE, "topic", { durable: true });

    // Publicar el evento
    const message = JSON.stringify(clienteUser);
    channel.publish(
      RABBITMQ_EXCHANGE,
      RABBITMQ_ROUTING_KEY,
      Buffer.from(message)
    );

    console.log(
      `[✅] Evento publicado en exchange "${RABBITMQ_EXCHANGE}", routing key "${RABBITMQ_ROUTING_KEY}": ${message}`
    );

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error publicando evento de cliente creado:", error);
  }
}