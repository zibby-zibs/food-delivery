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
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/graphql/actions/login.action";
import { useUserStore } from "@/store/auth/user";
import Cookies from "js-cookie";
import { toast } from "sonner";

type Props = {
  setAuthState: React.Dispatch<
    SetStateAction<"login" | "signup" | "verifying" | "forgot-password">
  >;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginSchema = z.infer<typeof formSchema>;

const Login = ({ setAuthState, setOpen }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginUserQuery, { loading }] = useMutation(LOGIN_USER);

  const { setUser } = useUserStore();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    console.log(values);

    try {
      const res = await loginUserQuery({
        variables: values,
      });
      setUser(res.data.login.user);
      Cookies.set("refresh_token", res.data.login.refreshToken);
      Cookies.set("access_token", res.data.login.accessToken);
      toast.success("Welcome back");
      setOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message ?? "Something went wrong");
    }
    form.reset();
  };
  return (
    <div>
      <h1 className="font-jost text-center text-lg">
        Login with{" "}
        <span className="font-kholic font-semibold text-2xl text-primary">
          Tasty
        </span>
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      {...field}
                    />
                    <div className="absolute top-0 bottom-0 my-auto right-1 h-fit">
                      {showPassword ? (
                        <Eye
                          className="cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <EyeOff
                          className="cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </div>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <div className="flex justify-end w-full">
              <Button
                variant={"link"}
                onClick={() => setAuthState("forgot-password")}
                className="font-light text-right text-white w-fit"
              >
                Forgot your password?
              </Button>
            </div>
            <Button type="submit" className="w-full rounded-full mt-2">
              Submit {loading && <Loader2 className="animate-spin" />}
            </Button>
          </div>

          <div className="text-center text-sm mt-5">
            <div className="relative">
              <h5 className="bg-background relative z-10 w-fit mx-auto px-2">
                Or join with
              </h5>
              <div className="w-full h-[1px] bg-gray-300 absolute top-0 bottom-0 my-auto"></div>
            </div>

            <div className="flex items-center justify-center my-3 gap-2">
              <FcGoogle size={30} className="cursor-pointer " />
              <AiFillGithub size={30} className="cursor-pointer " />
            </div>

            <div className="flex gap-1 justify-center items-center text-white">
              <h5>Don&apos;t have an account? </h5>
              <p
                onClick={() => setAuthState("signup")}
                className="text-primary font-medium cursor-pointer"
              >
                Sign Up
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
