import jwt, { SignOptions } from "jsonwebtoken";

export default function generateToken(id: number, role: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

 const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";

  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign({ id, role }, secret, options);
}
