import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({

cloudinary:cloudinary,

params:(req,file)=>{

let folder = "services"

if(file.fieldname === "profile"){
folder = "profile"
}

if(file.fieldname === "background"){
folder = "background"
}

if(file.fieldname === "salon_image"){
folder = "salons"
}

if(file.fieldname === "serviceImg"){
folder = "services"
}

return{
folder:folder,
allowed_formats:["jpg","png","jpeg"]
}

}

})

const upload = multer({storage})

export default upload