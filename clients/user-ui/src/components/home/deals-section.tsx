"use client";

import {
  burgerKing,
  chickenRepublic,
  kfc,
  mcDonalds,
  papaJohns,
  sharwarma,
} from "@/assets/images";
import Image, { StaticImageData } from "next/image";

interface RestaurantDeal {
  name: string;
  discount: string;
  image: string;
  type: string;
}

interface FoodCategory {
  name: string;
  image: string;
  count: string;
}

interface Restaurant {
  name: string;
  logo: StaticImageData;
}

export function DealsSection() {
  const deals: RestaurantDeal[] = [
    {
      name: "Chicken Hut",
      discount: "22",
      image:
        "https://img.freepik.com/free-photo/fried-chicken-with-potatoes-table_140725-4666.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid",
      type: "Restaurant",
    },
    {
      name: "La Pâtesserie",
      discount: "5",
      image:
        "https://img.freepik.com/free-photo/spaghetti-carbonara-with-vegetables-table_140725-5475.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid",
      type: "Restaurant",
    },
    {
      name: "Butterbrot",
      discount: "17",
      image:
        "https://img.freepik.com/free-photo/side-view-meat-stew-lamb-stew-with-fried-onion-dried-fruits-with-rice-plate_141793-5013.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid",
      type: "Restaurant",
    },
  ];

  //  traditional;
  //  snacks;
  //  grilledAndBarbecue;
  //  swallowsAndSoups;
  //  continental;
  //  fastFoods;
  //  breakfast;
  //  vegetarianAndHealthy;
  //  drinksAndBeverages;
  //  streetFoods;
  //  seafood;
  //  desserts;
  const categories: FoodCategory[] = [
    {
      name: "Fast food",
      image:
        "https://img.freepik.com/free-photo/front-close-view-delicious-pies-with-meat-filling-inside-wooden-plate-dark-blue-surface-dough-pie-bread-bun-food_140725-52643.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid",
      count: "2,614 options",
    },
    {
      name: "Sea Food",
      image:
        "https://img.freepik.com/free-photo/side-view-fried-shrimps-sauce-with-tomatoes-herbs_141793-4919.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid",
      count: "1,842 options",
    },
    {
      name: "Continental",
      image:
        "https://img.freepik.com/free-photo/side-view-chicken-meatballs-with-greens-ketchup-plate_141793-4839.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid",
      count: "1,539 options",
    },
    {
      name: "Swallows and Soups",
      image:
        "https://img.freepik.com/free-photo/close-up-hand-holding-food_23-2148761572.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid",
      count: "2,614 options",
    },
    {
      name: "Breakfast",
      image:
        "https://img.freepik.com/free-photo/muesli-with-berries-coffee-tray_23-2147678791.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid",
      count: "1,842 options",
    },
    {
      name: "Grilled",
      image:
        "https://img.freepik.com/free-photo/fried-meat-with-lemon-sauce_140725-3636.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid",
      count: "1,539 options",
    },
  ];

  const restaurants: Restaurant[] = [
    { name: "McDonald's", logo: mcDonalds },
    { name: "Papa Johns", logo: papaJohns },
    { name: "KFC West", logo: kfc },
    { name: "Chicken Republic", logo: chickenRepublic },
    { name: "Burger King", logo: burgerKing },
    { name: "Shaurma 1", logo: sharwarma },
  ];

  return (
    <div className="bg-[#4CAF50] pt-32 -mt-32 text-black ">
      <div className="bg-gray-50 rounded-t-[3rem] px-6 py-12">
        {/* Exclusive Deals */}
        <div className="container">
          <div className="flex items-center gap-2 mb-8">
            <h2 className="text-2xl font-bold">Up to -40%</h2>

            <span className="font-semibold text-gray-900">
              <span className="font-rafisqi text-primary tracking-wider">
                {" "}
                Tasty
              </span>{" "}
              exclusive deals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {deals.map((deal, index) => (
              <div key={index} className="group overflow-hidden rounded-xl">
                <div className="relative ">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-0 right-3 bg-white text-black px-2 py-1 pt-3 rounded-b-md text-primary font-medium">
                    -{deal.discount}%
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className="mb-2 bg-secondary rounded-full text-white text-sm flex justify-center items-center">
                      <p>{deal.type}</p>
                    </div>
                    <h3 className="text-lg font-bold text-white drop-shadow-lg">
                      {deal.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Popular Categories */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">
              Popular Categories
              <span className="text-2xl">😋</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="group cursor-pointer hover:shadow-lg transition-shadow  bg-gray-100 rounded-xl"
                >
                  <div className="p-4 text-center">
                    <div className="w-24 h-24 mx-auto mb-3">
                      <Image
                        src={category.image}
                        alt={category.name}
                        height={0}
                        width={0}
                        sizes="100vw"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Restaurants */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Popular Restaurants</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {restaurants.map((restaurant, index) => (
                <div
                  key={index}
                  className="group cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center gap-2 h-fit"
                >
                  <div className="w-[266px] h-[266px]">
                    <Image
                      src={restaurant.logo.src}
                      alt={restaurant.name}
                      height={0}
                      width={0}
                      sizes="100vw"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
