import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {

const transporter = nodemailer.createTransport({
 service:"gmail",
 auth:{
  user:process.env.EMAIL,
  pass:process.env.PASSWORD
 }
});

await transporter.sendMail({
 from:process.env.EMAIL,
 to:email,
 subject:"OTP Verification",
 html:`
 <h2>Email Verification</h2>
 <p>Dear SaloonX User,</p>
 <p>We have received a request to verify your email address ${email}. Please use the following OTP:</p>
 <h1>${otp}</h1>
 <p>OTP valid for 2 minutes</p>
 `
});

};

export default sendEmail;