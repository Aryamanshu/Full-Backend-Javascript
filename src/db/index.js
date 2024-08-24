import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

// databse se baat krne me time lgta hai isliye async await toh ataa hi ata hai
const connectDB = async () => {
    try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      console.log(`\n MONGODB connected !! DB Host: 
        ${connectionInstance.connection.host}`);
      
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1)  //ye ek method aur ye alag alag process k exit code hai padhna padega node pr jaa k
        
    }
}


export default connectDB