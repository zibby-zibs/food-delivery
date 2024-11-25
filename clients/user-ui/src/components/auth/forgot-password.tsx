"use client";

import React, { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormMessage,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/graphql/actions/login.action";
import { useUserStore } from "@/store/auth/user";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { SEND_FORGOT_PASSWORD_LINK } from "@/graphql/actions/forgot-password.action";
import { useRouter } from "next/navigation";

type Props = {
  setAuthState: React.Dispatch<
    SetStateAction<"login" | "signup" | "verifying" | "forgot-password">
  >;
};

const formSchema = z.object({
  email: z.string().email(),
});

type LoginSchema = z.infer<typeof formSchema>;

const ForgotPassword = ({ setAuthState }: Props) => {
  const router = useRouter();
  const [loginUserQuery, { loading }] = useMutation(SEND_FORGOT_PASSWORD_LINK);
  const { user } = useUserStore();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email ?? "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    console.log(values);

    try {
      const res = await loginUserQuery({
        variables: values,
      });

      toast.success("Check your mail for the reset link");
      router.push("/reset-password");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message ?? "Something went wrong");
    }
    form.reset();
  };

  return (
    <div>
      <h1 className="font-jost text-center text-lg">Forgot your password?</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button type="submit" className="w-full rounded-full mt-2">
              Submit {loading && <Loader2 className="animate-spin" />}
            </Button>
          </div>

          <div className="text-center text-sm mt-5">
            <div className="flex gap-1 justify-center items-center text-white">
              <h5>Or go back </h5>
              <p
                onClick={() => setAuthState("login")}
                className="text-primary font-medium cursor-pointer"
              >
                Login
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;
