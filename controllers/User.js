import User from "../models/User.js";
import Otp from "../models/otpModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendMail.js";


const register = async (req,res)=>{

const {name,email,password,phone_number} = req.body;

try{

if(!name || !email || !password || !phone_number){
 return res.status(400).json({
  message:"Please fill all fields"
 })
}

const existUser = await User.findOne({
 where:{email}
})

if(existUser){
 return res.status(400).json({
  message:"User already exists"
 })
}

if(!validator.isEmail(email)){
 return res.status(400).json({
  message:"Invalid email"
 })
}

// generate otp
const otp = Math.floor(100000 + Math.random()*900000)

const expires = new Date()
expires.setMinutes(expires.getMinutes()+1)

// save otp
await Otp.create({
 name,
 email,
 password,
 phone_number,
 otp,
 expires_at:expires
})

try {
 await sendEmail(email, otp);
 console.log(`OTP email sent to ${email}`);
} catch (sendError) {
 console.error('Email send failed:', sendError);
 return res.status(500).json({
  message: 'OTP generated but email delivery failed. Check email credentials and Gmail app access.',
  error: sendError.message
 });
}

res.status(200).json({
 message: "OTP sent successfully"
})

}catch(error){
 console.log(error)
 res.status(500).json({
  message:error.message
 })
}

}



const verifyOtp = async (req,res)=>{

const {email,otp} = req.body

try{

const record = await Otp.findOne({
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

// hash password
const hashPassword = await bcrypt.hash(record.password,10)

// create user
const user = await User.create({
 name:record.name,
 email:record.email,
 password:hashPassword,
 phone_number:record.phone_number,
 is_verified:true
})

// generate jwt
const token = jwt.sign(
 {
  id:user.id,
  email:user.email
 },
 process.env.JWT_SECRET,
 {
  expiresIn:"7d"
 }
)

// delete otp
await record.destroy()

res.status(201).json({
 message:"User registered successfully",
 token,
 user
})

}catch(error){
 console.log(error)
 res.status(500).json({
  message:error.message
 })
}

}
// ...existing code...

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // remove verification requirement
    // if (!user.isVerified) {
    //   return res.status(400).json({ message: "Please verify email first" });
    // }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ...existing code...

export {register,verifyOtp,login}