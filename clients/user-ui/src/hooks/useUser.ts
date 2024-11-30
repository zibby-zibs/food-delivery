"use client";

import { getCurrentUser } from "@/actions/auth";
import { Avatars, Restaurant, Role, User } from "@prisma/client";
import { useEffect, useState } from "react";

const useUser = () => {
  const [user, setUser] = useState<
    (User & { avatar: Avatars | null }) | Restaurant | null
  >(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const res = await getCurrentUser();

      if (res) {
        setUser(res);
        setRole(res.role);
      }
    };

    getUser();
  }, []);

  const isUser = (user: any): user is User & { avatar: Avatars | null } => {
    return role === "User" && (user as User).email !== undefined;
  };

  const isRestaurant = (user: any): user is Restaurant => {
    return role === "restaurant" && (user as Restaurant).name !== undefined;
  };

  return { user, role, isUser, isRestaurant };
};

export default useUser;
