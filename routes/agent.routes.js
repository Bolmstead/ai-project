/** Routes for Users. */

import { Router } from "express";
import {
  getAllAgents,
  createAgent,
  agentConversation,
} from "../controllers/agent.controller.js";

const router = new Router();

/** GET => [{ user },{ user },...]
 *
 * Provides all clients
 *
 * Authorization required: admin
 */
router.get("/all", getAllAgents);

router.post("/create", createAgent);

router.post("/start_conversation", agentConversation);

export default router;
