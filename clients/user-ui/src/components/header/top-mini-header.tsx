import React from "react";
import { Button } from "../ui/button";
import { LucideShoppingBasket } from "lucide-react";

type Props = {};

const TopMiniHeader = (props: Props) => {
  return (
    <div className="bg-white pb-5">
      <header className="w-full bg-gray-100 flex justify-between items-center pl-4 text-black text-sm container rounded-b-lg border-b border-gray-200">
        <nav>
          <p>
            🌟 Get 5% Off your first order,{" "}
            <span className="text-primary font-semibold"> Promo: ORDER5</span>
          </p>
        </nav>
        <nav className="flex justify-center items-center gap-2">
          5, somewhere in Bodija
          <Button variant={"link"}>Change Address</Button>
        </nav>

        <nav className="bg-secondary flex items-center justify-center font-medium rounded-b-lg text-white">
          <div className="border-r px-2 py-3 border-gray-100">
            <LucideShoppingBasket />
          </div>
          <p className="border-r px-2 py-3 border-gray-100">23 items</p>
          <p className=" px-2 py-3 border-gray-100">30,000 NGN</p>
        </nav>
      </header>
    </div>
  );
};

export default TopMiniHeader;
