"use client";

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

import React, { useEffect, useState } from "react";
import ProductsForm from "../../../../components/admin/ProductsForm";
import { getProducts } from "../../../../../utils/showProducts";
import ProductsTable from "../../../../components/admin/ProductsTable";
import Button from "@/components/ui/Button";
import { deleteProduct } from "../../../../../utils/manageProducts";
import { toast } from "react-toastify";
import CouponForm from "@/components/admin/CouponForm";
import AdminForm from "@/components/admin/AdminForm";
import { deleteAdmin, getAdmin } from "../../../../../utils/admin";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { getCoupon } from "../../../../../utils/coupon";
import HeroBannerForm from "@/components/admin/HeroBannerForm";

function Page() {
  const [modal, setModal] = useState(false);
  const [productData, setProductData] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [adminData, setAdminData] = useState([]);
  const [couponData, setCouponData] = useState([]);
  const [initialProducts, setInitialProducts] = useState("initial");

  //banner modal handler
  const [bannerModal, setBannerModal] = useState(false);

  const bannerModalHandler = () => {
    if (bannerModal) {
      setProductToEdit(null); // Reset productToEdit when closing the modal
    }
    setBannerModal(!bannerModal);
  };

  useEffect(() => {
    async function fetchProducts(initialProducts) {
      const allProducts = await getProducts(initialProducts);
      setProductData(allProducts);
    }

    fetchProducts(initialProducts);
  }, [initialProducts]);
  // console.log(productData);

  //---------------------------

  useEffect(() => {
    async function fetchProducts(initialProducts) {
      const allProducts = await getProducts(initialProducts);
      setProductData(allProducts);
    }

    fetchProducts(initialProducts);
    // Set up real-time subscription
    const productsChannel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products_table" },
        (payload) => {
          // console.log("Received event", payload);
          if (payload.eventType === "INSERT") {
            setProductData((prevProducts) => [...prevProducts, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setProductData((prevProducts) =>
              prevProducts.map((product) =>
                product.product_id === payload.new.product_id
                  ? payload.new
                  : product
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProductData((prevProducts) =>
              prevProducts.filter(
                (product) => product.product_id !== payload.old.product_id
              )
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(productsChannel);
    };
  }, [initialProducts]);

  //fetch admin data
  useEffect(() => {
    async function fetchAdmin() {
      const admin = await getAdmin();
      setAdminData(admin);
    }

    fetchAdmin();
  }, []);

  //fetch coupon data
  useEffect(() => {
    async function fetchCoupon() {
      const coupon = await getCoupon();
      setCouponData(coupon);
    }

    fetchCoupon();
  }, []);

  const modalHandler = () => {
    if (modal) {
      setProductToEdit(null); // Reset productToEdit when closing the modal
    }
    setModal(!modal);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProductData(productData.filter((p) => p.product_id !== productId));
      toast.success("Products deleted succesfuly!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className=" min-h-[87vh] ">
      {/* product management   */}
      <div className="h-[87vh] w-[80dvw] overflow-x-scroll  xl:overflow-x-hidden flex flex-col items-center container mx-auto mt-[2rem] relative ">
        {/* table header */}
        <div className="min-w-[120rem] grid grid-cols-6 w-full gap-x-4 gap-y-2 justify-items-center bg-gray-200 py-[1rem] rounded-2xl mb-[2rem]">
          <div>
            <h1 className="text-[2rem] font-bold text-gray-900">Image</h1>
          </div>
          <div>
            <h1 className="text-[2rem] font-bold text-gray-900">
              Product Name
            </h1>
          </div>
          <div>
            <h1 className="text-[2rem] font-bold text-gray-900">Category</h1>
          </div>
          <div>
            <h1 className="text-[2rem] font-bold text-gray-900">
              Regular Price
            </h1>
          </div>
          <div>
            <h1 className="text-[2rem] font-bold text-gray-900">
              Discounted Price
            </h1>
          </div>
          <div>
            <h1 className="text-[2rem] font-bold text-gray-900">In Stock</h1>
          </div>
        </div>
        <div
          className={`${
            modal
              ? "opacity-50"
              : "bg-gray-100 px-[2rem] max-h-[80vh] overflow-y-auto"
          } flex flex-col items-center rounded-2xl`}
        >
          <ProductsTable
            productData={productData}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </div>
        <div className="self-start mt-[2rem] flex items-center justify-between w-full">
          <div>
            <Button
              label="Add Product"
              onClick={() => modalHandler()}
              isActive={false}
              setActiveButton={function (label: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="self-end">
            <Button
              label="View All Product"
              onClick={() => setInitialProducts("all")}
              isActive={false}
              setActiveButton={function (label: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>
        {modal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <ProductsForm
              modalHandler={modalHandler}
              productToEdit={productToEdit}
              onClose={modalHandler}
            />
          </div>
        )}
      </div>
      {/* coupon management */}
      <div className="flex-col justify-center my-[3rem]">
        <h1 className="text-[2rem] font-semibold text-gray-600 text-center border-b-2 border-b-gray-700">
          Manage coupon code
        </h1>
        <div className="flex flex-col items-center lg:flex-row lg:gap-x-[19rem] lg:mt-[3rem]">
          <div className="">
            <CouponForm />
          </div>

          <div>
            <h1 className="text-[2rem] text-gray-700 text-center font-semibold mb-[1rem]">
              Existing coupon
            </h1>

            {couponData.map((coupon) => (
              <div
                className="w-[35rem] h-[8rem] bg-gray-200 rounded-xl  shadow-md my-[1rem] mx-auto flex items-center justify-between "
                key={coupon.admin_id}
              >
                <div className="ml-[6rem] p-[3rem]">
                  <p className="text-gray-700">
                    Coupon code: {coupon.coupon_code}
                  </p>
                  <p className="text-gray-700">
                    Discount percentage: {coupon.discount_percent}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* admin management */}
      <div className="flex-col justify-center my-[3rem]">
        <h1 className="text-[2rem] font-semibold text-gray-600 text-center border-b-2 border-b-gray-700">
          Manage Admin
        </h1>
        <div className="flex flex-col items-center lg:flex-row lg:gap-x-[8rem] lg:mt-[3rem]">
          <div className="">
            <AdminForm />
          </div>

          {/* existing admins */}
          <div>
            <h1 className="text-[2rem] text-gray-700 text-center font-semibold mb-[1rem]">
              Existing admins
            </h1>
            <div className="w-[60rem] h-[20rem] bg-gray-100 rounded-xl overflow-y-auto ">
              {adminData.map((admin) => (
                <div
                  className="w-[40rem] h-[7rem] bg-gray-200 rounded-xl p-[1rem] shadow-md my-[1rem] mx-auto flex items-center justify-between "
                  key={admin.admin_id}
                >
                  <div className="ml-[2rem]">
                    <p className="text-gray-700">
                      Admin contact: {admin.admin_contact}
                    </p>
                    <p className="text-gray-700">
                      Admin password: {admin.admin_password}
                    </p>
                  </div>
                  <div
                    onClick={() => {
                      deleteAdmin(admin.admin_id);
                      toast.success("Admin deleted succesfuly!", {
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
                    className="mr-[2rem] cursor-pointer"
                  >
                    <RiDeleteBin5Fill className="text-[2.5rem]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* manage banner */}
      <div className="flex-col justify-center my-[3rem]">
        <h1 className="text-[2rem] font-semibold text-gray-600 text-center border-b-2 border-b-gray-700">
          Manage Hero Banner
        </h1>
        <div className="flex flex-col items-center mt-[3rem]">
          <h1 className="text-[2rem] font-semibold text-secondary">
            Add/Edit Hero Banner
          </h1>
          <div className=" my-[3rem]">
            <Button
              label="Add New Banner"
              onClick={() => setBannerModal(!bannerModal)}
              isActive={false}
              setActiveButton={function (label: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          {bannerModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <HeroBannerForm
                modalHandler={bannerModalHandler}
                productToEdit={productToEdit}
                onClose={bannerModalHandler}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
