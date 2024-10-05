"use client";

import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import { createProduct } from "../../../utils/manageProducts";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";

function useCreateOrEditProduct() {
  const [isWorking, setIsWorking] = useState(false);

  const handleProductForm = async (productData, id, { onSuccess }) => {
    setIsWorking(true);
    try {
      const data = await createProduct(productData, id);
      onSuccess(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsWorking(false);
    }
  };

  return { isWorking, handleProductForm };
}

interface Product {
  product_id?: string;
  [key: string]: any;
}

function ProductsForm({
  productToEdit = {} as Product,
  onClose,
  modalHandler,
}: {
  productToEdit?: Product;
  onClose: () => void;
  modalHandler: () => void;
}) {
  const { isWorking, handleProductForm } = useCreateOrEditProduct();

  const formRef = useRef(null);

  const { product_id: editId, ...editValue } = productToEdit || {};
  const isEditing = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditing ? editValue : {},
  });
  const { errors } = formState;

  // Reset form when productToEdit changes
  useEffect(() => {
    reset(isEditing ? editValue : {});
  }, [productToEdit, reset]);

  // Reset the form and close modal on success
  function handleClose() {
    reset(); // Reset the form fields
    onClose(); // Close the modal
  }

  // Onclick handler for the submit button
  function onSubmit(data) {
    const images = [];
    for (let i = 0; i < 3; i++) {
      if (data[`image${i + 1}`]?.[0]) {
        images.push(data[`image${i + 1}`][0]);
      }
    }

    //filter
    const filteredData = Object.keys(data)
      .filter(
        (key) =>
          key === "description" ||
          key === "productCategory" ||
          key === "productTitle" ||
          key === "rating" ||
          key === "regularPrice" ||
          key === "discountedPrice" ||
          key === "inStock" ||
          key === "image" ||
          key === "productColor"
      )
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    // Pass the images array to the handleProductForm function
    handleProductForm(
      { ...filteredData, image: images },
      isEditing ? editId : null,
      {
        onSuccess: (data) => {
          handleClose();
          toast.success("Products added/edited successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        },
      }
    );
  }

  function onError(errors) {
    console.error(errors);
    toast.error("Error occured!", {
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

  return (
    <div className=" inset-0 bg-opacity-30 flex flex-col justify-center items-center">
      <div className="place-self-end">
        <button
          onClick={() => {
            modalHandler();
            handleClose();
          }}
        >
          <IoCloseSharp className="text-gray-300" size={"5rem"} />
        </button>
      </div>
      <div className="bg-gray-100 w-[88rem] h-[82rem] py-[2rem] pl-[6rem] shadow-xl rounded-[2rem] border-2 border-gray-200">
        <form ref={formRef} onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="mb-[3.5rem] relative">
            <p className="text-gray-600 font-medium">Product title*</p>
            <input
              className="w-[75rem] h-[5rem] rounded-[1rem] border-2 border-primary-dark px-[1rem] mt-[1rem] shadow-md"
              type="text"
              id="productTitle"
              disabled={isWorking}
              {...register("productTitle", {
                required: "Product title is required",
              })}
            />
            {errors.productTitle && (
              <p className="text-red-500 absolute">
                {errors.productTitle.message?.toString() || ""}
              </p>
            )}
          </div>
          {/* category */}

          <div className="mb-[3.5rem] relative flex items-center gap-x-[4.7rem]">
            <div className=" relative">
              <p className="text-gray-600 font-medium">Product Category*</p>
              <input
                className="w-[35rem] h-[5rem] rounded-[1rem] border-2 border-primary-dark px-[1rem] mt-[1rem] shadow-md"
                type="text"
                id="productCategory"
                disabled={isWorking}
                {...register("productCategory", {
                  required: "Product category is required",
                  onChange: (e) => {
                    const value = e.target.value.toLowerCase();
                    e.target.value = value;
                  },
                })}
              />
              {errors.productCategory && (
                <p className="text-red-500 absolute">
                  {errors.productCategory?.message?.toString()}
                </p>
              )}
            </div>

            <div className=" relative">
              <p className="text-gray-600 font-medium">
                Product colors(ex: red, black)*
              </p>
              <input
                className="w-[35rem] h-[5rem] rounded-[1rem] border-2 border-primary-dark px-[1rem] mt-[1rem] shadow-md"
                type="text"
                id="productColor"
                disabled={isWorking}
                {...register("productColor", {
                  required: "Product color is required",
                  onChange: (e) => {
                    const value = e.target.value.toLowerCase();
                    e.target.value = value;
                  },
                })}
              />
              {errors.productColor && (
                <p className="text-red-500 absolute">
                  {errors.productColor?.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="mb-[3.5rem] relative flex items-center gap-x-[4.7rem]">
            <div className=" relative">
              <p className="text-gray-600 font-medium">
                Product price(without discount)*
              </p>
              <input
                className="w-[35rem] h-[5rem] rounded-[1rem] border-2 border-primary-dark px-[1rem] mt-[1rem] shadow-md"
                type="number"
                id="regularPrice"
                disabled={isWorking}
                {...register("regularPrice", {
                  required: "Product price is required",
                })}
              />
              {errors.regularPrice && (
                <p className="text-red-500 absolute">
                  {errors.regularPrice?.message?.toString()}
                </p>
              )}
            </div>

            <div className=" relative">
              <p className="text-gray-600 font-medium">
                Product price (with discount)*
              </p>
              <input
                className="w-[35rem] h-[5rem] rounded-[1rem] border-2 border-primary-dark px-[1rem] mt-[1rem] shadow-md"
                type="number"
                id="discountedPrice"
                disabled={isWorking}
                {...register("discountedPrice", {
                  required: "Product price is required",
                })}
              />
              {errors.discountedPrice && (
                <p className="text-red-500 absolute">
                  {errors.discountedPrice?.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="relative flex items-center gap-x-[4.7rem]">
            <div className="mb-[3.5rem] relative">
              <p className="text-gray-600 font-medium">
                Product rating (optional)
              </p>
              <input
                className="w-[35rem] h-[5rem] rounded-[1rem] border-2 border-primary-dark px-[1rem] mt-[1rem] shadow-md"
                type="number"
                id="rating"
                disabled={isWorking}
                defaultValue={0}
                {...register("rating", {
                  validate: (value) => {
                    if (Number(value) > 5) {
                      return "rating should be less than 5";
                    }
                    if (Number(value) < 0) {
                      return "rating should be greater than 0";
                    }
                    return true;
                  },
                })}
              />
              {errors.rating && (
                <p className="text-red-500 absolute">
                  {errors.rating?.message?.toString()}
                </p>
              )}
            </div>

            <div className=" relative">
              <p className="text-gray-600 font-medium">
                Is product available in stock*
              </p>
              <div className="flex items-center mt-[1rem]">
                <input
                  className="w-[2rem] h-[2rem] rounded-[0.5rem] border-2 border-primary-dark shadow-md"
                  type="checkbox"
                  id="inStock"
                  disabled={isWorking}
                  {...register("inStock")}
                />
                <label htmlFor="inStock" className="ml-[1rem] text-[1.5rem]">
                  In Stock
                </label>
              </div>
              {/* <input
                className="w-[35rem] h-[5rem] rounded-[1rem] border-2 border-primary-dark px-[1rem] mt-[1rem] shadow-md"
                type="checkbox"
                id="discountedPrice"
                disabled={isWorking}
                {...register("inStock", {
                  required: "Product price is required",
                })}
              /> */}
              {errors.inStock && (
                <p className="text-red-500 absolute">
                  {errors.inStock?.message?.toString()}
                </p>
              )}
            </div>
          </div>
          <div className="relative">
            <p className="text-gray-600 font-medium">
              Description of product(optional)
            </p>
            <textarea
              className="w-[75rem] h-[5rem] rounded-[1rem] border-2 border-primary-dark px-[1rem] mt-[1rem] shadow-md"
              id="description"
              defaultValue=""
              disabled={isWorking}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 absolute">
                {errors.description?.message?.toString()}
              </p>
            )}
          </div>
          {/* photo */}
          <div className="mb-[3.5rem] relative">
            <p className="text-gray-600 font-medium">Product photos</p>
            {[...Array(3)].map((_, index) => (
              <input
                key={index}
                className="text-[1.4rem] rounded-sm font-medium file:text-gray-100 file:mt-[.5rem] file:px-3 file:py-2 file:mr-3 file:rounded-lg file:border-none file:text-brand-50 file:bg-blue-400 file:cursor-pointer file:transition-colors file:duration-200 hover:file:bg-brand-700"
                type="file"
                id={`image${index + 1}`}
                accept="image/*"
                {...register(`image${index + 1}`, {
                  required: isEditing
                    ? false
                    : index === 0 && "At least one product photo is required",
                })}
              />
            ))}
            {errors.image1 && (
              <p className="text-red-500 absolute">
                {errors.image1?.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <input type="submit" className="hidden" />
          </div>
          <div className="flex items-center gap-x-6">
            <Button
              onClick={() => {
                if (formRef.current) {
                  handleSubmit(onSubmit)();
                }
              }}
              label={isEditing ? "Edit product" : "Add a new Product"}
              disabled={isWorking}
              isActive={false}
              setActiveButton={function (label: string): void {
                throw new Error("Function not implemented.");
              }}
            />
            <Button
              label={"Cancel"}
              onClick={onClose}
              type="reset"
              isActive={false}
              setActiveButton={function (label: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          {/*single photo upload  */}
          {/* <div className="mb-[3.5rem] relative">
            <p className="text-gray-600 font-medium">Product photo</p>
            <input
              className="text-[1.4rem] rounded-sm font-medium file:text-gray-100 file:mt-[.5rem] file:px-3 file:py-2 file:mr-3 file:rounded-lg file:border-none file:text-brand-50 file:bg-blue-400 file:cursor-pointer file:transition-colors file:duration-200 hover:file:bg-brand-700"
              type="file"
              id="image"
              accept="image/*"
              {...register("image", {
                required: isEditing ? false : "Product photo is required",
              })}
            />
            {errors.image && (
              <p className="text-red-500 absolute">{errors.image.message}</p>
            )}
          </div> */}
          {/* <div>
            <input type="submit" className="hidden" />
          </div>
          <div className="flex items-center gap-x-6">
            <Button
              onClick={() => {
                if (formRef.current) {
                  handleSubmit(onSubmit)();
                }
              }}
              label={isEditing ? "Edit product" : "Add a new Product"}
              disabled={isWorking}
            />
            <Button label={"Cancel"} onClick={onClose} type="reset" />
          </div> */}
        </form>
      </div>
    </div>
  );
}

export default ProductsForm;



