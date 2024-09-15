import { Router } from "express";
import { Medications } from "../../utils/db.mjs";
import { Op } from "sequelize";

const router = Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Unauthorized");
};

router.get("/api/medications", ensureAuthenticated, async (req, res) => {
  const userID = req.user.user_id;
  await Medications.findAll({ where: { user_id: userID } })
    .then((medications) => {
      res.status(200).send(medications);
    })
    .catch((err) => {
      res.status(500).send("Error retrieving medications " + err);
    });
});

router.get("/api/medications/search", ensureAuthenticated, async (req, res) => {
  const userID = req.user.user_id;
  const searchTerm = req.query.search || "";
  Medications.findAll({
    where: {
      user_id: userID,
      [Op.or]: [
        { name: { [Op.like]: `%${searchTerm.toLocaleLowerCase()}%` } },
        { dosage: { [Op.like]: `%${searchTerm.toLocaleLowerCase()}%` } },
        { notes: { [Op.like]: `%${searchTerm.toLocaleLowerCase()}%` } },
      ],
    },
  })
    .then((medications) => {
      res.status(200).send(medications);
    })
    .catch((err) => {
      res.status(500).send("Error retrieving medications " + err);
    });
});

router.post("/api/medications", ensureAuthenticated, (req, res) => {
  const userID = req.user.user_id;
  Medications.create({ user_id: userID, ...req.body })
    .then((medications) => {
      return res.status(201).send(medications);
    })
    .catch((err) => {
      return res.status(500).send("Error creating medication " + err);
    });
});

router.patch(
  "/api/medications/:medication_id",
  ensureAuthenticated,
  async (req, res) => {
    const userID = req.user.user_id;
    const { medication_id } = req.params;
    const desiredMedication = await Medications.findOne({
      where: { user_id: userID, medication_id: medication_id },
    });
    if (!desiredMedication) {
      return res.status(404).send("Medication not found");
    }
    Medications.update(
      { ...desiredMedication, ...req.body },
      { where: { user_id: userID, medication_id: medication_id } }
    )
      .then(() => {
        return Medications.findOne({
          where: { user_id: userID, medication_id: medication_id },
        });
      })
      .then((updatedMedication) => {
        return res.status(200).send(updatedMedication);
      })
      .catch((err) => {
        return res.status(500).send("Error updating medication " + err);
      });
  }
);

router.delete(
  "/api/medications/:medication_id",
  ensureAuthenticated,
  (req, res) => {
    const userID = req.user.user_id;
    const { medication_id } = req.params;
    Medications.destroy({
      where: { user_id: userID, medication_id: medication_id },
    })
      .then(() => {
        res.status(200).send("Medication has been deleted");
      })
      .catch((err) => {
        res.status(500).send("Error deleting medication " + err);
      });
  }
);

export default router;
