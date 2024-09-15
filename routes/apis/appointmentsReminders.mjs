import { Router } from "express";
import {
  AppointmentsReminders,
  Appointments,
  User,
  Doctors,
} from "../../utils/db.mjs";

const router = Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Unauthorized");
};

router.get(
  "/api/appointments/reminders",
  ensureAuthenticated,
  async (req, res) => {
    const userID = req.user.user_id;
    console.log("UserID : ", userID);
    await AppointmentsReminders.findAll({
      where: { user_id: userID },
      include: [
        {
          model: Appointments,
          include: [
            {
              model: Doctors,
              attributes: ["name", "speciality", "contact_info"],
              as: "doctor_details",
            },
          ],
          as: "appointment_details",
        },
      ],
      order: [["reminder_time", "ASC"]],
    })
      .then((reminders) => {
        console.log("reminders : ", reminders);
        res.status(200).send(reminders);
      })
      .catch((err) => {
        res.status(500).send("Error retrieving reminders " + err);
      });
  }
);

router.post(
  "/api/appointments/:appointmentId/reminder",
  ensureAuthenticated,
  async (req, res) => {
    const { appointmentId } = req.params;
    const userID = req.user.user_id;
    const { reminder_time } = req.body;

    const desiredUser = await User.findOne({ where: { user_id: userID } });
    const desiredAppointment = await Appointments.findOne({
      where: { appointment_id: appointmentId, user_id: userID },
    });
    if (!desiredAppointment) {
      return res.status(404).send("Appointment not found");
    }
    const doctor = await Doctors.findOne({
      where: { doctor_id: desiredAppointment.doctor_id, user_id: userID },
    });

    let messageToSend =
      "Hi " +
      desiredUser.name +
      ",\nDoctor " +
      doctor.name +
      " (" +
      doctor.speciality +
      ") " +
      "is waiting for you at " +
      desiredAppointment.appointment_date +
      "\nGet well soon!";
    if (desiredAppointment.notes)
      messageToSend += "\nNotes: " + desiredAppointment.notes;

    AppointmentsReminders.create({
      user_id: userID,
      appointment_id: appointmentId,
      reminder_time: reminder_time,
      message: messageToSend,
      sent: false,
    })
      .then((reminder) => {
        return res.status(201).send(reminder);
      })
      .catch((err) => {
        return res.status(500).send("Error creating reminder " + err);
      });
  }
);
router.patch(
  "/api/appointments/reminders/:reminderID",
  ensureAuthenticated,
  async (req, res) => {
    const { reminderID } = req.params;
    const { reminder_time, sent } = req.body;
    const userID = req.user.user_id;
    const desiredReminder = await AppointmentsReminders.findOne({
      where: { reminder_id: reminderID, user_id: userID },
    });
    if (!desiredReminder) {
      return res.status(404).send("Reminder not found");
    }
    AppointmentsReminders.update(
      { reminder_time: reminder_time, sent: sent },
      { where: { reminder_id: reminderID, user_id: userID } }
    )
      .then(() => {
        return AppointmentsReminders.findOne({
          where: { reminder_id: reminderID, user_id: userID },
        });
      })
      .then((updatedReminder) => {
        return res.status(200).send(updatedReminder);
      })
      .catch((err) => {
        return res.status(500).send("Error updating reminder " + err);
      });
  }
);

router.delete(
  "/api/appointments/reminders/:reminder_id",
  ensureAuthenticated,
  async (req, res) => {
    const { reminder_id } = req.params;
    const userID = req.user.user_id;
    const desiredReminder = await AppointmentsReminders.findOne({
      where: { reminder_id: reminder_id, user_id: userID },
    });
    if (!desiredReminder) {
      return res.status(404).send("Reminder not found");
    }
    AppointmentsReminders.destroy({
      where: { reminder_id: reminder_id, user_id: userID },
    })
      .then(() => {
        return res.status(204).send();
      })
      .catch((err) => {
        return res.status(500).send("Error deleting reminder " + err);
      });
  }
);

export default router;
