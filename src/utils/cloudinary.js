import {v2 as cloudinary} from "cloudinary"
import { response } from "express";
import fs from "fs"   // filesystem, hepls in file read, write, remove, update etc




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_KEY     // Click 'View API Keys' above to copy your API secret
    });
    
  

    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return null
            //upload file on cloudinary
            cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"           // it will automatically detect that it is image, video, pdf etc
            })
             // file has been uploaded successfully
             console.log("FILE is uplaoded on cloudinary", response.url);
             return response;
             
        } catch (error) {
            fs.unlinkSync(localFilePath)  // remove the locally saved temperory file as the upload operation got failed
            return null
        }
    }


    export {uploadOnCloudinary}
    
    
    
  