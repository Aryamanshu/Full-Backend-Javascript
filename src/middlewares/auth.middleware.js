// ye sirf verify krega user hai ki nhi hai

import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";


export const verifyJWT = asyncHandler(async (req, res, next) => {
   try {
    const token = req.cookies?.accesstoken ||            //cookies me se token leleo ya authorization se me lelo
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
       throw new ApiError(401, error?.message || "Invalid access token")
   }


})
