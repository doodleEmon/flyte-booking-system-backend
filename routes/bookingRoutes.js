import express from "express";
import Flight from "../models/flight.js";
import Booking from "../models/booking.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new booking (User only)
router.post("/", verifyToken, async (req, res) => {
    try {
        const { flightId, seats } = req.body;

        // Check if the flight exists and has enough seats
        const flight = await Flight.findById(flightId);
        if (!flight) return res.status(404).json({ message: "Flight not found" });
        if (flight.availableSeats < seats) {
            return res.status(400).json({ message: "Not enough seats available" });
        }

        // Create a booking
        const booking = new Booking({
            userId: req.user.id,
            flightId,
            seats,
            totalPrice: seats * flight.price,
        });
        await booking.save();

        // Update flight's available seats
        flight.availableSeats -= seats;
        await flight.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Failed to create booking", error });
    }
});

// Get all bookings (Admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find().populate("flightId").populate("userId");
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve bookings", error });
    }
});

// Get bookings for a specific user
router.get("/user/:id", verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.id }).populate("flightId");
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve user bookings", error });
    }
});

// Update a booking (Admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: "Failed to update booking", error });
    }
});

// Delete a booking (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Update flight's available seats
        const flight = await Flight.findById(booking.flightId);
        if (flight) {
            flight.availableSeats += booking.seats;
            await flight.save();
        }

        await booking.remove();
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete booking", error });
    }
});

export default router;
