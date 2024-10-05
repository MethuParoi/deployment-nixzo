"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import SizeButtons from "../../../../components/product-details/SizeButtons";
import Button from "../../../../components/ui/Button";
import ReactImageMagnify from "react-image-magnify";
import Loader from "../../../../components/ui/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  getCart,
  getCurrentQuantityById,
} from "@/store/features/cart/cartSlice";
import QuantityButton from "@/components/ui/QuantityButton";
import { toast } from "react-toastify";
import { setCart, setEmailUserCart } from "../../../../../utils/cart";
import { getProductDetails } from "../../../../../utils/products";
import ColorDropdown from "@/components/ui/ColorDropdown";
import { RootState } from "@/store/store";

interface Product {
  id: string;
  image: string;
  category: string;
  title: string;
  price: number;
  description: string;
  rating: {
    rate: number;
  };
}

const ProductDetails = () => {
  const [productDetails, setProductDetails] = useState<Product | null | any>(
    null
  );
  const [productId, setProductId] = useState<string | null>(null);
  const [pids, setPids] = useState<string[]>([]);
  const [Pid, setPid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const dispatch = useDispatch();
  const cart = useSelector(getCart);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  //state for selecting color
  const [selectedColor, setSelectedColor] = useState("");

  // Updating cart to user account
  const user_id = useSelector((state: RootState) => state.user.user_id);
  // console.log("User ID:", user_id);
  const user_avatar = useSelector((state: RootState) => state.user.user_avatar);
  useEffect(() => {
    const trimmedUserAvatar = user_avatar.trim().toLowerCase();
    const defaultAvatarUrl =
      "https://kjqzojrvmhadxwftawlo.supabase.co/storage/v1/object/public/product_images/profile-user.png";

    // console.log("User Avatar:", trimmedUserAvatar);

    if (trimmedUserAvatar !== defaultAvatarUrl && user_id) {
      // console.log("Updating cart for regular user");
      setCart(cart, user_id);
    }

    if (trimmedUserAvatar === defaultAvatarUrl && user_id) {
      // console.log("Updating cart for email user");
      setEmailUserCart(cart, user_id);
    }
  }, [cart, user_id, user_avatar]);
  //--------------------------------

  useEffect(() => {
    if (cart.length > 0) {
      const pidsArray = cart.map((item) => item.productId);
      setPids(pidsArray);
    } else {
      setPids([]);
    }
  }, [cart]);

  useEffect(() => {
    const url = window.location.href;
    const id = url.split("/").pop();
    setProductId(id || null);
  }, []);

  useEffect(() => {
    if (productId && pids.includes(productId)) {
      setPid(productId);
    }
  }, [productId, pids]);

  //after supabase product
  async function fetchProductDetails(productId) {
    const data = await getProductDetails(productId);
    setProductDetails(data);
    setLoading(false);
  }
  // console.log("Product Details:", productDetails);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  // multiple image options
  const image =
    productDetails && productDetails[0].image
      ? productDetails[0].image.split(",")
      : [];

  const image1 = image[0];
  const image2 = image[1];
  const image3 = image[2];
  const image4 = image[3];

  // console.log("Image 1:", image1);

  //multiple images
  const [displayImage, setDisplayImage] = useState(image1);

  useEffect(() => {
    if (image1) {
      setDisplayImage(image1);
    }
  }, [image1]);

  function handleDisplayImage(imageKey) {
    if (imageKey === "image1") {
      setDisplayImage(image1);
    }
    if (imageKey === "image2") {
      setDisplayImage(image2);
    }
    if (imageKey === "image3") {
      setDisplayImage(image3);
    }
    if (imageKey === "image4") {
      setDisplayImage(image4);
    }
  }
  // console.log("displayImage", displayImage);
  const productID = productDetails ? productDetails[0]?.product_id : null;

  // Determine which ID to use for fetching the current quantity
  const quantityId = Pid ? Pid : productID;
  const currentQuantity = useSelector(getCurrentQuantityById(quantityId));

  useEffect(() => {
    setShowButton(currentQuantity === 0);
  }, [currentQuantity]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select a size / color", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    if (productDetails) {
      const newItem = {
        productId: productId,
        title: productDetails[0].productTitle,
        quantity: 1,
        unitPrice: productDetails[0].discountedPrice,
        firstImage: image1,
        category: productDetails[0].productCategory,
        description: productDetails[0].description,
        size: selectedSize,
        color: selectedColor,
      };
      dispatch(addItem(newItem));
    } else {
      console.error("Product details are not available");
    }

    toast.success("Item added to the cart", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {productDetails && (
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-y-[4rem] lg:gap-y-0 my-[5rem]">
          <div className="flex flex-col-reverse md:flex-row gap-y-6 md:gap-y-0 md:gap-x-6">
            <div className="flex flex-row justify-center md:justify-normal md:flex-col gap-x-4 md:gap-x-0 md:gap-y-2">
              <button
                onClick={() => handleDisplayImage("image1")}
                className="border-2 border-gray-400 rounded-xl h-[4.5rem] md:h-[8rem]"
              >
                <Image
                  className="w-[2.8rem] md:w-[5rem] rounded-xl"
                  src={image1}
                  alt={productDetails[0].productTitle}
                  width={50}
                  height={80}
                />
              </button>

              <button
                onClick={() => handleDisplayImage(image2 ? "image2" : "image1")}
                className="border-2 border-gray-400 rounded-xl h-[4.5rem] md:h-[8rem]"
              >
                <Image
                  className="w-[2.8rem] md:w-[5rem] rounded-xl"
                  src={image2 ? image2 : image1}
                  alt={productDetails.title}
                  width={50}
                  height={80}
                />
              </button>

              <button
                onClick={() => handleDisplayImage(image3 ? "image3" : "image1")}
                className="border-2 border-gray-400 rounded-xl h-[4.5rem] md:h-[8rem]"
              >
                <Image
                  className="w-[2.8rem] md:w-[5rem] rounded-xl"
                  src={image3 ? image3 : image1}
                  alt={productDetails.title}
                  width={50}
                  height={80}
                />
              </button>
            </div>
            <div className="w-[30rem] sm:w-[40rem] lg:w-[42rem] xl:w-[50rem] border-2 border-gray-200 p-5 rounded-xl">
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: "product image",
                    isFluidWidth: true,
                    src: displayImage,
                  },
                  imageStyle: {
                    objectFit: "fill",
                    width: "100%",
                    height: "100%",
                  },
                  largeImage: {
                    src: displayImage,
                    width: 900,
                    height: 1400,
                  },
                  enlargedImageContainerDimensions: {
                    width: "300%",
                    height: "300%",
                  },
                  enlargedImagePosition: "over",
                  enlargedImageContainerStyle: {
                    position: "absolute",
                    background: "#fff",
                    zIndex: 9999,
                  },
                }}
              />
            </div>
          </div>

          {/* Product details */}
          <div className="ml-[3rem]">
            <h1 className="text-[2.4rem] text-secondary-light font-bold lg:max-w-[50rem] xl:max-w-screen-xl line-clamp-1">
              {productDetails[0].productTitle}
            </h1>
            <div className="flex items-center gap-x-5">
              <p className="text-[3rem] text-secondary-dark font-semibold">
                <span className="text-[2.4rem] text-secondary-light mr-[.5rem]">
                  ৳
                </span>{" "}
                {productDetails[0].discountedPrice}
              </p>
              <p className="text-[1.8rem] text-gray-500 font-semibold line-through decoration-2">
                ৳ {productDetails[0].regularPrice}
              </p>
            </div>
            <hr className="border-1 lg:w-[50rem] xl:w-[60rem] my-[1rem]" />
            <p className="text-[1.8rem] text-secondary-light font-semibold">
              Category: {productDetails[0].productCategory}
            </p>
            <div className="relative h-[5rem] py-[1rem]">
              <ColorDropdown
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                productColor={productDetails[0].productColor}
                allcolors={undefined}
              />
            </div>
            <hr className="border-1 lg:w-[50rem] xl:w-[60rem] my-[1rem]" />{" "}
            <div>
              {" "}
              <p className="text-[1.8rem] text-secondary-light font-semibold">
                Size:{" "}
              </p>{" "}
              <div className="my-[1rem] ">
                <SizeButtons
                  setSelectedSize={setSelectedSize}
                  selectedSize={selectedSize}
                />{" "}
              </div>{" "}
            </div>
            <div>
              <p className="text-[1.8rem] text-secondary-light font-semibold">
                Description:
              </p>
              <p className="line-clamp-3 max-w-[50rem]">
                {productDetails[0].description}
              </p>
            </div>
            <div className="mt-[3rem]">
              {showButton ? (
                <Button
                  onClick={() => {
                    handleAddToCart();
                  }}
                  type="auth"
                  label="Add to cart"
                  isActive={false}
                  setActiveButton={function (label: string): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              ) : (
                <QuantityButton
                  currentQuantity={currentQuantity}
                  productId={Pid ? Pid : productID} // Conditionally set productId
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
