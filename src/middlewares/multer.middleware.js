import multer from "multer";



//  ye sab multer k documentation se uthaya hai
const storage = multer.diskStorage({
    destination: function (req, file, cb) {  // cb is callback
      cb(null, "./public/temp")   // sari files public me rkhengy taki easly access mil jaye
    },
    filename: function (req, file, cb) {

    cb(null, file.originalname)
    }
  })
  
 export  const upload = multer({ 
     storage, 
})

// yaha tak configuration ho chuki hai