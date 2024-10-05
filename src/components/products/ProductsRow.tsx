"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Loader from "../ui/Loader/Loader";
import { useSelector } from "react-redux";
import { getProducts, getSortedProducts } from "../../../utils/products";
import { RootState } from "../../store/store"; // Adjust the import path according to your project structure

function ProductsRow() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const selectedCategories = useSelector(
    (state: RootState) => state.sortProduct.selectedOptions
  );

  //different product categories
  const category = useSelector((state: RootState) => state.product.product);

  useEffect(() => {
    async function fetchProducts(category) {
      try {
        const data = await getProducts(category);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(true); // Set error state if fetching fails
      }
    }
    fetchProducts(category);
  }, [category]);

  useEffect(() => {
    async function fetchProducts(selectedCategories) {
      try {
        const data = await getSortedProducts(selectedCategories);
        setFilteredProducts(data);
        setLoading(false);
      } catch (err) {
        setError(true); // Set error state if fetching fails
      }
    }
    fetchProducts(selectedCategories);
  }, [selectedCategories]);

  if (error) {
    //automatically reloads
    () => window.location.reload();
  }

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );

  if (selectedCategories && selectedCategories.length > 0) {
    return (
      <div>
        <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-[1rem] md:gap-x-40 gap-y-20 mx-auto max-w-screen-2xl">
          {filteredProducts &&
            filteredProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                // key={product.id}
                // product_id={product.id} // for fake api only
                product_id={product.product_id}
                img={product.image}
                category={product.productCategory}
                title={product.productTitle}
                price={product.discountedPrice}
                previousPrice={product.regularPrice}
                description={product.description}
                rating={product.rating}
                inStock={product.inStock}
              />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[1rem] md:gap-x-40 gap-y-20 mx-auto max-w-screen-2xl">
        {products &&
          products.map((product) => (
            <ProductCard
              key={product.product_id}
              // key={product.id}
              // product_id={product.id} // for fake api only
              product_id={product.product_id}
              img={product.image}
              category={product.productCategory}
              title={product.productTitle}
              price={product.discountedPrice}
              previousPrice={product.regularPrice}
              description={product.description}
              rating={product.rating}
              inStock={product.inStock}
            />
          ))}
      </div>
    </div>
  );
}

export default ProductsRow;
