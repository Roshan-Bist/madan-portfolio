const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const connectDB = require("./Database/connectDb");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const articleRoutes = require("./routes/articleRoutes");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

function isOriginAllowed(origin) {
    if (!origin) return true; // non-browser clients (curl, Render health checks)
    const normalized = origin.replace(/\/$/, "");

    return allowedOrigins.some((allowed) => {
        if (allowed === "*" || allowed === normalized) return true;
        // Support patterns like https://*.vercel.app
        if (allowed.includes("*")) {
            const pattern = `^${allowed
                .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
                .replace(/\\\*/g, ".*")}$`;
            return new RegExp(pattern).test(normalized);
        }
        return false;
    });
}

app.use(cors({
    origin(origin, callback) {
        if (isOriginAllowed(origin)) {
            return callback(null, true);
        }
        console.warn(`CORS blocked origin: ${origin}`);
        return callback(null, false);
    },
    credentials: true,
}));

app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(uploadsDir));

// Quick checks after deploy — open these in the browser
app.get("/", (_req, res) => {
    res.json({
        ok: true,
        message: "Portfolio API is running",
        docs: {
            health: "/api/health",
            test: "/api/test",
            profile: "/api/profile",
            articles: "/api/articles",
        },
    });
});

app.get("/api/health", (_req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
    }[dbState] || "unknown";

    const healthy = dbState === 1;

    res.status(healthy ? 200 : 503).json({
        ok: healthy,
        service: "portfolio-api",
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
        database: dbStatus,
    });
});

app.get("/api/test", (_req, res) => {
    res.json({
        ok: true,
        message: "Server is working fine",
        env: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/articles", articleRoutes);

// Optional: serve built frontend when present (local/fullstack hosts)
const clientDist = path.join(__dirname, "../client/dist");
if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get(/.*/, (req, res, next) => {
        if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
            return next();
        }
        res.sendFile(path.join(clientDist, "index.html"));
    });
}

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
