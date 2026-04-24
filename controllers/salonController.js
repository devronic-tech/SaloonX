import Salon from "../models/salonModel.js"
import bcrypt from "bcrypt"

const createSalon = async (req,res)=>{

try{

const {
salon_name,
owner_name,
address,
email,
phone_number,
password,
confirmPassword,
barbers
} = req.body

if(password !== confirmPassword){
return res.status(400).json({
message:"Passwords do not match"
})
}

// hash password
const hashedPassword = await bcrypt.hash(password,10)

// Cloudinary images
const images = req.files?.map(file => file.path) || []

// barbers array (from frontend JSON or comma separated)
let barberArray = []

if(barbers){
barberArray = Array.isArray(barbers)
? barbers
: barbers.split(",")
}

const salon = await Salon.create({

owner_id:req.user.id,
salon_name,
owner_name,
address,
email,
phone_number,
password:hashedPassword,
barbers:barberArray,
salon_image:images

})

res.status(201).json({
message:"Salon created successfully",
salon
})

}catch(error){

res.status(500).json({
message:error.message
})

}

}

export {createSalon}