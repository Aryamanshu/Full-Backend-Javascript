// controller k liye hmne phele se helper file bna k rkhi h asyncHandler.js utils me

import { asyncHandler }  from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"



// ye line 10000 baar likhoge aage projects me
const registeruser = asyncHandler( async (req, res) => {    // method toh ban gya ab ye use kab hoga, ye use tab hoga jab koi na koi url hit hoga isliye ham routes bnate hai
    
    // steps to register the user:-
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    const {fullName, email, username, password } = req.body  // user ki details ajeyngy yaha se
    //console.log("email: ",email ); // ye check kr rha user se data arha h ki nhi   

    // ye hua normal tarika check krna ka ki empty hai ki nhi aur ab ye baar baar likhna padega email, password, username k liye
    // if(fullName === "") {
    //     throw new ApiError(400, "fullname is required")
    // }

    
    // ye optimised tariks hai validation ka 
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")  //.some js ka method hai
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]  //ab yha intro hua operators ka $or
    })

    if(existedUser) { // checking user already exists
        throw new ApiError(409, "User is already existed")  // ab yaha par apiError file ki kitni help ho rhi hai vrna baar baar res.json krna padta
    }

    
    //checking avatar and images
    const avatarlocalPath =  req.files?.avatar[0]?.path        // yha par optional chaing krna better hai
    const coverImagelocalPath =  req.files?.coverImage[0]?.path
    
    if (!avatarlocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    
    //uploading on cloudinary
    const avatar =   await uploadOnCloudinary(avatarlocalPath)
    const coverImage =   await uploadOnCloudinary(coverImagelocalPath)

    //checking bhut jarrori hai vrna databse phatega
    if(!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }


    //ab agr sara kaam hogya hai toh ek object bnaao and database me entry maar do
    // hmare pass bs User h jo database se baat kr rha hai
    const user = await User.create({
        fullName,
        avatar: avatar.url,                 // yaha toh validation hai avatar check hogya hai but coverImage ka validation nhi kiya hai
        coverImage: coverImage?.url || "",  // isiliye yaha ye check lgaya hai
        email,
        password,
        username: username.tolowerCase()
    })

    const createdUser = await User.findById(user._id).select(    //agar yaha se user mil gya toh hi user create hua hai wrnna error
        "-password -refreshToken"  // select me default sb selected hota hai toh yaha vo field do jo nhi chaiye isliye minus lgaa k likha hai
    ) 

    if(!createdUser) {
        throw new ApiError(500, "something went wrong registerinng tthe User")
    }
    

    // removeing password and refresh token field from response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


} )


export {
    registeruser,
}