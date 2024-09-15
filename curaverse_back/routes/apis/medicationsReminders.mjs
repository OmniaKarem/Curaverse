import { Router } from "express";
import { MedicationsReminders, Medications, User } from "../../utils/db.mjs";

const router = Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

router.get(
  "/api/medications/reminders",
  ensureAuthenticated,
  async (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  },
  async (req, res) => {
    const userID = req.user.user_id;
    await MedicationsReminders.findAll({ where: { user_id: userID } })
      .then((reminders) => {
        res.status(200).send(reminders);
      })
      .catch((err) => {
        res.status(500).send("Error retrieving reminders " + err);
      });
  }
);

// request body contains only the date and time of the reminder.
router.post(
  "/api/medications/:medicationID/reminder",
  ensureAuthenticated,
  async (req, res) => {
    const { medicationID } = req.params;
    const userID = req.user.user_id;
    const { reminder_time } = req.body;

    const desiredUser = await User.findOne({ where: { user_id: userID } });
    const desiredMedication = await Medications.findOne({
      where: { medication_id: medicationID, user_id: userID },
    });
    if (!desiredMedication) {
      return res.status(404).send("Medication not found");
    }
    let messageToSend =
      "Hi " +
      desiredUser.name +
      ",\nIt's time to take " +
      desiredMedication.name +
      "\nGet well soon!";
    if (desiredMedication.notes)
      messageToSend += "\nNotes: " + desiredMedication.notes;
    MedicationsReminders.create({
      user_id: userID,
      medication_id: medicationID,
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
  "/api/medications/reminders/:reminder_id",
  ensureAuthenticated,
  async (req, res) => {
    const { reminder_id } = req.params;
    const { reminder_time, sent } = req.body;
    const userID = req.user.user_id;
    const desiredReminder = await MedicationsReminders.findOne({
      where: { user_id: userID, reminder_id: reminder_id },
    });
    if (!desiredReminder) {
      return res.status(404).send("Reminder not found");
    }
    MedicationsReminders.update(
      { reminder_time: reminder_time, sent: sent },
      { where: { user_id: userID, reminder_id: reminder_id } }
    )
      .then(() => {
        return MedicationsReminders.findOne({
          where: { user_id: userID, reminder_id: reminder_id },
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
  "/api/medications/reminders/:reminderID",
  ensureAuthenticated,
  async (req, res) => {
    const { reminderID } = req.params;
    const userID = req.user.user_id;
    MedicationsReminders.destroy({
      where: { user_id: userID, reminder_id: reminderID },
    })
      .then(() => {
        res.status(200).send("Reminder has been deleted");
      })
      .catch((err) => {
        res.status(500).send("Error deleting reminder " + err);
      });
  }
);

export default router;
