import jwt from "jsonwebtoken";
import User from "../models/User.js";
export default async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Authentication required" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "Account not found" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
