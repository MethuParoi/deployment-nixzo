import Image from "next/image";
import React, { useEffect, useState } from "react";
import img from "../../../public/images/categories/classic-2.jpg";
import QuantityButton from "../ui/QuantityButton";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItem,
  getCurrentQuantityById,
  updateItemSize,
  updateItemColor,
} from "@/store/features/cart/cartSlice";
import { RiDeleteBin6Fill } from "react-icons/ri";
import SizeButtons from "../product-details/SizeButtons";
import ColorDropdown from "../ui/ColorDropdown";
import { getProductColors } from "../../../utils/products";

function CartItems({ item }) {
  const {
    productId,
    title,
    quantity,
    unitPrice,
    totalPrice,
    firstImage,
    description,
    size,
    color,
  } = item;
  //fetching product color
  const [selectedColor, setSelectedColor] = useState(color);

  const [colors, setColors] = useState([]);
  useEffect(() => {
    async function fetchColor(productId) {
      const data = await getProductColors(productId);
      setColors(data);
    }
    fetchColor(productId);
  }, [productId]);

  //using redux store
  const dispatch = useDispatch();
  const currentQuantity = useSelector(getCurrentQuantityById(productId));
  // console.log("Current Quantity in Cart:", currentQuantity);
  // console.log("ID:", productId);

  // Local state to track the current selected size and color
  const [selectedSize, setSelectedSize] = useState(size);

  // Update the Redux store when the size is changed
  const handleSizeChange = (newSize) => {
    setSelectedSize(newSize);
    dispatch(updateItemSize({ productId, size: newSize }));
  };

  useEffect(() => {
    setSelectedSize(size); // Initialize size when component mounts or item changes
  }, [size]);

  // Update the Redux store when the color is changed
  const handleColorChange = (newColor) => {
    setSelectedColor(newColor);
    dispatch(updateItemColor({ productId, color: newColor }));
  };

  useEffect(() => {
    setSelectedColor(color); // Initialize color when component mounts or item changes
  }, [color]);

  return (
    <div className="flex flex-col justify-center md:grid xl:grid-cols-7 md:grid-cols-5 my-[2rem] md:my-[1rem]">
      <div className="xl:col-span-4 col-span-2 flex xl:flex-row flex-col my-[1rem]">
        <div className="border-2 border-gray-300 rounded-lg w-[15rem]">
          <Image
            className="w-[15rem] h-[15rem] rounded-lg"
            src={firstImage}
            height={150}
            width={150}
            alt="product image"
          />
        </div>
        <div className="xl:ml-[2rem] mt-[1rem] xl:mt-0 h-[15rem]">
          <p className="md:text-[2rem] font-normal line-clamp-1 pr-4">
            {title}
          </p>

          <div className="mt-[2rem] z-10">
            <SizeButtons
              selectedSize={selectedSize}
              setSelectedSize={(newSize) => handleSizeChange(newSize)}
            />
          </div>
          <div className="mt-[1rem] z-10">
            <ColorDropdown
              selectedColor={selectedColor}
              setSelectedColor={(newColor) => handleColorChange(newColor)}
              // productColor={color}
              allcolors={colors[0]}
              productColor={undefined}
            />
          </div>
        </div>
      </div>
      {/* lagrger than md */}
      <div className="hidden md:block">
        <p className="text-[2rem] font-medium">
          {" "}
          <span className="font-bold">৳</span>
          {unitPrice}
        </p>
      </div>
      <div className="hidden md:block">
        <QuantityButton
          currentQuantity={currentQuantity}
          productId={productId}
        />
      </div>
      <div className="md:flex items-start justify-between mr-[1rem] hidden ">
        <p className="text-[2rem] font-medium">
          {" "}
          <span className="font-bold">৳</span>{" "}
          {Math.round(unitPrice * currentQuantity)}
        </p>
        <button
          onClick={() => dispatch(deleteItem(productId))}
          className="text-[2.5rem] text-primary-light w-[3.5rem] h-[3.5rem] rounded-lg hover:bg-red-600 bg-red-500 flex justify-center items-center mb-[.5rem]"
        >
          <RiDeleteBin6Fill />
        </button>
      </div>

      {/* for mobile screen */}
      <div className="mt-[-1rem] md:hidden gap-y-8">
        <div className="flex gap-x-4 mb-2 md:mb-0">
          <div className="mr-[2rem]">
            <p className="text-[2rem] font-medium">
              {" "}
              <span className="font-bold">৳</span>
              {unitPrice}
            </p>
          </div>
          <div className="">
            <QuantityButton
              currentQuantity={currentQuantity}
              productId={productId}
            />
          </div>
          <div className="flex items-start justify-between mr-[1rem]">
            {/* <p className="hidden text-[2rem] font-medium">
            {" "}
            <span className="font-bold">৳</span>{" "}
            {Math.round(unitPrice * currentQuantity)}
          </p> */}
            <button
              onClick={() => dispatch(deleteItem(productId))}
              className="text-[2.5rem] text-primary-light w-[3.5rem] h-[3.5rem] rounded-lg hover:bg-red-600 bg-red-500 flex justify-center items-center mb-[.5rem]"
            >
              <RiDeleteBin6Fill />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;


