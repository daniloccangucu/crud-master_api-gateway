import { connect } from "amqplib";

const QUEUE_NAME = "billing_queue";
const RABBITMQ_URL = "amqp://127.0.0.1";

export async function publishToRabbitMQ(message) {
  try {
    const connection = await connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
    console.log("Message published to RabbitMQ:", message);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error publishing message to RabbitMQ:", error);
    throw error;
  }
}
