"use client";

import React, { SetStateAction, useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { useRegisterstore } from "@/store/auth/register";
import { Loader2 } from "lucide-react";
import { useRestaurantStore } from "@/store/auth/user";
import OTPInput from "@/components/global/otp-input";
import { Button } from "@/components/ui/button";
import { VERIFY_RESTAURANT } from "@/graphql/actions/restaurant-auth.action";
import Cookies from "js-cookie";

type Props = {
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

const Verify = ({ setOpen }: Props) => {
  const [code, setCode] = useState("");
  const [verifyRestaurantMutation, { loading }] =
    useMutation(VERIFY_RESTAURANT);
  const { activation_token } = useRegisterstore();
  const { setRestaurant } = useRestaurantStore();

  const sendCode = async () => {
    try {
      const data = {
        activationToken: activation_token,
        activationCode: code,
      };
      const res = await verifyRestaurantMutation({
        variables: data,
      });

      Cookies.set("refresh_token", res.data?.activateRestaurant?.refreshToken);
      Cookies.set("access_token", res.data?.activateRestaurant?.accessToken);
      setRestaurant(res.data?.activateRestaurant?.user);

      toast.success("Account activated successfully, Please Login");
      setOpen(false);
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
