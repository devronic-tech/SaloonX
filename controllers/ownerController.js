import Owner from "../models/ownerModel.js";
import OwnerOtp from "../models/ownerOtp.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/ownerMailSend.js";
import bcrypt from "bcrypt";

const registerOwner = async (req,res)=>{

const {name,email,phone_number,dob,password} = req.body;

const profileFile = req.files?.profile?.[0]
const backgroundFile = req.files?.background?.[0]
const profile = profileFile ? profileFile.filename : null
const background = backgroundFile ? backgroundFile.filename : null

try{

if(!name || !email || !phone_number || !dob || !password){
return res.status(400).json({
message:"Please fill all fields"
})
}

if(!validator.isEmail(email)){
return res.status(400).json({
message:"Invalid email"
})
}

if(!profile || !background){
  return res.status(400).json({
    message:"Profile and background images are required"
  })
}

if(password.length < 6){
  return res.status(400).json({
    message:"Password must be at least 6 characters long"
  })
}

const dobParts = dob.split("-")
if(dobParts.length !== 3){
  return res.status(400).json({
    message:"DOB must use the format DD-MM-YYYY"
  })
}

const [day,month,year] = dobParts
const yearNumber = parseInt(year, 10)
if(isNaN(yearNumber) || yearNumber < 2001){
  return res.status(400).json({
    message:"DOB must be a valid date after 2001"
  })
}

const formattedDob = `${year}-${month}-${day}`

const existUser = await Owner.findOne({
where:{email}
})

if(existUser){
return res.status(400).json({
message:"Owner already exists"
})
}

const hashedPassword = await bcrypt.hash(password, 10)

const otp = Math.floor(100000 + Math.random()*900000)

const expires = new Date()
expires.setMinutes(expires.getMinutes()+2)

await OwnerOtp.create({

name,
email,
phone_number,
dob:formattedDob,
profile_image:profile,
background_image:background,
password:hashedPassword,
otp,
expires_at:expires

})

await sendEmail(email,otp)

res.status(200).json({
message:"OTP sent successfully"
})

}catch(error){

res.status(500).json({
message:error.message
})

}

}

const verifyOwnerOtp = async (req,res)=>{

const {email,otp} = req.body

try{

const record = await OwnerOtp.findOne({
  where:{email,otp}
})

if(!record){
  return res.status(400).json({
    message:"Invalid OTP"
  })
}

if(new Date() > record.expires_at){
  return res.status(400).json({
    message:"OTP expired"
  })
}

const owner = await Owner.create({
  name: record.name,
  email: record.email,
  phone_number: record.phone_number,
  dob: record.dob,
  profile_image: record.profile_image,
  background_image: record.background_image,
  password: record.password,
  is_verified: true
})

const token = jwt.sign({

id:owner.id,
email:owner.email

},
process.env.JWT_SECRET,
{
expiresIn:"7d"
}
)

await record.destroy()

res.status(201).json({

message:"Owner registered successfully",
token,
owner

})

}catch(error){

res.status(500).json({
message:error.message
})

}

}

const loginOwner = async (req,res)=>{

try{

const {email,password} = req.body

if(!email || !password){
  return res.status(400).json({
    message:"Email and password are required"
  })
}

const owner = await Owner.findOne({
where:{email}
})

if(!owner){
return res.status(404).json({
message:"Owner not found"
})
}

const isPasswordValid = await bcrypt.compare(password, owner.password)

if(!isPasswordValid){
  return res.status(401).json({
    message:"Invalid password"
  })
}

const token = jwt.sign({

id:owner.id

},
process.env.JWT_SECRET,
{
expiresIn:"7d"
}
)

res.json({
message:"Login success",
token,
owner
})

}catch(error){

res.status(500).json({
message:error.message
})

}

}

export {registerOwner,verifyOwnerOtp,loginOwner}

