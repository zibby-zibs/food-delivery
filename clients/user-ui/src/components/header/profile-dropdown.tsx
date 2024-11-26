"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LucideCircleUserRound, UserCircleIcon } from "lucide-react";
import AuthScreen from "../auth";
import useUser from "@/hooks/useUser";
import Cookie from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { registerUser } from "@/actions/auth";

const ProfileDropdown = () => {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const { loading, user } = useUser();
  const { data } = useSession();

  useEffect(() => {
    if (!loading) setSignedIn(!!user);

    if (data?.user) {
      setSignedIn(true);
      addUser(user);
    }
  }, [loading, user, data]);

  const handleLogout = () => {
    Cookie.remove("access_token");
    Cookie.remove("refresh_token");

    toast.success("Log out successful");
    router.refresh();
  };

  const addUser = async (user: any) => {
    try {
      await registerUser(user);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center gap-4">
      {signedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar asChild>
              <div>
                <AvatarImage
                  src={
                    data?.user
                      ? data?.user?.image || ""
                      : user?.user?.avatar?.url || ""
                  }
                />
                <AvatarFallback className="text-white border-2 border-primary">
                  {signedIn ? (
                    <div>{user?.user?.name?.charAt(0)}</div>
                  ) : (
                    <div>
                      <LucideCircleUserRound />
                    </div>
                  )}
                </AvatarFallback>
              </div>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="space-y-2 bg-white/30 backdrop-blur-sm border-0">
            <DropdownMenuItem className="flex flex-col gap-2">
              <p className="font-semibold">Signed In as </p>
              <p className="font-semibold">
                {data?.user ? data?.user?.email : user?.user?.email}
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem>My profile</DropdownMenuItem>
            <DropdownMenuItem className="">All Orders</DropdownMenuItem>
            <DropdownMenuItem>Apply for sellers account</DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-red-500 bg-red-500  text-white"
              onClick={() => signOut() || handleLogout()}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <UserCircleIcon
          onClick={() => setOpen(!open)}
          className="cursor-pointer"
        />
      )}

      <AuthScreen setOpen={setOpen} open={open} />
    </div>
  );
};

export default ProfileDropdown;
