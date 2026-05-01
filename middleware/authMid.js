import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next)=>{

try{

const token = req.headers.authorization?.split(" ")[1]

if(!token){
 return res.status(401).json({
  message:"Unauthorized"
 })
}

const decoded = jwt.verify(
 token,
 process.env.JWT_SECRET
)

console.log("authMiddleware - decoded:", decoded);
console.log("authMiddleware - user id:", decoded.id);

req.user = decoded

next()

}catch(error){
console.log("authMiddleware error:", error.message);
res.status(401).json({
 message:"Invalid token"
})

}

}

export default authMiddleware