import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    //id to khud hi ajati hai uski chinta krni ni hai
    subscriber: {
        type: Schema.Types.ObjectId,    //one who is subscribing
        ref: "User"
    },
    channel: {
         type: Schema.Types.ObjectId,    //one to whom subscriber is subscribing
        ref: "User"
    }

},{timestamps: true})






export const Subscription = mongoose.model("Subscription", subscriptionSchema)
