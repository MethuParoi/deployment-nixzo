"use client";

import React, { useEffect, useState } from "react";
import SortProducts from "@/components/products/SortProducts";
import { useSelector } from "react-redux";
import { getCategories } from "../../../utils/products";

function SortRows() {
  interface Option {
    label: string;
    value: string;
  }

  const [categories, setCategories] = useState(new Set());

  interface RootState {
    sortProduct: {
      selectedOptions: string[];
    };
  }

  const selectedCategories = useSelector(
    (state: RootState) => state.sortProduct.selectedOptions
  );

  //fetch categories
  async function fetchCategory() {
    const category = await getCategories();
    setCategories(new Set(category.map((item) => item.productCategory)));
  }

  useEffect(() => {
    fetchCategory();
  }, []);
  // console.log("categories:", categories);

  // Convert categories to an array of Option objects
  const categoryOptions: Option[] = Array.from(categories).map((category) => ({
    label: category as string,
    value: category as string,
  }));

  return (
    <div>
      <div className="xl:border-b-2 border-gray-300 mr-[2rem] pt-[1rem]">
        <SortProducts label={"Sort by Category"} Options={categoryOptions} />
      </div>
    </div>
  );
}

export default SortRows;
