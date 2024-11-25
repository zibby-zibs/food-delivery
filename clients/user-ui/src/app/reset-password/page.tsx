import React from "react";
import ResetYourPassword from "./_components/reset-your-password";

type Props = {
  searchParams: {
    activationToken: string;
  };
};

const page = ({ searchParams }: Props) => {
  const activationToken = searchParams.activationToken;

  return <ResetYourPassword activationToken={activationToken} />;
};

export default page;
