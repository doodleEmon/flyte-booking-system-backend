import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    flightId: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
    numberOfSeats: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    bookingStatus: { type: String, default: "Confirmed" },
});

const booking = mongoose.model("Booking", bookingSchema);
export default booking;
