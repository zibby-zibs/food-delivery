import { getCurrentUser } from "@/actions/auth";
import { GET_MENU_BY_CATEGORY } from "@/graphql/actions/restaurant.actions";

import React from "react";
import { CategoryProducts } from "../../_components/category-component";
import { query } from "@/graphql/gql";

const page = async () => {
  const user = await getCurrentUser();
  const { data, loading } = await query({
    query: GET_MENU_BY_CATEGORY,
    variables: { id: user?.id },
  });

  return (
    <main>
      <section className="pb-10">
        <CategoryProducts category={data?.getRestaurantMenu} />
      </section>
    </main>
  );
};

export default page;
