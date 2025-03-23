import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '10d',
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // <--- FIXED
    sameSite: "lax", // <--- FIXED
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  });

  return token;
};
