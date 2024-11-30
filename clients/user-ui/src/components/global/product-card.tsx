"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  id: string;
}

const accentColor = {
  pink: "from-pink-300 to-pink-100",
  blue: "from-blue-300 to-blue-100",
  green: "from-green-300 to-green-100",
  purple: "from-purple-300 to-purple-100",
  orange: "from-orange-300 to-orange-100",
};

export function ProductCard({
  name,
  description,
  price,
  imageUrl,
  inStock,
  id,
}: ProductCardProps) {
  const accentColors = ["pink", "blue", "green", "purple", "orange"] as const;
  const randomIndex = Math.floor(Math.random() * accentColors.length);
  const selectedColor = accentColors[randomIndex];
  return (
    <Link href={`/admin/restaurants/store/edit-product/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all bg-white text-black relative">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-16 -left-16 w-32 h-32 bg-gradient-to-br ${accentColor[selectedColor]} rotate-12 opacity-50`}
          ></div>
          <div
            className={`absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-tl ${accentColor[selectedColor]} -rotate-12 opacity-50`}
          ></div>
        </div>
        <div className="p-6 flex justify-between items-center h-full relative">
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-lg mb-2">{name}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold">&#8358; {price.toFixed(2)}</span>
            </div>
          </div>
          <div className="relative w-32 h-32">
            <Image
              src={imageUrl || "/placeholder.svg?height=128&width=128"}
              alt={name}
              fill
              className="object-cover rounded-lg"
            />

            <Button
              size="icon"
              className="absolute right-0 bottom-0 bg-white/10 backdrop-blur-md p-5 rounded-tl-3xl rounded-bl-none rounded-tr-none hover:bg-primary"
              variant="ghost"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add to cart</span>
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
