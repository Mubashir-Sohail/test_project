import jwt from "jsonwebtoken";
export const isAuthentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, "Secret_Key");
      console.log("Decoded JWT:", decoded);
      req.userId = decoded.id;
      console.log("Decoded JWT:", req.userId);

      next();
    } catch (err) {
      console.log("JWT verification failed:", err);
      return res.status(401).send("Token invalid");
    }
  } else {
    return res.status(401).send("No token");
  }
};
