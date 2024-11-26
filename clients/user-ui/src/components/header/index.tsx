"use client";

import React, { useEffect, useState, useRef } from "react";
import NavItems from "./nav-items";
import ProfileDropdown from "./profile-dropdown";

const Header = () => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current || currentScrollY < 80) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`w-full relative z-40 h-[80px] flex items-center justify-center transition-transform duration-300 ${
        visible
          ? "translate-y-0 sticky z-40 top-0 bg-background"
          : "-translate-y-full"
      }`}
    >
      <section className="container flex items-center justify-between w-full">
        <div className="font-rafisqi text-3xl text-primary">Tasty</div>
        <NavItems />
        <ProfileDropdown />
      </section>
    </header>
  );
};

export default Header;
