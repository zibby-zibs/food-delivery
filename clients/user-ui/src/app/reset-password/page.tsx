import React from "react";
import ResetYourPassword from "./_components/reset-your-password";

type Props = {
  searchParams: Promise<{ [key: string]: string }>;
};

const page = async ({ searchParams }: Props) => {
  const activationToken = (await searchParams)?.activationToken;

  return <ResetYourPassword activationToken={activationToken} />;
};

export default page;
