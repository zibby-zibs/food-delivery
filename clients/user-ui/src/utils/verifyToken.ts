"use server";

import { Role } from "@prisma/client";
import * as jose from "jose";

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET),
};

export async function verifyToken(token: string) {
  try {
    const decoded = await jose.jwtVerify(token, jwtConfig.secret);

    const payload = decoded.payload as { id: string; type: Role };
    return payload;
  } catch (error) {
    console.log("ERROR_CLIENT_JWT", error);
    throw new Error("Invalid token");
  }
}
