import connectMongo from "../../utils/connectMongo";
import Booking, { bookingSchema } from "../../models/booking";
import { Document } from "mongoose";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

export default async function addTest(req: any, res: any) {
  try {
    const { owner, player1, player2, date, startTime, endTime, game } =
      req.body;
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
    newDate.setHours(-5, 0, 0);
    const booking: any = await Booking.findOne({
      date: newDate,
    });
    if (booking) {
      //if there is a booking for the date, add the reservation to the array
      booking.reservations.push({
        owner: owner,
        player1: player1,
        player2: player2,
        startTime: startTime,
        endTime: endTime,
        game: game,
      });

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
          booking.ocuppancy[i.toString()] += ocuppancy;
          if (booking.ocuppancy[i.toString()] > 6) {
            throw new Error("Too many players");
          }
        }
      }
      //Save the booking
      await booking.save();
      res.status(200).json({ message: "Reservation added" });
    } else {
      //if there is no booking for the date, create a new date and booking
      console.log("CREATING DOCUMENT");
      let ocuppancy: number;
      if (game === "Blood Bowl" || game === "Marvel Crisis Protocol") {
        ocuppancy = 0.5;
      } else {
        ocuppancy = 1;
      }
      const newOcuppancy: {[index: string]: number} = {
        "600": 0,
        "700": 0,
        "800": 0,
        "900": 0,
        "1000": 0,
        "1100": 0,
        "1200": 0,
        "1300": 0,
        "1400": 0,
        "1500": 0,
        "1600": 0,
        "1700": 0,
        "1800": 0,
        "1900": 0,
        "2000": 0,
        "2100": 0,
      };
      for (let i = 600; i < 2100; i += 100) {
        if (i >= startTime && i < endTime) {
          newOcuppancy[i.toString()] += ocuppancy;
          
        }
      }
      
      const book: IBooking | null = await Booking.create({
        date: newDate,
        ocuppancy : newOcuppancy,
        reservations: [
          {
            owner: req.body.owner,
            player1: req.body.player1,
            player2: req.body.player2,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            game: req.body.game,
          },
        ],
      });
      console.log("CREATED DOCUMENT");
      res.status(200).json({ book });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
