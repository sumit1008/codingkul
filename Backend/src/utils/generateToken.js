import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("ck_token", token, {
    httpOnly: true,
    secure: isProd,                    // true on Railway (HTTPS)
    sameSite: isProd ? "none" : "lax", // "none" required for cross-domain (Vercel → Railway)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
