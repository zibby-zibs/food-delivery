import React from "react";
import NavItems from "./nav-items";
import ProfileDropdown from "./profile-dropdown";

const Header = () => {
  return (
    <header className="w-full h-[80px] flex items-center justify-center">
      <section className="container flex items-center justify-between w-full">
        <div className=" font-kholic text-3xl text-primary">Tasty</div>
        <NavItems />

        <ProfileDropdown />
      </section>
    </header>
  );
};

export default Header;
