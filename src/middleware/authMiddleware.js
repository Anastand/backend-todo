import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({msg:"no token provided"})
  }
  const token = authHeader.split(" ")[1]
  if (!token) { return res.status(401).json({ msg: "invalid token format" }) }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.userId, username: decoded.username }
    next()
  } catch (error) {
    res.status(401).json({msg:"invalid token"})
  }
}