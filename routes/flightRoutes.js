import express from "express";
import Flight from "../models/flight.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new flight (Admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const flight = new Flight(req.body);
        const savedFlight = await flight.save();
        res.status(201).json(savedFlight);
    } catch (error) {
        res.status(500).json({ message: "Failed to create flight", error });
    }
});

// Get all flights
router.get("/", async (req, res) => {
    try {
        const flights = await Flight.find();
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve flights", error });
    }
});

// Search flights by origin, destination, and date
router.get("/search", async (req, res) => {
    const { origin, destination, date } = req.query;
    try {
        const flights = await Flight.find({
            origin: new RegExp(origin, "i"),
            destination: new RegExp(destination, "i"),
            date,
        });
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ message: "Search failed", error });
    }
});

// Get a single flight by ID
router.get("/:id", async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) return res.status(404).json({ message: "Flight not found" });
        res.status(200).json(flight);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve flight", error });
    }
});

// Update a flight (Admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const updatedFlight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedFlight) return res.status(404).json({ message: "Flight not found" });
        res.status(200).json(updatedFlight);
    } catch (error) {
        res.status(500).json({ message: "Failed to update flight", error });
    }
});

// Delete a flight (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const deletedFlight = await Flight.findByIdAndDelete(req.params.id);
        if (!deletedFlight) return res.status(404).json({ message: "Flight not found" });
        res.status(200).json({ message: "Flight deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete flight", error });
    }
});

export default router;