import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({

destination:(req,file,cb)=>{

let dest = "uploads/background";
if(file.fieldname === "profile"){
dest = "uploads/profile";
}

fs.mkdirSync(dest, {recursive: true});
cb(null, dest);

},

filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname)
}

})

const upload = multer({storage})

export default upload
