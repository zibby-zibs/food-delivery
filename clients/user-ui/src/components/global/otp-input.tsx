import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import React from "react";

type Props = {
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
};

const OTPInput = ({ otp, setOtp }: Props) => {
  return (
    <InputOTP maxLength={4} value={otp} onChange={(value) => setOtp(value)}>
      <InputOTPGroup className="">
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup className="">
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  );
};

export default OTPInput;
