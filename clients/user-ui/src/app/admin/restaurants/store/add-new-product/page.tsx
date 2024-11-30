import React from "react";
import { AddProductForm } from "./_components/forms/add-new-product-form";

type Props = {};

const AddNewProductPage = (props: Props) => {
  return (
    <div className="container">
      <h1 className="py-6 text-2xl lg:text-4xl font-semibold">Add Product</h1>

      <div className="py-5">
        <AddProductForm />
      </div>
    </div>
  );
};

export default AddNewProductPage;
