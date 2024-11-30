"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

const RouteHeader = () => {
  const pathname = usePathname();

  const routes = pathname.split("/").filter((route) => route !== "");

  console.log({ routes });
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {routes.map((route, index) => (
              <div key={index} className="flex gap-2 items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={
                      route !== "admin"
                        ? `/admin/${route}`
                        : "/admin/restaurants"
                    }
                    className={
                      index === routes.length - 1
                        ? "text-primary font-semibold hover:text-primary"
                        : "hover:text-primary"
                    }
                  >
                    {route}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator
                  className={cn(
                    "mt-[2px]",
                    index === routes.length - 1 ? "hidden" : "hidden md:block"
                  )}
                />
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
    </div>
  );
};

export default RouteHeader;
