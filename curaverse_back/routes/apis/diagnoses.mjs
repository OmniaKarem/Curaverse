import { Router } from "express";
import { Diagnoses } from "../../utils/db.mjs";
import "../../strategies/local-strategy.mjs";
import { Op } from "sequelize";

const router = Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Unauthorized");
};

router.get("/api/diagnoses", ensureAuthenticated, async (req, res) => {
  const userID = req.user.user_id;
  await Diagnoses.findAll({ where: { user_id: userID } })
    .then((diagnoses) => {
      return res.status(200).send(diagnoses);
    })
    .catch((err) => {
      return res.status(500).send("Error retrieving diagnoses " + err);
    });
});

router.get("/api/diagnoses/search", ensureAuthenticated, async (req, res) => {
  const userID = req.user.user_id;
  const searchTerm = req.query.search || "";

  console.log("Search Term:", searchTerm);

  try {
    const diagnoses = await Diagnoses.findAll({
      where: {
        user_id: userID,
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm.toLocaleLowerCase()}%` } },
          {
            diagnosis_date: {
              [Op.like]: `%${searchTerm.toLocaleLowerCase()}%`,
            },
          },
          {
            notes: { [Op.like]: `%${searchTerm.toLocaleLowerCase()}%` },
          },
        ],
      },
    });
    console.log("Diagnoses found:", diagnoses);
    res.status(200).send(diagnoses);
  } catch (err) {
    console.error("Error retrieving diagnoses:", err);
    res.status(500).send("Error retrieving diagnoses: " + err);
  }
});

router.post("/api/diagnoses", ensureAuthenticated, async (req, res) => {
  const userID = req.user.user_id;
  try {
    const diagnosis = await Diagnoses.create({ user_id: userID, ...req.body });
    return res.status(201).send(diagnosis);
  } catch (err) {
    console.error("Error creating diagnosis:", err);
    return res.status(500).send("Error creating diagnosis " + err.message);
  }
});

router.patch(
  "/api/diagnoses/:diagnosis_id",
  ensureAuthenticated,
  async (req, res) => {
    const userID = req.user.user_id;
    const { diagnosis_id } = req.params;
    const desiredDiagnosis = await Diagnoses.findOne({
      where: { user_id: userID, diagnosis_id: diagnosis_id },
    });
    if (!desiredDiagnosis) {
      return res.status(404).send("Diagnosis not found");
    }
    Diagnoses.update(
      { ...desiredDiagnosis, ...req.body },
      { where: { user_id: userID, diagnosis_id: diagnosis_id } }
    )
      .then(() => {
        return Diagnoses.findOne({
          where: { user_id: userID, diagnosis_id: diagnosis_id },
        });
      })
      .then((updatedDiagnosis) => {
        return res.status(200).send(updatedDiagnosis);
      })
      .catch((err) => {
        return res.status(500).send("Error updating diagnosis " + err);
      });
  }
);

router.delete(
  "/api/diagnoses/:diagnosis_id",
  ensureAuthenticated,
  async (req, res) => {
    const userID = req.user.user_id;
    const { diagnosis_id } = req.params;
    await Diagnoses.destroy({
      where: { user_id: userID, diagnosis_id: diagnosis_id },
    })
      .then(() => {
        res.status(200).send("Diagnosis has been deleted");
      })
      .catch((err) => {
        res.status(500).send("Error deleting diagnosis " + err);
      });
  }
);

export default router;
