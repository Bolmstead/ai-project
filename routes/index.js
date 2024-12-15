import { Router } from "express";
// import assignmentRoutes from "./assignment.routes.js";
// import authRoutes from "./auth.routes.js";
// import taskRoutes from "./task.routes.js";
import agentRoutes from "./agent.routes.js";

const router = Router();

router.use("/agents", agentRoutes);
// router.use("/tasks", taskRoutes);
// router.use("/auth", authRoutes);
// router.use("/assignments", assignmentRoutes);

export default router;
