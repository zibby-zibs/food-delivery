"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import useUser from "@/hooks/useUser";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_MENU_ITEM,
  GET_MENU_BY_CATEGORY,
} from "@/graphql/actions/restaurant.actions";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  price: z.string().min(1, {
    message: "Price is required. If it's free, use 0.",
  }),
  imageUrl: z.string().url().optional(),
  inStock: z.boolean(),
  categories: z.array(z.string()),
  newCategory: z.string().optional(),
});

export function AddProductForm() {
  const { user } = useUser();
  const [categories, setCategories] = useState<string[]>([]);
  const [createMenuMutation, { loading }] = useMutation(CREATE_MENU_ITEM);
  const { data: menuItemCategories } = useQuery(GET_MENU_BY_CATEGORY, {
    variables: { id: user?.id },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      inStock: true,
      categories: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      price: parseFloat(values.price),
      categoryNames: values.categories.map((name) => name),
      restaurantId: user?.id,
    };

    try {
      await createMenuMutation({
        variables: data,
      });
      toast.success("Your new product has been successfully added.");
      form.reset();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  }

  const addNewCategory = () => {
    const newCategory = form.getValues("newCategory");
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      form.setValue("categories", [
        ...form.getValues("categories"),
        newCategory,
      ]);
      form.setValue("newCategory", "");
    }
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
    form.setValue(
      "categories",
      form.getValues("categories").filter((c) => c !== category)
    );
  };

  const handleImageUpload = (url: string) => {
    form.setValue("imageUrl", url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Margherita Pizza" {...field} />
              </FormControl>
              <FormDescription>The name of your menu item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A classic pizza with tomato sauce, mozzarella, and basil."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe your menu item. This helps customers know what to
                expect.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="9.99" {...field} />
              </FormControl>
              <FormDescription>
                Set the price for this menu item.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUpload
                  onUploadComplete={handleImageUpload}
                  folder="/tasty/products"
                  isAvatar={false}
                />
              </FormControl>
              <FormDescription>
                Provide an image of this menu item.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inStock"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">In Stock</FormLabel>
                <FormDescription>
                  Is this item currently available?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    if (!categories.includes(value)) {
                      setCategories([...categories, value]);
                      field.onChange([...field.value, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuItemCategories?.getRestaurantMenu?.map(
                      (category: any) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-0 text-base"
                      onClick={() => removeCategory(category)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <FormDescription>
                Select categories for this menu item.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Category</FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input placeholder="Enter new category" {...field} />
                </FormControl>
                <Button type="button" onClick={addNewCategory}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription>
                Create a new category if needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          Add Product
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
