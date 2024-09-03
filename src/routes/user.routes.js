import { Router } from "express";
import { loginUser, logoutUser, registeruser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post( // fields me bhut sare options hote hai abhi bs 2 use kr rhe he
    upload.fields([      // ye hamara midlleware hai
       {
        name: "avatar",
        maxCount: 1
       }, 
       {
        name: "coverImage",
        maxCount: 1
       } 
    ]),
    registeruser
)

    router.route("/login").post(loginUser)

//secured Routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)




export default router