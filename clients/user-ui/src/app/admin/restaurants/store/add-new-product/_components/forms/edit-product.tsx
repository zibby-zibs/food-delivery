"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";
import { MenuItem, MenuItemCategory } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@apollo/client";
import {
  DELETE_MENU_ITEM,
  EDIT_MENU_ITEM,
} from "@/graphql/actions/restaurant.actions";

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  imageUrl: z.string().url().optional(),
  inStock: z.boolean(),
  category: z.string(),
  categories: z.array(z.string()),
  newCategory: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface EditProductFormProps {
  productId: string;
  data: MenuItem & { categories: MenuItemCategory[] };
}

export function EditProductForm({ productId, data }: EditProductFormProps) {
  const [categories, setCategories] = useState<string[]>(
    data ? data?.categories?.map((cat) => cat.name) : []
  );
  const [editMenuMutation, { loading }] = useMutation(EDIT_MENU_ITEM);
  const [DELETEMenuMutation, { loading: deleteLoading }] =
    useMutation(DELETE_MENU_ITEM);
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: data ? data.name : "",
      description:
        data && data.description !== null ? data.description : undefined,
      price: data ? data.price : 0,
      imageUrl: data && data.imageUrl ? data.imageUrl : undefined,
      inStock: data ? data.inStock : true,
      categories: data ? data?.categories?.map((cat) => cat.name) : [],
    },
  });

  async function onSubmit(data: ProductFormValues) {
    try {
      await editMenuMutation({
        variables: {
          id: productId,
          input: {
            name: data.name,
            description: data.description,
            price: data.price,
            imageUrl: data.imageUrl,
            inStock: data.inStock,
            category: data.category,
            categories: data.categories,
          },
        },
      });

      toast.success("Your product has been successfully updated.");
      router.push("/admin//restaurants/store/all-products");
    } catch (error) {
      console.error("Failed to update product", error);
      toast.error("Failed to update product. Please try again.");
    }
  }

  const handleImageUpload = (url: string) => {
    form.setValue("imageUrl", url);
  };

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

  const deleteItem = async () => {
    try {
      await DELETEMenuMutation({
        variables: {
          id: productId,
        },
      });

      toast.success("Your product has been successfully deleted.");
      router.push("/admin/restaurants/store/all-products");
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormDescription>The name of your product.</FormDescription>
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
                  <Textarea placeholder="Describe your product" {...field} />
                </FormControl>
                <FormDescription>
                  A brief description of your product.
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
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="9.99"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Set the price for this product.
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
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    onUploadComplete={handleImageUpload}
                    folder="tasty/products"
                  />
                </FormControl>
                <FormDescription>
                  Upload an image for this product.
                </FormDescription>
                {field.value && (
                  <div className="mt-2">
                    <img
                      src={field.value}
                      alt="Product"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                )}
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
                    Is this product currently available?
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

          <FormField
            control={form.control}
            name="newCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add a new category to menu item.</FormLabel>
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
          <div className="flex gap-2 items-center">
            <Button type="submit" disabled={loading}>
              Update Product
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            </Button>
            <Button
              type="button"
              onClick={deleteItem}
              disabled={loading}
              variant={"destructive"}
              className="bg-red-500 hover:bg-red-400 text-white"
            >
              Delete Product
              {deleteLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
