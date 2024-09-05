import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    const healthcheck = asyncHandler(async (req, res) => {
        return res
        .status(200)
        .json(new ApiResponse(400, "Everything is OK"))
});

export {
    healthcheck
    }
    