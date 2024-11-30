import { ProductCard } from "@/components/global/product-card";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

interface Category {
  id: string;
  name: string;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
  menuItems: MenuItem[];
}

interface CategoryProductsProps {
  category: Category[];
}

export function CategoryProducts({ category }: CategoryProductsProps) {
  return category?.map((product) => (
    <div className="mt-12 " key={product.id}>
      <h2 className="text-3xl font-bold py-6">{product?.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {product?.menuItems?.map((item, index) => (
          <ProductCard
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            imageUrl={item.imageUrl}
            inStock={item.inStock}
          />
        ))}
      </div>
    </div>
  ));
}
