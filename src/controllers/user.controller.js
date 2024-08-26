// controller k liye hmne phele se helper file bna k rkhi h asyncHandler.js utils me

import { asyncHandler }  from "../utils/asyncHandler.js"

// ye line 10000 baar likhoge aage projects me
const registeruser = asyncHandler( async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
} )  // method toh ban gya ab ye use kab hog a, ye use tab hoga jab koi na koi url hit hoga isliye ham routes bnate hai


export {registeruser}