import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Layout from "../components/layout";
import AccessDenied from "../components/access-denied";
import connectMongo from "../utils/connectMongo";
import Booking from "../models/booking";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { DataObjectSharp, Login } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

export const getServerSideProps = async () => {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    console.log("FETCHING DOCUMENTS");
    const bookings: any = await Booking.find();
    console.log("FETCHED DOCUMENTS");

    return {
      props: {
        bookings: JSON.parse(JSON.stringify(bookings)),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};
export default function ProtectedPage({ bookings }: any) {
  const timetable = [
    {
      time: "600",
      name: "6:00 AM",
    },
    {
      time: "700",
      name: "7:00 AM",
    },
    { time: "800", name: "8:00 AM" },
    { time: "900", name: "9:00 AM" },
    { time: "1000", name: "10:00 AM" },
    { time: "1100", name: "11:00 AM" },
    { time: "1200", name: "12:00 PM" },
    { time: "1300", name: "1:00 PM" },
    { time: "1400", name: "2:00 PM" },
    { time: "1500", name: "3:00 PM" },
    { time: "1600", name: "4:00 PM" },
    { time: "1700", name: "5:00 PM" },
    { time: "1800", name: "6:00 PM" },
    { time: "1900", name: "7:00 PM" },
    { time: "2000", name: "8:00 PM" },
    { time: "2100", name: "9:00 PM" },
  ];
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [content, setContent] = useState();
  const [reservations, setReservations]: any = useState(undefined);

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/examples/protected");
      const json = await res.json();
      if (json.content) {
        setContent(json.content);
      }
    };
    fetchData();
    setFormsState({ ...formState, owner: session?.user?.name || "" });
  }, [session]);

  const [formState, setFormsState] = useState({
    owner: "",
    player1: String,
    player2: String,
    date: new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        0,
        0,
        0,
        0
      )
    ).toISOString(),
    startTime: 600,
    endTime: 600,
    game: "Warhammer 40K",
  });

  const handleChange = (e: any) => {
    setFormsState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    });
    const data = await res.json();
    setReservations(await fetchBookingNumber(dayjs(reservations?.date, "YYYY-MM-DD").utcOffset(0).utc(true).format()));

                                          
    return data;
  };


  const fetchBookingNumber = async (date: string) => {
    const res = await fetch("/api/bookingNumber", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }),
    });
    const data = await res.json();
    
    return data;
  };

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null;

  // If no session exists, display access denied message
  if (!session && typeof window !== "undefined") {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  } else if (session) {
    // If session exists, display content
    return (
      <Layout>
        <h1>Reservas Medhammer</h1>
        <Calendar
          value={
            reservations?.date ? dayjs(reservations?.date, "YYYY-MM-DD")
                  .utcOffset(0)
                  .utc(true)
                  .toDate()
              : dayjs.utc().toDate()
          }
          onClickDay={async (value, event) => {
            setReservations(
              await fetchBookingNumber(
                dayjs(value).utc().set("hour", 0).format()
              )
            );
          }}
          calendarType="ISO 8601"
        />
        {reservations?.date && (
          <h3>
            {" "}
            Reservas para el {new Date(reservations?.date).getUTCDate()}/
            {new Date(reservations?.date).getUTCMonth() + 1}/
            {new Date(reservations?.date).getUTCFullYear()}{" "}
          </h3>
        )}
        {reservations && reservations.reservations} Reservaciones activas
        <h2>Agregar Reserva:</h2>
        <form action="submit" onSubmit={handleSubmit}>
          <TextField
            type="text"
            name="player1"
            onChange={handleChange}
            label="Jugador 1"
            variant="outlined"
          />
          <TextField
            type="text"
            name="player2"
            onChange={handleChange}
            label="Jugador 2"
            variant="outlined"
          />
          <DatePicker
            disablePast
            renderInput={(params) => <TextField {...params} />}
            onChange={(newValue: any) => {
              if (newValue) {
                const newDate = newValue.set("hour", 0).utc().toDate();
                newDate.setHours(0);
                const utcDate = new Date(
                  Date.UTC(
                    newDate.getFullYear(),
                    newDate.getMonth(),
                    newDate.getDate(),
                    0,
                    0,
                    0,
                    0
                  )
                ).toISOString();
                new Date();
                setFormsState({
                  ...formState,
                  date: utcDate,
                });
              }
            }}
            label="Fecha"
            /* For some ungodly reason this component renders always in local. So this spaghetti is to make it appear as UTC even if it's local.*/
            value={(function () {
              return new Date(
                new Date(formState.date).getTime() +
                  new Date(formState.date).getTimezoneOffset() * 60000
              );
            })()}
          />

          <InputLabel id="startTime">Hora de Inicio</InputLabel>
          <Select
            labelId="startTime"
            id="startTimeSelect"
            value={formState.startTime}
            label="Hora de Inicio"
            onChange={(newValue) => {
              if (typeof newValue.target.value === "number") {
                setFormsState({
                  ...formState,
                  startTime: newValue.target.value,
                });
              }
            }}
          >
            <MenuItem value={600}>6:00 AM</MenuItem>
            <MenuItem value={700}>7:00 AM</MenuItem>
            <MenuItem value={800}>8:00 AM</MenuItem>
            <MenuItem value={900}>9:00 AM</MenuItem>
            <MenuItem value={1000}>10:00 AM</MenuItem>
            <MenuItem value={1100}>11:00 AM</MenuItem>
            <MenuItem value={1200}>12:00 PM</MenuItem>
            <MenuItem value={1300}>1:00 PM</MenuItem>
            <MenuItem value={1400}>2:00 PM</MenuItem>
            <MenuItem value={1500}>3:00 PM</MenuItem>
            <MenuItem value={1600}>4:00 PM</MenuItem>
            <MenuItem value={1700}>5:00 PM</MenuItem>
            <MenuItem value={1800}>6:00 PM</MenuItem>
            <MenuItem value={1900}>7:00 PM</MenuItem>
            <MenuItem value={2000}>8:00 PM</MenuItem>
            <MenuItem value={2100}>9:00 PM</MenuItem>
          </Select>
          <InputLabel id="endTime">Hora de finalización</InputLabel>
          <Select
            labelId="endTime"
            id="endTimeSelect"
            value={formState.endTime}
            label="Hora de Finalización"
            onChange={(newValue) => {
              if (typeof newValue.target.value === "number") {
                setFormsState({
                  ...formState,
                  endTime: newValue.target.value,
                });
              }
            }}
          >
            <MenuItem value={600}>6:00 AM</MenuItem>
            <MenuItem value={700}>7:00 AM</MenuItem>
            <MenuItem value={800}>8:00 AM</MenuItem>
            <MenuItem value={900}>9:00 AM</MenuItem>
            <MenuItem value={1000}>10:00 AM</MenuItem>
            <MenuItem value={1100}>11:00 AM</MenuItem>
            <MenuItem value={1200}>12:00 PM</MenuItem>
            <MenuItem value={1300}>1:00 PM</MenuItem>
            <MenuItem value={1400}>2:00 PM</MenuItem>
            <MenuItem value={1500}>3:00 PM</MenuItem>
            <MenuItem value={1600}>4:00 PM</MenuItem>
            <MenuItem value={1700}>5:00 PM</MenuItem>
            <MenuItem value={1800}>6:00 PM</MenuItem>
            <MenuItem value={1900}>7:00 PM</MenuItem>
            <MenuItem value={2000}>8:00 PM</MenuItem>
            <MenuItem value={2100}>9:00 PM</MenuItem>
          </Select>

          <InputLabel id="game">Juego</InputLabel>
          <Select
            labelId="game"
            id="gameSelect"
            value={formState.game}
            label="Juego"
            onChange={(newValue) => {
              setFormsState({
                ...formState,
                game: newValue.target.value,
              });
            }}
          >
            <MenuItem value={"Warhammer 40K"}>Warhammer 40K</MenuItem>
            <MenuItem value={"Age of Sigmar"}>Age of Sigmar</MenuItem>
            <MenuItem value={"Blood Bowl"}>Blood Bowl</MenuItem>
            <MenuItem value={"Marvel Crisis Protocol"}>
              Marvel Crisis Protocol
            </MenuItem>
            <MenuItem value={"Star Wars Legion"}>Star Wars Legion</MenuItem>
            <MenuItem value={"MOFONGO"}>MOFONGO</MenuItem>
            <MenuItem value={"Necromunda"}>Necromunda</MenuItem>
            <MenuItem value={"LOTR"}>LOTR</MenuItem>
          </Select>
          <Button type="submit" variant="contained" color="primary">
            {" "}
            Guardar{" "}
          </Button>
        </form>
        <ul className="timetable">
          {timetable.map((time) => (
            <li key={time.time}>
              {" "}
              {time.name}
              <div>
                {" "}
                <ul>
                  {reservations?.bookings &&
                    reservations.bookings.map(
                      (booking: any) =>
                        parseInt(booking.startTime) <= parseInt(time.time) &&
                        parseInt(booking.endTime) > parseInt(time.time) && (
                          <li key={booking._id}>
                            <div className="booking">
                              <p>
                                {booking.player1} vs {booking.player2}
                              </p>
                              <p>
                                {booking.startTime} - {booking.endTime}
                              </p>
                              <p>{booking.game}</p>
                              {session?.user?.name === booking.owner && (
                                <Button
                                  variant="outlined"
                                  onClick={(e) => {
                                    const deleteFunct = async (e: any) => {
                                      console.log(e);
                                      e.preventDefault();
                                      console.log(e);
                                      const res = await fetch("/api/delete", {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          id: booking._id,
                                          user: session?.user?.name || "",
                                          date: reservations.date,
                                          startTime: booking.startTime,
                                          endTime: booking.endTime,
                                          game: booking.game,
                                        }),
                                      });
                                      const data = await res.json();
                                      console.log(data);
                                      const setDate = new Date(
                                        reservations.date
                                      );
                                      setDate.setDate(setDate.getDate() + 1);
                                      setReservations(
                                        await fetchBookingNumber(
                                          dayjs(reservations?.date, "YYYY-MM-DD").utcOffset(0).utc(true).format()
                                        )
                                      );
                                    };

                                    deleteFunct(e);
                                  }}
                                >
                                  ⛔
                                </Button>
                              )}
                            </div>
                          </li>
                        )
                    )}{" "}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <ul></ul>
      </Layout>
    );
  }
}
