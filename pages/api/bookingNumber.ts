import connectMongo from "../../utils/connectMongo";
import Booking, { bookingSchema } from "../../models/booking";
import { LegendToggleRounded } from "@mui/icons-material";

export default async function dateBookings(req: any, res: any) {
    try {
        await connectMongo();
        let newDate = new Date(req.body.date)
        newDate.setHours(-5, 0, 0)
        const booking: any = await Booking.findOne({
            date: newDate 
        });
        let reservations = 0
        if (booking) {
            
            res.status(200).json({
                reservations: booking.reservations.length,
                bookings: booking.reservations,
                date: newDate})
        } else {
            
            res.status(200).json({
                reservations: 0,
                bookings: [],
                date: newDate})
        }
    } catch (e) { console.log(e) }
    
}