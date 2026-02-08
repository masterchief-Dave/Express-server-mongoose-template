import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/health", (_req, res) =>
  res.json({
    success: true,
    message: "healthy",
    data: { uptime: process.uptime() },
  }),
);

export default apiRouter;
