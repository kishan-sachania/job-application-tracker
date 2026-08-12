import mongoose from "mongoose";
import config from "./config.js";

const mongoConnection = async () => {
    try {
        await mongoose.connect(config.MONGO_URL, {
            dbName: config.DB_NAME,
        });
        console.log(`MongoDB connected successfully to database: '${config.DB_NAME}'`);
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};

export default mongoConnection;