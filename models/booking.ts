import { Schema, model, models, Types } from "mongoose";
const Reservation = new Schema({
  owner: String,
  player1: String,
  player2: String,
  startTime: String,
  endTime: String,
  game: String,
});
export const bookingSchema = new Schema({
  date: Date,
  ocuppancy: {
    "600": { type: Number, default: 0 },
    "700": { type: Number, default: 0 },
    "800": { type: Number, default: 0 },
    "900": { type: Number, default: 0 },
    "1000": { type: Number, default: 0 },
    "1100": { type: Number, default: 0 },
    "1200": { type: Number, default: 0 },
    "1300": { type: Number, default: 0 },
    "1400": { type: Number, default: 0 },
    "1500": { type: Number, default: 0 },
    "1600": { type: Number, default: 0 },
    "1700": { type: Number, default: 0 },
    "1800": { type: Number, default: 0 },
    "1900": { type: Number, default: 0 },
    "2000": { type: Number, default: 0 },
    "2100": { type: Number, default: 0 },
    
  },
  reservations: [Reservation],
});

const Booking = models.Book || model("Book", bookingSchema);

export default Booking;
