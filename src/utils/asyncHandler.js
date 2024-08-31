
//ye ek tarika hai aur neexhe ek aur tarika hai, ye production level codee hai 

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }



// const asyncHandler = () => {}
// const asyncHandler = (func) => {} => {}
// const asyncHandler = (func) => async () => {}
// ye iska elaboration hai jo neeche ek line likhi hui hai

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }