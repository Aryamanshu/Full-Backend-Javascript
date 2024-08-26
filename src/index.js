import dotenv from 'dotenv';
import connectDB from "./db/index.js"
import {app} from './app.js'

dotenv.config({
    path: "./env"
}) ;


// connecting database
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log("Mongo db connection failed !!!", err);
    
})







// yeh h hmari first approach 
// import express from "express"
// const app = express()

// //IIFE FUNCTION KA UJSE KR RHE NORMAL FUNCTION KI JAGAH
// // database se jb bhi baat krni ho toh try catch hmeshaaa hi lgaana hai
// ( async() => {
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error", (error) => {
//         console.log("ERRRORRR", error);
//         throw error
//         })
        
//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`);
            
//         })
//     } catch (error) {
//         console.error("ERROR: ", error)
//         throw err
//     }
// })()