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




export { app }