"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  folder: string;
  isAvatar?: boolean;
  className?: string;
}

export function ImageUpload({
  onUploadComplete,
  folder = "tasty/products",
  isAvatar = false,
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );
    formData.append("folder", folder);

    try {
      // Make a POST request to Cloudinary's upload API
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUploadComplete(data.secure_url);
      toast.success("Your image has been successfully uploaded.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("There was an error uploading your image. Please try again.");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUploadComplete("");
  };

  return (
    <div className={`grid w-full max-w-sm items-center gap-1.5 ${className}`}>
      <Label htmlFor="picture">{isAvatar ? "Profile Picture" : "Image"}</Label>
      {preview ? (
        <div className={`relative ${isAvatar ? "w-32 h-32" : "w-full h-64"}`}>
          <Image
            src={preview}
            alt="Uploaded image preview"
            fill
            className={`object-cover ${
              isAvatar ? "rounded-full" : "rounded-md"
            }`}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-0 right-0 rounded-full"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`flex items-center justify-center border-2 border-dashed border-gray-300 ${
            isAvatar ? "rounded-full w-32 h-32" : "rounded-lg w-full h-64"
          } ${
            isUploading ? "bg-gray-100" : "bg-white hover:bg-gray-50"
          } transition-colors duration-200 ease-in-out cursor-pointer`}
          onClick={() => document.getElementById("picture")?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click to upload an image
              </p>
            </div>
          )}
        </div>
      )}
      <Input
        id="picture"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
        className="hidden"
      />
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Uploading...
        </div>
      )}
    </div>
  );
}
