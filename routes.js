import { Router } from "express";
import { publishToRabbitMQ } from "./rabbitmq.js";

const router = Router();

router.post("/billing", async (req, res) => {
  try {
    await publishToRabbitMQ(req.body);
    res.status(200).json({ message: "Request processed successfully" });
  } catch (error) {
    console.error("Error publishing to RabbitMQ:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
