import { Router } from "express";
import { Doctors, Reviews, User } from "../../utils/db.mjs";
import { Op } from "sequelize";

const router = Router();

const ensureAuthenticated = (req, res, next) => {
  console.log("Checking authentication status...");
  if (req.isAuthenticated()) {
    console.error("User authenticated");
    next();
  } else {
    console.error("User not authenticated");
    res.status(401).json({ message: "Unauthorized" });
  }
};

router.get("/api/search", ensureAuthenticated, async (req, res) => {
  console.log("Received request for /api/search");

  const searchTerm = req.query.search || "";

  console.log("Search Term: ", searchTerm);

  await Doctors.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${searchTerm.toLocaleLowerCase()}%` } },
        { speciality: { [Op.like]: `%${searchTerm.toLocaleLowerCase()}%` } },
        { contact_info: { [Op.like]: `%${searchTerm.toLocaleLowerCase()}%` } },
      ],
    },
    include: {
      model: Reviews,
      attributes: ["rating", "review"],
      as: "doctor_reviews",
      include: { model: User, attributes: ["name"], as: "user" },
    },
  })
    .then((doctors) => {
      res.status(200).send(doctors);
    })
    .catch((err) => {
      console.error("Error during search: ", err.message);
      console.error("Stack trace: ", err.stack);
      res.status(500).send("Error retrieving doctors " + err);
    });
});

export default router;
