import dotenv from "dotenv";

// Load .env
dotenv.config();

// URI check
if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not provided");

// JWT check
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not provided");

const config = {
    MONGO_URL: process.env.MONGO_URI,
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    DB_NAME: process.env.DB_NAME || "job_tracker",
};

export default config;