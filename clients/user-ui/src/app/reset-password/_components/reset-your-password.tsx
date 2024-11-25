"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
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
} from "../../../components/ui/form";
import { RESET_PASSWORD } from "@/graphql/actions/forgot-password.action";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/auth/user";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  activationToken: string;
};

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password has to be at least 8 characters"),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords need to match",
      path: ["confirmPassword"],
    }
  );

type resetSchema = z.infer<typeof formSchema>;

const ResetYourPassword = ({ activationToken }: Props) => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [resetPasswordMutation, { loading }] = useMutation(RESET_PASSWORD);
  const form = useForm<resetSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: resetSchema) => {
    console.log(values);

    try {
      const res = await resetPasswordMutation({
        variables: {
          password: values.password,
          activationToken,
        },
      });
      setUser(res.data.resetPassword.user);
      Cookies.set("refresh_token", res.data.resetPassword.refreshToken);
      Cookies.set("access_token", res.data.resetPassword.accessToken);
      toast.success("Password updated");
      router.push("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message ?? "Something went wrong");
    }
    form.reset();
  };
  return (
    <Dialog open>
      <DialogHeader>
        <DialogTitle className="hidden">..</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div>
          <h1 className="text-center pb-8">Reset your password</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={confirmShowPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...field}
                        />
                        <div className="absolute top-0 bottom-0 my-auto right-1 h-fit">
                          {confirmShowPassword ? (
                            <Eye
                              className="cursor-pointer"
                              onClick={() =>
                                setConfirmShowPassword(!confirmShowPassword)
                              }
                            />
                          ) : (
                            <EyeOff
                              className="cursor-pointer"
                              onClick={() =>
                                setConfirmShowPassword(!confirmShowPassword)
                              }
                            />
                          )}
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full mt-2"
              >
                Submit {loading && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResetYourPassword;
