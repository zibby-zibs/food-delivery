"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { RestaurantSignupForm } from "@/app/admin/restaurants/store/add-new-product/_components/forms/register-restaurant";
import Verify from "@/app/admin/restaurants/_components/verifying-code";
import useUser from "@/hooks/useUser";

export default function Hero() {
  const [openRestaurantRegister, setOpenRestaurantRegister] = useState(false);
  const [authState, setAuthState] = useState<"register" | "verifying">(
    "register"
  );
  const { isRestaurant, user } = useUser();
  return (
    <div className="relative min-h-[calc(100dvh-80px)] bg-[#1E1B4B] overflow-hidden ">
      <div className="absolute inset-0 w-full h-full">
        <div className="w-full h-full">
          <div className="absolute inset-0 h-full w-full bg-[#1E1B4B]/60 backdrop-blur-[3px] backdrop-filter"></div>
          <img
            src="https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid"
            alt=""
            className="object-cover w-full h-full "
          />
        </div>
      </div>
      {/* Orange Circle Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF8A00] rounded-full -translate-y-1/4 translate-x-1/4" />

      {/* Content */}
      <div className="relative z-10 pt-32 container flex lg:justify-between gap-2 items-center">
        {/* <h1 className="text-6xl font-bold text-white mb-4">
          Italian
          <br />
          Cuisine
          </h1> */}

        <article>
          <span className="inline-block px-4 py-1 mb-4 text-sm bg-[#FF8A00]/20 text-[#FF8A00] rounded-full">
            Featured
          </span>
          <p className="text-gray-200 mb-8 max-w-[520px] text-2xl lg:text-6xl font-semibold">
            Healthy and delicious meals delivered straight to your door
          </p>
          <p className="max-w-lg -mt-3 pb-7">
            We offer healthy meals, drinks from a wide range of vendors. You do
            not have to stress yourself about your meals, let us sort it out for
            you.
          </p>

          <div className="flex gap-4">
            <Button className="px-6 py-3 bg-[#FF8A00] text-white rounded-full hover:bg-[#FF8A00]/90 transition-colors">
              Order now
            </Button>

            {!user || (user && !isRestaurant(user)) ? (
              <Button
                onClick={() => setOpenRestaurantRegister(true)}
                className="px-6 py-3 bg-[#4CAF50] text-white rounded-full hover:bg-[#4CAF50]/90 transition-colors"
              >
                Register Restaurant
              </Button>
            ) : null}
          </div>
        </article>

        {/* Main Food Image */}
        <div className=" w-[600px] h-[600px] rounded-full bg-white p-3 hidden lg:block">
          <img
            src="https://img.freepik.com/free-photo/tortilla-wraps-with-meat-fresh-vegetables_2829-9337.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid"
            alt="Italian Pasta"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {/* Curved Shape with Grid of Food Items */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden">
          <svg
            className="absolute bottom-0 w-[200%] h-full"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 300 28"
            preserveAspectRatio="none"
          >
            <defs>
              <path
                id="wave1"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="wave1">
              <use
                xlinkHref="#wave1"
                x="0"
                y="0"
                fill="rgba(76, 175, 80, 0.3)"
              />
              <use
                xlinkHref="#wave1"
                x="100%"
                y="0"
                fill="rgba(76, 175, 80, 0.3)"
              />
            </g>
            <g className="wave2">
              <use
                xlinkHref="#wave1"
                x="0"
                y="2"
                fill="rgba(76, 175, 80, 0.5)"
              />
              <use
                xlinkHref="#wave1"
                x="100%"
                y="2"
                fill="rgba(76, 175, 80, 0.5)"
              />
            </g>
            <g className="wave3">
              <use xlinkHref="#wave1" x="0" y="4" fill="#4CAF50" />
              <use xlinkHref="#wave1" x="100%" y="4" fill="#4CAF50" />
            </g>
          </svg>
        </div>

        {/* Grid of Food Items */}
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className=" bg-primary/40 backdrop-blur-md rounded-2xl p-4">
            <p className="text-3xl lg:text-6xl">EXPLORE</p>
          </div>
        </div> */}
      </div>

      <Dialog
        open={openRestaurantRegister}
        onOpenChange={setOpenRestaurantRegister}
      >
        <DialogContent>
          {authState === "register" && (
            <RestaurantSignupForm setAuthState={setAuthState} />
          )}
          {authState === "verifying" && (
            <Verify setOpen={setOpenRestaurantRegister} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
