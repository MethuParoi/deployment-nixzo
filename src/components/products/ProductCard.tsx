"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { IoStar } from "react-icons/io5";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  getCart,
  getCurrentQuantityById,
} from "@/store/features/cart/cartSlice";
import QuantityButton from "../ui/QuantityButton";
import { useRouter } from "next/navigation";
import { setCart, setEmailUserCart } from "../../../utils/cart";
import { RootState } from "@/store/store";

function ProductCard({
  product_id: productId,
  img,
  category,
  title,
  price,
  previousPrice,
  description,
  rating,
  inStock,
}) {
  const router = useRouter();
  const cart = useSelector(getCart);

  //extract first image from array
  const image = img.split(",");
  const firstImage = image[0];

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

  // State to manage product IDs and Pid
  const [pids, setPids] = useState<string[]>([]);
  const [Pid, setPid] = useState<string | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);

  // Effect to set the product IDs in the cart
  useEffect(() => {
    if (cart.length > 0) {
      const pidsArray = cart.map((item) => item.productId);
      setPids(pidsArray);
    } else {
      setPids([]);
    }
  }, [cart]);

  // Effect to check if the productId is in the cart and set Pid accordingly
  useEffect(() => {
    if (productId && pids.includes(productId)) {
      setPid(productId);
    }
  }, [productId, pids]);
  // console.log("Pids:", pids);

  const dispatch = useDispatch();
  const [showButton, setShowButton] = useState(true);

  // Use Pid if available, otherwise use productId
  // const currentQuantity = useSelector(
  //   getCurrentQuantityById(pids ? pids[0] : productId)
  // );
  // console.log("Current Quantity in ProductCard:", currentQuantity);

  const quantity = useSelector(getCurrentQuantityById(productId));
  useEffect(() => {
    setCurrentQuantity(quantity);

    if (quantity > 0) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }
  }, [cart, productId]);

  // Update the showButton state based on currentQuantity
  // useEffect(() => {
  //   if (currentQuantity === 0) {
  //     setShowButton(true);
  //   }
  //   if (currentQuantity > 0) {
  //     setShowButton(false);
  //   }
  // }, [currentQuantity]);

  // Handle adding to cart
  const handleAddToCart = () => {
    const newItem = {
      productId: Pid ? Pid : productId,
      title,
      quantity: 1,
      unitPrice: price,
      firstImage,
      category,
      description,
    };
    dispatch(addItem(newItem));
  };

  // Handle card click
  const handleClick = () => {
    router.push(`/products/${productId}`);
  };
  console.log(inStock);

  return (
    <div className="w-[29rem] rounded-2xl p-4 shadow-2xl border-2 border-gray-100">
      <div onClick={handleClick} className="cursor-pointer">
        <Image
          className="w-[100%] h-[40rem] object-contain"
          src={firstImage}
          width={300}
          height={400}
          alt=""
        />
      </div>
      <div>
        <div
          onClick={handleClick}
          className="flex items-center justify-between cursor-pointer"
        >
          <h1 className="text-[2rem] font-semibold text-gray-600 line-clamp-1">
            {title}
          </h1>
          <div className="flex items-center justify-center gap-x-2 bg-green-400 w-[6rem] h-[2.6rem] text-gray-50">
            <IoStar className="text-[2rem] " />
            <p className="font-semibold ">{rating}</p>
          </div>
        </div>
        <p className="text-gray-600 line-clamp-1">{description}</p>
        <div className="flex items-center justify-between mt-4 mr-4">
          {showButton ? (
            inStock ? (
              <Button
                onClick={() => {
                  handleAddToCart();
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
                }}
                type="card"
                label="Add to cart"
                isActive={false}
                setActiveButton={function (label: string): void {
                  throw new Error("Function not implemented.");
                }}
              />
            ) : (
              <Button
                type="card"
                label="Out of stock"
                disabled
                onClick={function (
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ): string | void | Promise<void> {
                  throw new Error("Function not implemented.");
                }}
                isActive={false}
                setActiveButton={function (label: string): void {
                  throw new Error("Function not implemented.");
                }}
              />
            )
          ) : (
            <QuantityButton
              currentQuantity={currentQuantity}
              productId={productId}
            />
          )}
          <div className="flex items-center gap-x-5">
            <p className="text-[1.8rem] text-gray-500 font-semibold line-through decoration-2">
              ৳ {previousPrice}
            </p>
            <p className="text-[3rem] text-gray-900 font-semibold">৳ {price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
