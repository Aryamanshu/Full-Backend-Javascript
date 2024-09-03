//ye sirf verify krega user hai ki nhi hai

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, _, next) => {   // _  ye "res" ka notation hai
   try {
    const token = req.cookies?.accessToken ||            //cookies me se token leleo ya authorization se me lelo
    req.header("Authorizaition")?.replace("Bearer", "")  // bearer given hota hai islye use empty string se replace ke rhre hai
 
 
    if(!token) {
     throw new ApiError(401, "Unauthorized Request")
    }
 
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
    const user = await User.findById(decodedToken?._id)  // jab model bnaya tha _id hi naam rakha tha
    .select("-password -refreshToken")
 
    if(!user) {
     // discuss about frontend 
     throw new ApiError(401, "Invalid Access Token")
    }
 
    //agar user hai hi hai toh fir
    req.user = user;
    next()
   
} catch (error) {
       throw new ApiError(401, error?.message || "Invalid Access token")
   }


})
