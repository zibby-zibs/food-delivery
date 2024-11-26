"use server";
import { prisma } from "../lib/prismaDb";

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
