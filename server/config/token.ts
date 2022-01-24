import { sign } from "jsonwebtoken";
require("dotenv/config");

const createAccessToken = (user: any) => {
  return sign({ ...user }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (user: any) => {
  return sign({ ...user }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

export { createRefreshToken, createAccessToken };
