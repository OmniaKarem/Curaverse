import { Router } from "express";
import sign_upRouter from "./users/sign_up.mjs";
import sign_inRouter from "./users/sign_in.mjs";
import updateRouter from "./users/update.mjs";
import diagnosesRouter from "./diagnoses.mjs";
import doctorsRouter from "./doctors.mjs";
import appointmentsRouter from "./appointments.mjs";
import medicationsRouter from "./medications.mjs";
import reviewsRouter from "./reviews.mjs";
import searchRouter from "./search.mjs";
import agreementsRouter from "./agreements.mjs";
import appointmentReminderRouter from "./appointmentsReminders.mjs";
import medicationReminderRouter from "./medicationsReminders.mjs";

const router = Router();

router.use(sign_upRouter);
router.use(sign_inRouter);
router.use(updateRouter);
router.use(diagnosesRouter);
router.use(doctorsRouter);
router.use(appointmentsRouter);
router.use(medicationsRouter);
router.use(reviewsRouter);
router.use(searchRouter);
router.use(agreementsRouter);
router.use(appointmentReminderRouter);
router.use(medicationReminderRouter);

export default router;
