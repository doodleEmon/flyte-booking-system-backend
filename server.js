import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import flightRoutes from "./routes/flightRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
