"use server";
import { cookies } from "next/headers";
import { prisma } from "../lib/prismaDb";
import { verifyToken } from "@/utils/verifyToken";
import { Avatars, Restaurant, User } from "@prisma/client";

const generaterandomPassword = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUV12345678!@#$%^&*()_+-=";
  const length = 8;

  const uniqueCharacters = [...Array.from(new Set(characters))];

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * uniqueCharacters.length);
    password += uniqueCharacters[randomIndex];
  }

  return password;
};

export const registerUser = async (user: any) => {
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (userExists) return userExists;
    const data = await prisma?.user.create({
      data: {
        name: user?.name,
        email: user.email,
        password: generaterandomPassword(),
        role: "User",
      },
    });

    return data;
  } catch (error) {
    console.log("ERROR_GOOGLE_SIGN_UP", error);
  }
};

export async function getCurrentUser(): Promise<
  (User & { avatar: Avatars | null }) | Restaurant | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = await verifyToken(token);

    if (decoded.type === "User") {
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        include: {
          avatar: true,
        },
      });

      return user;
    }

    if (decoded.type === "restaurant") {
      const user = await prisma.restaurant.findUnique({
        where: {
          id: decoded.id,
        },
      });

      return user;
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  return null;
}
