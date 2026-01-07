import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const db = process.env.MONGO_URL;

        const { connection } = await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`MongoDB Connected to ${connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error.message || error);
        process.exit(1);
    }
};