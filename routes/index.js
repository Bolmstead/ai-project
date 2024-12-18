import { Router } from "express";
// import assignmentRoutes from "./assignment.routes.js";
// import authRoutes from "./auth.routes.js";
// import taskRoutes from "./task.routes.js";
import agentRoutes from "./agent.routes.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const shitcoinTrackerBotToken =
  process.env.REACT_APP_SHITCOIN_TRACKER_TELEGRAM_BOT_TOKEN;
console.log("🚀 ~ shitcoinTrackerBotToken:", shitcoinTrackerBotToken);

const botsChatId = process.env.REACT_APP_BOTS_TELEGRAM_CHAT_ID;
console.log("🚀 ~ botsChatId:", botsChatId);

router.use("/agents", agentRoutes);
router.post("/family_presents", async (req, res) => {
  console.log("🚀 ~ router.post ~ req.body:", req.body);
  const { msg, memberName } = req.body;
  console.log("🚀 ~ router.post ~ memberName:", memberName);
  console.log("🚀 ~ sendTelegramMessage ~ msg:", msg);
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${shitcoinTrackerBotToken}/sendMessage`,
      {
        chat_id: botsChatId,
        text: msg,
      }
    );
    console.log("Message sent:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
  res.send("test");
});
// router.use("/tasks", taskRoutes);
// router.use("/auth", authRoutes);
// router.use("/assignments", assignmentRoutes);

export default router;
