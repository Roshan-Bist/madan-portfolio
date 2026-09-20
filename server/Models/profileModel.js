const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    bio: {
        type: String,
        required: true
    },
    highlights: {
        type: Array,
        required: true
    },
    socialLinks: {
        type: Object,
        required: true
    },
    skills: {
        type: Array,
        required: true
    },
    experience: {
        type: Array,
        required: true
    },
    education: {
        type: Array,
        required: true
    },
    achievements: {
        type: Array,
    },
    certifications: {
        type: Array,
    },
    languages: {
        type: Array,
    },
    interests: {
        type: Array,
    },
    resume: {
        type: String,
    },
    portfolio: {
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model("Profile", ProfileSchema);
