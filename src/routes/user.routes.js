import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registeruser, 
    refreshAccessToken, 
    changeCurrentpassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory, 
    updateAccountDetails 
} from "../controllers/user.controller.js";
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
router.route("/change-password").post(verifyJWT, changeCurrentpassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)  //patch rkhna zarrori hai agar post rakh diya toh sari details update hojengy account k sath
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)  //patch sirf ek avtar update ho rha hai
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage) // upload isliye kr rhe h kyu ki multer middleware h bhi hai
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)  ///c/: k baad dena padega username kyu ki ye params se arha hai
router.route("/history").get(verifyJWT, getWatchHistory)


export default router