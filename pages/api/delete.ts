import connectMongo from "../../utils/connectMongo";
import Booking, { bookingSchema } from "../../models/booking";
import { Document } from "mongoose";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

export default async function deleteBook (req: any, res: any) {
  try {
    const { date , id, user, game, startTime, endTime } =
        req.body;
      
      console.log(req.body)
    interface IBooking extends Document {
      date: Date;
      ocuppancy: {
        "600": Number;
        "700": Number;
        "800": Number;
        "900": Number;
        "1000": Number;
        "1100": Number;
        "1200": Number;
        "1300": Number;
        "1400": Number;
        "1500": Number;
        "1600": Number;
        "1700": Number;
        "1800": Number;
        "1900": Number;
        "2000": Number;
        "2100": Number;
      };
      reservations: [Object];
    }
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");
    //find if there is a booking for the date
    const newDate = new Date(req.body.date);
      console.log(newDate)
    const booking: any = await Booking.findOne({
      date: newDate,
    });
      if (booking) {
          console.log("BOOKING FOUND")
          
          const oID = `new ObjectId("${id}")`
          console.log(oID)
          
     console.log(booking.reservations.findIndex(e => e._id.toString() == id))
          if (user === booking.reservations[booking.reservations.findIndex(e => e._id.toString() === id)].owner) {
              
              
              //if there is a booking for the date, remove the reservation from the array
      booking.reservations.splice(booking.reservations.findIndex(e => e._id.toString() ===id), 1);
              
          } else { throw new Error("You are not the owner of this reservation")}
      

      //Define ocuppancy
      let ocuppancy: number;
      if (game === "Blood Bowl" || game === "Marvel Crisis Protocol") {
        ocuppancy = 0.5;
      } else {
        ocuppancy = 1;
      }
      console.log("UPDATING BOOKING");
      //Update ocuppancy
      for (let i = 600; i < 2100; i += 100) {
        if (i >= startTime && i < endTime) {
          booking.ocuppancy[i.toString()] -= ocuppancy;
          if (booking.ocuppancy[i.toString()] > 6) {
            throw new Error("Too many players");
          }
        }
      }
      //Save the booking
      await booking.save();
      res.status(200).json({ message: "Reservation added" });
    } 
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
