import path from 'path';
// import { fileURLToPath } from 'url';
import {v2 as cloudinary} from "cloudinary"
// import fileUpload from 'express-fileupload';
const fileUpload = async (file, folder) => {
    try {
        console.log(file)
        const supportedType = [".jpg" ,".jpeg", ".png"];
        // const fileType = file.name.split(".")[1].toLowerCase(); // this can lead to incorrect extension if file contains multiple dots file.name.jpeg
        const fileType = path.extname(file.name).toLowerCase();

        console.log("filetype:",fileType)

        const filext = supportedType.includes(fileType)

        console.log(filext)
        if(!filext){
                console.log("File type not supported.")
        }
        return await cloudinary.uploader.upload(file.tempFilePath,folder)
        

    } catch (error) {
        console.error("Error Uploading File.",error)

    }
}
export default fileUpload;
