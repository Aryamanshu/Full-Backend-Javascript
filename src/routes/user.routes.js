import { Router } from "express";
import { registeruser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post( // fields me bhut sare options hote hai abhi bs 2 use kr rhe he
    upload.fields([
       {
        name: "avatar",
        maxCount: 1
       }, 
       {
        name: "coverImage",
        maxCount: 1
       } 
    ]),
    registeruser)

export default router