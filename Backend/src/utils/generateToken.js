import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("ck_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    domain: isProd ? ".codingkul.in" : undefined, // share cookie across *.codingkul.in subdomains
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
