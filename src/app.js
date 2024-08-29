import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

//app.use(cors())  // noramlly asie cors configure hojata hai but agar options bhi dene ho toh -
app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser()) //user k browser ki cookies ko access kr paye


//routes import
import userRouter from './routes/user.routes.js'


//routes declaration   // router ko seperate kr diya hai toh ab router ko laane k liye middleware lana padega
app.use("/api/v1/users", userRouter)   //yaha userRouter activate hogya  // url kuch aisa banega // http://localhost:8000/api/v1/users/register
// jaise hi users par aya fir yaha hanndle nhi hoga ab vo userRouter ko pass on krdega

export { app }