"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { REGISTER_RESTAURANT } from "@/graphql/actions/restaurant-auth.action";
import { useMutation } from "@apollo/client";
import { useRegisterstore } from "@/store/auth/register";

const foodCategories = [
  "traditional",
  "snacks",
  "grilledAndBarbecue",
  "swallowsAndSoups",
  "continental",
  "fastFoods",
  "breakfast",
  "vegetarianAndHealthy",
  "drinksAndBeverages",
  "streetFoods",
  "seafood",
  "desserts",
] as const;

const restaurantFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Must be a valid email" }),
  address: z.string().min(1, { message: "Address is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  phone: z.string().min(1, { message: "Phone Number is required" }),
  openHours: z.string().min(1, { message: "Working Hours is required" }),
  description: z.string().optional(),
  website: z.string().optional(),
  categories: z
    .array(
      z.object({
        type: z.enum(foodCategories),
        description: z.string().optional(),
      })
    )
    .min(1, { message: "At least one category is required" }),
});

type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;

interface Props {
  setAuthState: React.Dispatch<React.SetStateAction<"register" | "verifying">>;
}

export function RestaurantSignupForm({ setAuthState }: Props) {
  const [step, setStep] = useState(1);
  const [registerRestaurantMutation, { loading }] =
    useMutation(REGISTER_RESTAURANT);
  const { setActivationToken } = useRegisterstore();
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      phone: "",
      openHours: "",
      description: "",
      website: "",
      categories: [{ type: "traditional", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  async function onSubmit(data: RestaurantFormValues) {
    try {
      const res = await registerRestaurantMutation({
        variables: {
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          address: data.address,
          openHours: data.openHours,
          description: data.description,
          website: data.website,
          categories: data.categories,
        },
      });

      setActivationToken(res?.data?.RegisterResponse?.activation_token);

      toast.success("Check your email for your activation code");
      toast.success("Please do not refresh the page");
      setAuthState("verifying");
      form.reset();
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-0">
          <CardHeader>
            <CardTitle>Restaurant Sign Up - Step {step} of 3</CardTitle>
            <CardDescription>
              We will review your details and send you an activation code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restaurant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter restaurant name" {...field} />
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
                        <Input
                          type="email"
                          placeholder="Enter email"
                          {...field}
                        />
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
                        <Input
                          type="password"
                          placeholder="Enter password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="openHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Hours</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Mon-Fri: 9AM-10PM"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter restaurant description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter website URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormLabel>Categories</FormLabel>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-end space-x-2 mt-2"
                    >
                      <FormField
                        control={form.control}
                        name={`categories.${index}.type`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-black">
                                  {foodCategories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`categories.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Category description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      append({ type: "traditional", description: "" })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                Register Restaurant
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
