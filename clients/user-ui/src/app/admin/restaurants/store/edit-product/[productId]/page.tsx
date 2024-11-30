import { GET_MENU_ITEM } from "@/graphql/actions/restaurant.actions";
import { query } from "@/graphql/gql";
import React from "react";
import { EditProductForm } from "../../add-new-product/_components/forms/edit-product";

type Props = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ params }: Props) => {
  const productId = (await params)?.productId;
  console.log({ productId });
  const { data, loading, error } = await query({
    query: GET_MENU_ITEM,
    variables: { id: productId as string },
  });

  console.log({ error, data });
  if (error) {
    return <div>Failed to load product data. Please try again.</div>;
  }
  return (
    <div>
      <h1 className="text-3xl">Edit Product</h1>

      <section className="pb-8">
        <EditProductForm
          productId={productId as string}
          data={data.getMenuItem}
        />
      </section>
    </div>
  );
};

export default page;
