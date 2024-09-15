import { Router } from "express";
import { Doctors } from "../../utils/db.mjs";
import "../../strategies/local-strategy.mjs";
import { Op } from "sequelize";

const router = Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Unauthorized");
};

router.get("/api/doctors", ensureAuthenticated, async (req, res) => {
  const userID = req.user.user_id;
  await Doctors.findAll({ where: { user_id: userID } })
    .then((doctors) => {
      res.status(200).send(doctors);
    })
    .catch((err) => {
      res.status(500).send("Error retrieving doctors " + err);
    });
});

router.get("/api/doctors/search", ensureAuthenticated, async (req, res) => {
  const userID = req.user.user_id;
  const searchTerm = req.query.search || "";

  console.log("Search Term:", searchTerm);

  try {
    const doctors = await Doctors.findAll({
      where: {
        user_id: userID,
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm.toLocaleLowerCase()}%` } },
          { speciality: { [Op.like]: `%${searchTerm.toLocaleLowerCase()}%` } },
          {
            contact_info: { [Op.like]: `%${searchTerm.toLocaleLowerCase()}%` },
          },
        ],
      },
    });
    console.log("Doctors found:", doctors);
    res.status(200).send(doctors);
  } catch (err) {
    console.error("Error retrieving doctors:", err);
    res.status(500).send("Error retrieving doctors: " + err);
  }
});

router.post("/api/doctors", ensureAuthenticated, async (req, res) => {
  const userID = req.user.user_id;
  const loweredBody = Object.fromEntries(
    Object.entries(req.body).map(([key, value]) => [
      key,
      typeof value === "string" ? value.toLowerCase() : value,
    ])
  );

  const foundDoctor = await Doctors.findOne({
    where: {
      user_id: userID,
      name: loweredBody.name,
      speciality: loweredBody.speciality,
      contact_info: loweredBody.contact_info,
    },
  });

  if (foundDoctor) {
    return res.status(409).send("Doctor already exists");
  }

  try {
    const doctor = await Doctors.create({ user_id: userID, ...loweredBody });
    return res.status(201).send(doctor);
  } catch (err) {
    console.error("Error creating doctor:", err);
    return res.status(500).send("Error creating doctor " + err);
  }
});

router.patch(
  "/api/doctors/:doctor_id",
  ensureAuthenticated,
  async (req, res) => {
    const { doctor_id } = req.params;
    const userID = req.user.user_id;
    const desiredDoctor = await Doctors.findOne({
      where: { user_id: userID, doctor_id: doctor_id },
    });
    if (!desiredDoctor) {
      return res.status(404).send("Doctor not found");
    }
    const loweredBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [
        key,
        typeof value === "string" ? value.toLowerCase() : value,
      ])
    );
    Doctors.update(
      { ...desiredDoctor, ...loweredBody },
      { where: { user_id: userID, doctor_id: doctor_id } }
    )
      .then(() => {
        return Doctors.findOne({
          where: { user_id: userID, doctor_id: doctor_id },
        });
      })
      .then((updatedDoctor) => {
        return res.status(200).send(updatedDoctor);
      })
      .catch((err) => {
        return res.status(500).send("Error updating doctor " + err);
      });
  }
);

router.delete("/api/doctors/:doctorID", ensureAuthenticated, (req, res) => {
  const { doctorID } = req.params;
  const userID = req.user.user_id;
  Doctors.destroy({ where: { user_id: userID, doctor_id: doctorID } })
    .then(() => {
      res.status(200).send("Doctor has been deleted");
    })
    .catch((err) => {
      res.status(500).send("Error deleting doctor " + err);
    });
});

export default router;
