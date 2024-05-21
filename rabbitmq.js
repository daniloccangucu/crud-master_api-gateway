import { connect } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const QUEUE_NAME = process.env.RABBITMQ_QUEUE;
const RABBITMQ_URL = process.env.RABBITMQ_URL;

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
