import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authheader = req.headers.authorization || req.headers.Authorization;
  if (!authheader?.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  const token = authheader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = decoded.userInfo.username;
    req.role = decoded.userInfo.role;
    next();
  });
};
