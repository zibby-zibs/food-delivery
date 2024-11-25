"use client";

import React, { SetStateAction, useState } from "react";
import Login from "./login";
import Signup from "./sign-up";
import Verify from "./verify";
import { Dialog, DialogContent } from "../ui/dialog";
import ForgotPassword from "./forgot-password";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};
const AuthScreen = ({ setOpen, open }: Props) => {
  const [authState, setAuthState] = useState<
    "login" | "signup" | "verifying" | "forgot-password"
  >("login");
  return (
    // <div className="w-full fixed inset-0 h-screen flex justify-center items-center top-0 left-0 bg-black/20">
    //   <section className="w-[80%] max-w-lg h-full max-h-[600px] bg-white bg-opacity-60 backdrop-blur-lg backdrop-filter rounded-[20px] shadow-sm p-5 md:p-7">

    //   </section>
    //   </div>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showX={false}>
        {authState === "login" && (
          <Login setAuthState={setAuthState} setOpen={setOpen} />
        )}
        {authState === "signup" && <Signup setAuthState={setAuthState} />}
        {authState === "verifying" && <Verify setAuthState={setAuthState} />}
        {authState === "forgot-password" && (
          <ForgotPassword setAuthState={setAuthState} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthScreen;
