import Owner from "../models/ownerModel.js";
import OwnerOtp from "../models/ownerOtp.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/ownerMailSend.js";
import bcrypt from "bcrypt";

const registerOwner = async (req,res)=>{

const {name,email,phone_number,dob,password,address,barber_names} = req.body;
console.log("Owner registration request:", {name,email,phone_number,dob,password,address});
console.log("Files:", req.files);

const profileFile = req.files?.profile?.[0]
const backgroundFile = req.files?.background?.[0]
const profile = profileFile ? (profileFile.path || profileFile.filename || null) : null
const background = backgroundFile ? (backgroundFile.path || backgroundFile.filename || null) : null

try{

if(!name || !email || !phone_number || !dob || !password || !address  ){
return res.status(400).json({
message:"Please fill all fields"
})
}

// Basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
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

// Format DOB - handle both YYYY-MM-DD and DD-MM-YYYY formats
let formattedDob = dob;
if(dob.includes("-")) {
  const dobParts = dob.split("-");
  if(dobParts.length === 3) {
    // Check if it's YYYY-MM-DD format (HTML date input)
    if(dobParts[0].length === 4) {
      formattedDob = dob; // Already in YYYY-MM-DD format
    } else {
      // Convert DD-MM-YYYY to YYYY-MM-DD
      const [day,month,year] = dobParts;
      formattedDob = `${year}-${month}-${day}`;
    }
  }
}

const yearNumber = parseInt(formattedDob.split("-")[0], 10);
if(isNaN(yearNumber) || yearNumber < 1950){
  return res.status(400).json({
    message:"DOB must be a valid date"
  })
}

const existUser = await Owner.findOne({
where:{email: email.toLowerCase()}
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
email: email.toLowerCase(),
phone_number,
dob:formattedDob,
address,
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

if(!record.profile_image || !record.background_image || !record.address){
  return res.status(400).json({
    message:"OTP record incomplete. Please re-submit registration with profile and background images."
  })
}

const owner = await Owner.create({
  name: record.name,
  email: record.email,
  phone_number: record.phone_number,
  dob: record.dob,
  address: record.address,
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

const updateOwnerProfile = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Invalid token: missing user ID"
      });
    }

    const userId = req.user.id;

    const {
      salonName,
      address,
      email,
      phone_number,
      barber_names,
      aboutSalon,
      salonStatus
    } = req.body;

    console.log('Updating profile for userId:', userId);

    // find logged in owner
    const owner = await Owner.findOne({
      where: { id: userId }
    });

    console.log('Owner found:', owner ? 'yes' : 'no');

    if (!owner) {
      return res.status(404).json({
        message: "Owner not found"
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== owner.email.toLowerCase()) {
      const existingOwner = await Owner.findOne({
        where: { email: email.toLowerCase() }
      });
      if (existingOwner) {
        return res.status(400).json({
          message: "Email already in use by another account"
        });
      }
    }

    // update fields
    await owner.update({
      salonName,
      address,
      email: email ? email.toLowerCase() : owner.email,
      phone_number,
      barber_names,
      aboutSalon,
      salonStatus
    });

    res.status(200).json({
      message: "Profile updated successfully",
      owner
    });

  } catch (error) {
    console.log('Update profile error:', error);
    console.error('Full error details:', error.message, error.stack);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: "Validation error: " + error.errors.map(e => e.message).join(', ')
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: "Email already exists"
      });
    }
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

const loginOwner = async (req,res)=>{

try{

const {email,password} = req.body
console.log("Owner login attempt:", {email});

if(!email || !password){
  return res.status(400).json({
    message:"Email and password are required"
  })
}

const owner = await Owner.findOne({
where:{email: email.toLowerCase()}
})

if(!owner){
console.log("Owner not found with email:", email);
return res.status(404).json({
message:"Owner not found"
})
}

const isPasswordValid = await bcrypt.compare(password, owner.password)

if(!isPasswordValid){
  console.log("Invalid password for owner:", email);
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
user: {
  id: owner.id,
  name: owner.name,
  email: owner.email,
  phone_number: owner.phone_number,
  role: 'owner'
}
})

}catch(error){

res.status(500).json({
message:error.message
})

}

}

export {registerOwner,verifyOwnerOtp,loginOwner,updateOwnerProfile}

