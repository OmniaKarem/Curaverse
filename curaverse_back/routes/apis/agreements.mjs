import { Router } from "express";
import { Agreements } from "../../utils/db.mjs";

const router = Router();

router.post("/api/reviews/:review_id/agreements", async (req, res) => {
  const { review_id } = req.params;
  const { agreement_type } = req.body;
  const userID = req.user.user_id;

  try {
    const [agreementInstance, created] = await Agreements.findOrCreate({
      where: { user_id: userID, review_id: review_id },
      defaults: { agreement_type: agreement_type },
    });

    if (!created) {
      agreementInstance.agreement_type = agreement_type;
      await agreementInstance.save();
    }

    return res
      .status(201)
      .json({ agreement_type: agreementInstance.agreement_type });
  } catch (err) {
    return res.status(500).send("Error creating agreement " + err);
  }
});

export default router;
