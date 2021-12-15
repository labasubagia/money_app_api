const { Router } = require("express");
const { auth } = require("../middlewares/auth");
const authRouter = require("./auth");
const userRouter = require("./user");
const categoryRouter = require("./category");
const cashFlowRouter = require("./cashflow");

const router = Router();
router.get("/", (_, res) => res.json({ message: "This is Index" }));
router.use("/auth", authRouter);
router.use("/user", auth, userRouter);
router.use("/category", auth, categoryRouter);
router.use("/cashflow", auth, cashFlowRouter);
router.use((_, res) => res.status(404).json({ message: "Page Not Found" }));

module.exports = router;
