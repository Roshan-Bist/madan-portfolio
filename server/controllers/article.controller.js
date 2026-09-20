const Article = require("../Models/articleModel");

exports.createArticle = async (req, res) => {
    try {
        const article = new Article(req.body);
        await article.save();
        res.status(201).json({ message: "Article created successfully", article });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.status(200).json({ message: "Article updated successfully", article });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.status(200).json({ message: "Article deleted successfully", article });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Articles fetched successfully", articles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.status(200).json({ message: "Article fetched successfully", article });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
