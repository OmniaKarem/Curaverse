import express from "express";
import routers from "../routes/apis/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import setMedicationReminder from "../utils/medicationCronJob.mjs";
import setAppointmentReminder from "../utils/appointmentCronJob.mjs";
import passport from "passport";
import "../strategies/local-strategy.mjs";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

setAppointmentReminder();
setMedicationReminder();

app.use(cookieParser());
app.use(
  session({
    secret: "sec282021ret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 * 24, secure: false, httpOnly: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routers);

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
