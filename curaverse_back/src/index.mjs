import express from "express";
import path from "path";
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

app.use(express.static(path.resolve("../curaverse_front/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve("../curaverse_front/dist", "index.html"));
});

app.use(cookieParser());
app.use(
  session({
    secret: "sec282021ret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60 * 24,
      secure: false,
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routers);

app.get("/", (req, res) => {
  console.log("Hello World");
  res.send("Hello World");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
