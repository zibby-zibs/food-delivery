import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import RouteHeader from "./_components/route-headers";

type Props = {
  children: React.ReactNode;
};

const RestaurantLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <RouteHeader />
        <div className="container">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default RestaurantLayout;
