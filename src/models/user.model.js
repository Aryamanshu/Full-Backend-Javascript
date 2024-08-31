import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"; // jwt hamara bearer token hai (bearer mtlb ye token jis k bhi pass hai vo mujhe ye bhejega m use data bhej dunga)
import bcrypt from "bcrypt"; // this is for encryption of password but we cant encrypt directly so we use some hooks from mongoose





const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true  // taki ye database ki searching me aane lag jaaye, khi pe bhi searching field include krni hai vha pr index: true ka zyda better hai
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true, 
        trim: true,
        index: true,
    },
    avatar: {
        type: String, //cloudinary url use krenge isme
        required:  true,

    },
    coverImage: {
        type: String,  //cloudinary url use krenge isme
    },
    watchHistory: [   // aise isliye likh rhe kyuki watchhistory dependent hai video par
        {
            type: Schema.Types.ObjectId,   // akelaa watchHistory hi is project ko bhut complex and next level bnaa ta hai
            ref: "video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String,
    }

}, {timestamps: true}
)

//here we using pre hook from mongoose middleware
userSchema.pre("save", async function (next) {   // jasie hi user kuch bhi save krega ye pre hook chal padega har baar
    
    if(!this.isModified("password")) return next(); // ye isliye likha taki jb user password change kre tab hi pre chale wrna user kuch bhi change krega for eg- avatar change krega tab bhi pre chal jayega toh vo galat hai

    this.password = await bcrypt.hash(this.password, 10)  // password encrypt hojayega
    next()
})


//we r designing custom methods here
userSchema.methods.isPasswordCorrect = async function 
(password) {
    
   return await bcrypt.compare(password, this.password)  //bcrypt lib jasie hash krti hai , vaise hi ye password bhi check kr skti hai

} // await isliye kyu ki cryptography hai toh time lgta h isliye async and await


userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id, // ye sb mongo db database arha hai
        email: this.email,
        userName: this.userName,
        fullName: this.fullName
    },
    
    process.env.ACCESS_TOKEN_SECRET,
    {  
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY   //expiry object k ander jataa hai syntax hai
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
        _id: this._id, // ye sb mongo db database arha hai
        
    },
    
    process.env.REFRESH_TOKEN_SECRET,
    {  
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY   //expiry object k ander jataa hai syntax hai
    }
)
}

export const User = mongoose.model("User", userSchema)