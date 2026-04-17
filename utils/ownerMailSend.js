import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {

try {

const transporter = nodemailer.createTransport({

service: "gmail",

auth: {
user: process.env.EMAIL,
pass: process.env.PASSWORD
}

});

const mailOptions = {

from: process.env.EMAIL_USER || process.env.EMAIL,

to: email,

subject: "Email Verification OTP",

html: `

<h2>Owner Registration OTP</h2>
<p>Your OTP is:</p>
<h1>${otp}</h1>
<p>This OTP is valid for 2 minute</p>
`

};

await transporter.sendMail(mailOptions);

console.log("OTP email sent successfully");

} catch (error) {

console.log("Email error:", error);
throw new Error("Email sending failed");

}

};

export default sendEmail;
