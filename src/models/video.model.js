import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; //yhi is project ko advance level par le k jayega

const videoSchema = new Schema({

    videoFile: {
        type: String,  // cloudinary url se lengy
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },


}, {timestamps: true})



videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model ("Video", videoSchema)