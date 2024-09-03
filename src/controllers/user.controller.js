// controller k liye hmne phele se helper file bna k rkhi h asyncHandler.js utils me

import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async(userId) =>  {
    
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()            //yaha bs token  generate hue h 
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })            // method hota hai 

        return {accessToken, refreshToken}
    
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Access and Refresh Token")

    }
}

// ye line 10000 baar likhoge aage projects me
const registeruser = asyncHandler( async (req, res) => {    // method toh ban gya ab ye use kab hoga, ye use tab hoga jab koi na koi url hit hoga isliye ham routes bnate hai
    
    // steps to register the user:-
    // get user details from frontend
    // validation - not empty
    // check if user already exists: userName, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    const {fullName, email, userName, password } = req.body  // user ki details ajeyngy yaha se
    //console.log("email: ",email ); // ye check kr rha user se data arha h ki nhi   

    // ye hua normal tarika check krna ka ki empty hai ki nhi aur ab ye baar baar likhna padega email, password, userName k liye
    // if(fullName === "") {
    //     throw new ApiError(400, "fullname is required")
    // }

    
    // ye optimised tarika hai validation ka 
    if (
        [fullName, email, userName, password].some(field =>field ===undefined ||  field?.trim() === "") //.some js ka method hai
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]  //ab yha intro hua operators ka $or
    })

    if(existedUser) { // checking user already exists
        throw new ApiError(409, "User is already existed")  // ab yaha par apiError file ki kitni help ho rhi hai vrna baar baar res.json krna padta
    }

    //console.log(req.files);
    
    
    //checking avatar and images
    const avatarLocalPath =  req.files?.avatar[0]?.path;              // yha par optional chaing krna better hai
    //const coverImageLocalPath =  req.files?.coverImage[0]?.path;     //agr user coverimage ni derha h toh postman me error arha hai vo error is ? ki wajha se arha hai toh isliye image h ki nhi ham noraml if se check krengy

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
           coverImageLocalPath =  req.files.coverImage[0].path
    }
    
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    
    //uploading on cloudinary
    const avatar =   await uploadOnCloudinary(avatarLocalPath)
    const coverImage =   await uploadOnCloudinary(coverImageLocalPath)

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
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(    //agar yaha se user mil gya toh hi user create hua hai wrnna error
        "-password -refreshToken"  // select me default sb selected hota hai toh yaha vo field do jo nhi chaiye isliye minus lgaa k likha hai
    ) 

    if(!createdUser) {
        throw new ApiError(500, "something went wrong registerinng the User")
    }
    

    // removeing password and refresh token field from response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


} )

const loginUser = asyncHandler(async (req,res) => { 
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie (secure)
    // response "Login Successfull"

    const {email, userName, password} = req.body

    if(!userName && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{email}, {userName}],
    })

    if(!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)    // isPasswordCorect ye phele se hi methoda bnaya hua user.model me
    
    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    // ye optional step hai man h kro nhi h na kro
    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken").lean()              // we have used .lean() beacuse at line no. 168 when i m coverting a circular structure in json is throws error so to counter it i have used lean() method provided by Mongoose to convert the document to a plain JavaScript object.  


    // ab bhejni h cookies
      const options = {
        httpOnly: true,            // The cookie only accessible by the web server, modifiable nhi hoti hai sirf server modify kr skta hai
        secure: true
      }

      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, 
                      accessToken, 
                      refreshToken
            },
            "User logged In Successfully"
        )
    )

})

// logging user out  //iske liye hm apne phele middleware design krengy
const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken   //accesing refreshToken through cookies

    
    // if we didint get the refreshToken and ye token hme user bhej rha hai
    if(!incomingRefreshToken) {                                
        throw new ApiError(401, "Unauthorized Request")
    }

//for safety purpose error na aajye thats why try catch 
   try {
     const decodedToken = jwt.verify(                             // verifying jo refrshToken aarha hai
         incomingRefreshToken,               // verify krwane k liye ek token bhejna padta hai 
         process.env.REFRESH_TOKEN_SECRET,   //aur ek secret information bhejni padti hai
     ) 
 
     const user = await User.findById(decodedToken?._id)
     
     if(!user) {                               
         throw new ApiError(401, "Invalid refersh token")
     }
     
     // ab hm token match krwayengy jo user ne bhej hai and us token ko use kr rk hm jo user dhoondengy us token ko
     if(incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401, "Refrsh Token is expired or used")
     }
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     //we are genearting here new access and refresh token from the method we cretaed above at line no. 11
     const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)  
 
     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
         new ApiResponse(
             200, 
             { accessToken, refershToken: newRefreshToken},
             "Access TOKEN refreshed successfully"
             
         )
     )
  
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
    
   }
})






export {
    registeruser,
    loginUser,
    logoutUser,
    refreshAccessToken
}