import { Router } from "express";
import { User } from "../../../utils/db.mjs";
import { checkSchema , validationResult , matchedData } from "express-validator";
import { nameOrPasswordSchema } from "../../../utils/validation_schemas.mjs";

const router = Router();

//only name , password can be changed.
router.patch("/api/users" , checkSchema(nameOrPasswordSchema) , async (req, res) =>{
    // const { userID } = req.params;
    const userID = req.user.user_id;
    const desiredUser = await User.findByPk(userID);
    if(!desiredUser){
        return res.status(404).send("User not found");
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
    }
    const data = matchedData(req);
    User.update({ ...desiredUser, ...data }, { where: { user_id: userID } })
        .then(() => {
            return User.findByPk(userID);
        })
        .then((updatedUser) => {
            return res.status(200).send(updatedUser);
        })
        .catch((err) => {
            return res.status(500).send("Error updating user"+ err);
        });
})

export default router;
