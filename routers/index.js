const { Router } = require("express");
const authRouter = require("./auth");

const router = Router();
router.get("/", (_, res) => res.json({ message: "This is Index" }));
router.use("/auth", authRouter);
router.use((_, res) => res.status(404).json({ message: "Page Not Found" }));

module.exports = router;