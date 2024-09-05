import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;

    if(!content) {
        throw new ApiError(400, "Content is required")
    }

    const video = await video.findById(videoId);

    if(!video) {
        throw new ApiError(404, "video is not found")
    }

    const comment = await comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    });

    if(!comment) {
        throw new ApiError(500, "Failed to add comment")
    }

    return res
    .status(200)
    .json(new ApiResponse(201, "Comment added Successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params;
    const {content} = req.body;

    const comment = await comment.findById(commentId);
    
    if(!comment) {
         throw new ApiError(404, "comment not found")
    }

    if(comment?.owner.toString() !== req.user?._id.toString()) {
        Comment?._id,
        {
            $set: {
                content
            }
        },
        
        {new: true}
        
    }
    if(!updateComment) {
        throw new ApiError(500, "failed to edit comment")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, "comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "only comment owner can delete their comment");
    }

    await Comment.findByIdAndDelete(commentId);

    await Like.deleteMany({
        comment: commentId,
        likedBy: req.user
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, { commentId }, "Comment deleted successfully")
        );
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }