"use client";

import React, { SetStateAction, useState } from "react";
import OTPInput from "../global/otp-input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { VERIFY_USER } from "@/graphql/actions/activationCode.action";
import { useRegisterstore } from "@/store/auth/register";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/store/auth/user";

type Props = {
  setAuthState: React.Dispatch<
    SetStateAction<"login" | "signup" | "verifying" | "forgot-password">
  >;
};

const Verify = ({ setAuthState }: Props) => {
  const [code, setCode] = useState("");
  const [verifyUserMutation, { loading }] = useMutation(VERIFY_USER);
  const { activation_token } = useRegisterstore();
  const { setUser } = useUserStore();

  const sendCode = async () => {
    try {
      const data = {
        activationToken: activation_token,
        activationCode: code,
      };
      const res = await verifyUserMutation({
        variables: data,
      });

      setUser(res.data?.activateUser?.user);
      toast.success("Account activated successfully");
      setAuthState("login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="">
      <h1 className="font-jost text-center text-lg">Verify Your Account</h1>

      <div className="w-fit mx-auto mt-8">
        <OTPInput otp={code} setOtp={setCode} />
      </div>

      <div className="mt-6">
        <Button
          onClick={sendCode}
          type="submit"
          className="w-full rounded-full mt-2"
        >
          Submit {loading && <Loader2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
};

export default Verify;
