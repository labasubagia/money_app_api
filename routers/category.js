const { Router } = require("express");
const CategoryController = require("../controllers/category");
const CategoryService = require("../services/category");
const Category = require("../models/category");

const categoryRouter = Router();

const controller = new CategoryController({
  categoryService: new CategoryService({ categoryModel: Category }),
});

categoryRouter.get("/", ...controller.getByUser());
categoryRouter.get("/:id", ...controller.getById());
categoryRouter.post("/", ...controller.create());
categoryRouter.post("/:id", ...controller.update());
categoryRouter.delete("/:id", ...controller.delete());

module.exports = categoryRouter;
