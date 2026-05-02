import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Auth failed: Missing or malformed Authorization header");
    return res.status(401).json({
      message: "Unauthorized: Missing or malformed token",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "null" || token === "undefined") {
    console.log(`Auth failed: Token is "${token}"`);
    return res.status(401).json({
      message: "Unauthorized: Invalid token format",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("authMiddleware - decoded:", decoded);
    console.log("authMiddleware - user id:", decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({
      message: error.message === "jwt expired" ? "Token expired" : "Invalid token",
    });
  }
};

export default authMiddleware