import { Router } from "express";
import { Reviews, Doctors, User, Agreements } from "../../utils/db.mjs";
import Sequelize from "sequelize";
import { sql } from "../../utils/db.mjs";

const router = Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

router.get(
  "/api/doctors/:doctor_id/reviews",
  ensureAuthenticated,
  async (req, res) => {
    const doctorId = req.params.doctor_id;
    try {
      const reviews = await sql.query(
        `
            SELECT
                reviews.review_id,
                reviews.user_id,
                reviews.doctor_id,
                reviews.rating,
                reviews.review,
                reviews.createdAt,
                reviews.updatedAt,
                user.user_id AS 'user.user_id',
                user.name AS 'userName',
                doctor.doctor_id AS 'doctor.doctor_id',
                doctor.name AS 'doctorName',
                COUNT(CASE WHEN agreements.agreement_type = 'Agree' THEN 1 END) AS 'agreeCount',
            COUNT(CASE WHEN agreements.agreement_type = 'Disagree' THEN 1 END) AS 'disagreeCount'
            FROM
                reviews
            LEFT OUTER JOIN
                users AS user
            ON
                reviews.user_id = user.user_id
            LEFT OUTER JOIN
                doctors AS doctor
            ON
                reviews.doctor_id = doctor.doctor_id
            LEFT OUTER JOIN
                agreements
            ON
                reviews.review_id = agreements.review_id
            WHERE
                reviews.doctor_id = :doctorId
            GROUP BY
                reviews.review_id,
                reviews.user_id,
                reviews.doctor_id,
                reviews.rating,
                reviews.review,
                reviews.createdAt,
                reviews.updatedAt,
                user.user_id,
                user.name,
                doctor.doctor_id,
                doctor.name;
            `,
        {
          replacements: { doctorId },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post("/api/doctors/:doctorID/reviews", async (req, res) => {
  const { doctorID } = req.params;
  const userID = req.user.user_id;

  const doctor = await Doctors.findOne({
    where: { doctor_id: doctorID, user_id: userID },
  });
  if (!doctor) {
    res.status(401).send("You are not authorized to review this doctor.");
    return;
  }
  await Reviews.create({ user_id: userID, doctor_id: doctorID, ...req.body })
    .then((review) => {
      res.status(201).send(review);
    })
    .catch((err) => {
      res.status(400).send("Error creating review " + err.message);
    });
});

router.patch("/api/reviews/:reviewID", async (req, res) => {
  const { reviewID } = req.params;
  const userID = req.user.user_id;
  const review = await Reviews.findOne({
    where: { review_id: reviewID, user_id: userID },
  });
  if (!review) {
    res.status(401).send("You are not authorized to update this review.");
    return;
  }
  await Reviews.update(
    { ...review, ...req.body },
    { where: { review_id: reviewID, user_id: userID } }
  )
    .then(() => {
      return Reviews.findOne({
        where: { review_id: reviewID, user_id: userID },
      });
    })
    .then((updatedReview) => {
      res.status(200).send(updatedReview);
    })
    .catch((err) => {
      res.status(400).send("Error updating review " + err);
    });
});

router.delete("/api/reviews/:reviewID", async (req, res) => {
  const { reviewID } = req.params;
  const userID = req.user.user_id;
  const review = await Reviews.findOne({
    where: { review_id: reviewID, user_id: userID },
  });
  if (!review) {
    res.status(401).send("You are not authorized to delete this review.");
    return;
  }
  await Reviews.destroy({ where: { review_id: reviewID, user_id: userID } })
    .then(() => {
      res.status(200).send("Review has been deleted");
    })
    .catch((err) => {
      res.status(400).send("Error deleting review " + err);
    });
});

export default router;