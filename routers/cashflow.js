const { Router } = require("express");
const CashFlowController = require("../controllers/cashflow");
const CashFlowService = require("../services/cashflow");
const CashFlow = require("../models/cashflow");

const cashFlowRouter = Router();

const controller = new CashFlowController({
  cashFlowService: new CashFlowService({ cashFlowModel: CashFlow }),
});

cashFlowRouter.get("/", ...controller.getByUser());
cashFlowRouter.get("/:id", ...controller.getById());
cashFlowRouter.post("/", ...controller.create());
cashFlowRouter.post("/:id", ...controller.update());
cashFlowRouter.delete("/:id", ...controller.delete());

module.exports = cashFlowRouter;
