import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type Props = {
  activeItem?: number;
};

const navItems = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "About Us",
    url: "/about",
  },
  {
    title: "Restaurants",
    url: "/restaurants",
  },
  {
    title: "Popular Foods",
    url: "/foods",
  },
  {
    title: "Contact us",
    url: "/contact",
  },
];
const NavItems = ({ activeItem = 0 }: Props) => {
  return (
    <div>
      {navItems.map((item, index) => (
        <Link
          key={item.title}
          href={item.url}
          className={cn(
            "px-5 text-lg font-Jost font-medium hover:text-secondary",
            activeItem === index && "text-secondary"
          )}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default NavItems;
