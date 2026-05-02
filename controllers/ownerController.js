import Owner from "../models/ownerModel.js";
import OwnerOtp from "../models/ownerOtp.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/ownerMailSend.js";
import bcrypt from "bcrypt";

const registerOwner = async (req,res)=>{

const {name, email, phone_number, dob, password, address, salonName, barber_names} = req.body;
console.log("Owner registration request:", {name, email, phone_number, dob, password, address, salonName});
console.log("Files:", req.files);

const profileFile = req.files?.profile?.[0]
const backgroundFile = req.files?.background?.[0]
const profile = profileFile ? (profileFile.path || profileFile.filename || null) : "/user.jpg"
const background = backgroundFile ? (backgroundFile.path || backgroundFile.filename || null) : "/banner.jpg"

try {
  if (!name || !email || !phone_number || !password || !address) {
    return res.status(400).json({
      message: "Please fill all required fields (name, email, phone, password, address)"
    })
  }

// Basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
return res.status(400).json({
message:"Invalid email"
})
}

// Images are optional for now, default values assigned above

if(password.length < 6){
  return res.status(400).json({
    message:"Password must be at least 6 characters long"
  })
}

// Format DOB if provided
let formattedDob = dob || "2000-01-01";
if (dob && dob.includes("-")) {
  const dobParts = dob.split("-");
  if (dobParts.length === 3) {
    if (dobParts[0].length === 4) {
      formattedDob = dob;
    } else {
      const [day, month, year] = dobParts;
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

// Check for unique salon name
if (salonName) {
  const existSalon = await Owner.findOne({
    where: { salonName: salonName }
  });
  if (existSalon) {
    return res.status(400).json({
      message: "Salon name already exists"
    });
  }
}

const hashedPassword = await bcrypt.hash(password, 10)

const otp = Math.floor(100000 + Math.random()*900000)

const expires = new Date()
expires.setMinutes(expires.getMinutes()+2)

await OwnerOtp.create({
  name,
  email: email.toLowerCase(),
  phone_number,
  dob: formattedDob,
  address,
  profile_image: profile,
  background_image: background,
  password: hashedPassword,
  otp,
  expires_at: expires,
  salonName,
  barber_names: [...new Set(Array.isArray(barber_names) ? barber_names : (barber_names ? barber_names.split(",") : []))]
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
  salonName: record.salonName,
  barber_names: record.barber_names,
  is_verified: true
})

const token = jwt.sign({

id:owner.id,
email:owner.email

},
process.env.JWT_SECRET,
{
expiresIn:"365d"
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
      salonStatus,
      existingPhotos
    } = req.body;

    // Handle files if uploaded via multer
    const profileFile = req.files?.profile?.[0];
    const backgroundFile = req.files?.background?.[0];
    const newSalonImages = req.files?.salon_image?.map(file => file.path) || [];
    
    let existingPhotosArray = [];
    if (existingPhotos) {
      existingPhotosArray = Array.isArray(existingPhotos) ? existingPhotos : JSON.parse(existingPhotos);
    }

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

    // Check if salonName is being changed and if it already exists
    if (salonName && salonName !== owner.salonName) {
      const existingSalon = await Owner.findOne({
        where: { salonName: salonName }
      });
      if (existingSalon) {
        return res.status(400).json({
          message: "Salon name already exists"
        });
      }
    }

    // Combine existing photos and newly uploaded ones
    const combinedSalonImages = [...existingPhotosArray, ...newSalonImages];

    const updateData = {
      salonName,
      address,
      email: email ? email.toLowerCase() : owner.email,
      phone_number,
      barber_names: Array.isArray(barber_names) ? [...new Set(barber_names)] : barber_names,
      aboutSalon,
      salonStatus,
      saloonImg: combinedSalonImages
    };

    if (profileFile) {
      updateData.profile_image = profileFile.path || profileFile.filename;
    }
    if (backgroundFile) {
      updateData.background_image = backgroundFile.path || backgroundFile.filename;
    }

    // update fields
    await owner.update(updateData);

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

id:owner.id,
salon_id:owner.id

},
process.env.JWT_SECRET,
{
expiresIn:"365d"
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
  profile_image: owner.profile_image,
  role: 'owner'
}
})

}catch(error){

res.status(500).json({
message:error.message
})

}

}

const getOwnerProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const owner = await Owner.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ['password'] }
    });
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    res.status(200).json({ owner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSalons = async (req, res) => {
  try {
    const salons = await Owner.findAll({
      where: { is_verified: true },
      attributes: ['id', 'name', 'salonName', 'address', 'profile_image', 'saloonImg', 'salonStatus', 'aboutSalon', 'total_rating', 'rating_count']
    });
    res.status(200).json({ salons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {registerOwner,verifyOwnerOtp,loginOwner,updateOwnerProfile, getOwnerProfile, getAllSalons}

