import React from "react";
import { RestaurantSignupForm } from "../admin/restaurants/store/add-new-product/_components/forms/register-restaurant";
import Image from "next/image";

type Props = {};

const page = (props: Props) => {
  return (
    <main className="flex h-full">
      <RestaurantSignupForm />

      <div>
        <Image
          src="https://img.freepik.com/free-photo/restaurant-hall-with-red-brick-walls-wooden-tables-pipes-ceiling_140725-8504.jpg?uid=R38132337&ga=GA1.1.452279408.1726766691&semt=ais_hybrid"
          alt="restaurant"
          width={500}
          height={500}
        />
      </div>
    </main>
  );
};

export default page;
