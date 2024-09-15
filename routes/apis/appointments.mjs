import { Router } from "express";
import { Appointments, Doctors } from "../../utils/db.mjs";
import { Op } from "sequelize";

const router = Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("User not authenticated");
};

// appointments should be displayed with doctor details.
router.get("/api/appointments", ensureAuthenticated, async (req, res) => {
  const userID = req.user.user_id;
  await Appointments.findAll({
    where: { user_id: userID },
    include: [
      {
        model: Doctors,
        attributes: ["name", "speciality", "contact_info"],
        as: "doctor_details",
      },
    ],
    order: [["appointment_date", "ASC"]],
  })
    .then((appointments) => {
      res.status(200).send(appointments);
    })
    .catch((err) => {
      res.status(500).send("Error retrieving appointments " + err);
    });
});

router.get(
  "/api/appointments/search",
  ensureAuthenticated,
  async (req, res) => {
    const userID = req.user.user_id;
    const searchTerm = req.query.search || "";

    console.log("Search Term:", searchTerm);

    try {
      const doctors = await Doctors.findAll({
        where: {
          user_id: userID,
          name: { [Op.like]: `%${searchTerm}%` },
        },
      });

      const doctorIds = doctors.map((doctor) => doctor.doctor_id);

      const appointments = await Appointments.findAll({
        where: {
          user_id: userID,
          [Op.or]: [
            {
              doctor_id: {
                [Op.in]: doctorIds,
              },
            },
            {
              appointment_date: {
                [Op.like]: `%${searchTerm}%`,
              },
            },
            {
              notes: {
                [Op.like]: `%${searchTerm}%`,
              },
            },
          ],
        },
        include: [
          {
            model: Doctors,
            attributes: ["name", "speciality", "contact_info"],
            as: "doctor_details",
          },
        ],
        order: [["appointment_date", "ASC"]],
      });

      console.log("Appointments found:", appointments);
      res.status(200).send(appointments);
    } catch (err) {
      console.error("Error retrieving appointments:", err);
      res.status(500).send("Error retrieving appointments: " + err);
    }
  }
);

// the body should contain doctor_name, appointment_date and notes.
router.post("/api/appointments", ensureAuthenticated, async (req, res) => {
  const userID = req.user.user_id;
  const { doctor_name } = req.body;

  const doctor = await Doctors.findOne({
    where: { user_id: userID, name: doctor_name },
  });
  if (!doctor) {
    return res
      .status(400)
      .json({ message: "Doctor not found. Please create this doctor first." });
  }

  await Appointments.create({
    user_id: userID,
    doctor_id: doctor.doctor_id,
    ...req.body,
  })
    .then((appointment) => {
      return res.status(201).send(appointment);
    })
    .catch((err) => {
      return res.status(500).send("Error creating appointment " + err);
    });
});

router.patch(
  "/api/appointments/:appointment_id",
  ensureAuthenticated,
  async (req, res) => {
    const userID = req.user.user_id;
    const { appointment_id } = req.params;
    const { doctor_name } = req.body;
    if (doctor_name) {
      const doctor = await Doctors.findOne({
        where: { user_id: userID, name: doctor_name },
      });
      if (!doctor) {
        return res
          .status(400)
          .send("Doctor not found. Please create a doctor first.");
      }
      req.body.doctor_id = doctor.doctor_id;
    }
    const desiredAppointment = await Appointments.findOne({
      where: { user_id: userID, appointment_id: appointment_id },
    });
    if (!desiredAppointment) {
      return res.status(404).send("Appointment not found");
    }
    Appointments.update(
      { ...desiredAppointment, ...req.body },
      { where: { user_id: userID, appointment_id: appointment_id } }
    )
      .then(() => {
        return Appointments.findOne({
          where: { user_id: userID, appointment_id: appointment_id },
        });
      })
      .then((updatedAppointment) => {
        return res.status(200).send(updatedAppointment);
      })
      .catch((err) => {
        return res.status(500).send("Error updating appointment " + err);
      });
  }
);

router.delete(
  "/api/appointments/:appointment_id",
  ensureAuthenticated,
  async (req, res) => {
    const { appointment_id } = req.params;
    const userID = req.user.user_id;
    await Appointments.destroy({
      where: { user_id: userID, appointment_id: appointment_id },
    })
      .then(() => {
        res.status(200).send("Appointment has been deleted");
      })
      .catch((err) => {
        res.status(500).send("Error deleting appointment " + err);
      });
  }
);

export default router;
