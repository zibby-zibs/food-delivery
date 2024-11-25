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
import { REGISTER_USER } from "@/graphql/actions/register.action";
import { toast } from "sonner";
import { useRegisterstore } from "@/store/auth/register";

type Props = {
  setAuthState: React.Dispatch<
    SetStateAction<"login" | "signup" | "verifying" | "forgot-password">
  >;
};

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone_number: z.number().min(11, { message: "Enter a valid phone number" }),
});

type SignupSchema = z.infer<typeof formSchema>;

const Signup = ({ setAuthState }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const { setActivationToken } = useRegisterstore();
  const form = useForm<SignupSchema>({
    resolver: zodResolver(formSchema),
  });

  const [registerUserMutation, { loading }] = useMutation(REGISTER_USER);
  const onSubmit = async (data: SignupSchema) => {
    const values = {
      ...data,
      phone_number: Number(data.phone_number),
    };
    try {
      const res = await registerUserMutation({
        variables: values,
      });

      setActivationToken(res?.data?.register?.activation_token);

      toast.success("Check your email for your activation code");
      toast.success("Please do not refresh the page");
      setAuthState("verifying");
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
    form.reset();
  };
  return (
    <div>
      <h1 className="font-jost text-center text-lg">
        Signup with{" "}
        <span className="font-kholic font-semibold text-2xl text-primary">
          Tasty
        </span>
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="081..."
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <p className="font-light text-right text-black">
              Forgot your password?
            </p>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full mt-2"
            >
              Submit {loading && <Loader2 className="animate-spin" />}
            </Button>
          </div>

          <div className="text-center text-sm">
            <h5>Or join with</h5>

            <div className="flex items-center justify-center my-3 gap-2">
              <FcGoogle size={30} className="cursor-pointer " />
              <AiFillGithub size={30} className="cursor-pointer " />
            </div>

            <div className="flex gap-1 justify-center items-center text-white">
              <h5>Have an account? </h5>
              <p
                onClick={() => setAuthState("login")}
                className="text-primary cursor-pointer underline font-medium"
              >
                Sign In
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Signup;
