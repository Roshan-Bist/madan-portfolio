const express = require("express");
const router = express.Router();
const { createArticle, updateArticle, deleteArticle, getArticles, getArticleById } = require("../controllers/article.controller");
const authenticate = require("../Middleware/authentication");

router.post("/", authenticate, createArticle);
router.put("/:id", authenticate, updateArticle);
router.delete("/:id", authenticate, deleteArticle);
router.get("/", getArticles);
router.get("/:id", getArticleById);

module.exports = router;
