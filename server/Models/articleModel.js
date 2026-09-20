const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        photo: {
            type: String, // Store URL or path to the photo
            default: "", // Consider making this required if absolutely necessary
        },
        author: {
            type: String,
            default: "Madan Saud",
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
