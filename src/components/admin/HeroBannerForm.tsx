"use client";

import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { createBanner } from "../../../utils/manageHeroBanner";

function useCreateOrEditBanner() {
  const [isWorking, setIsWorking] = useState(false);

  const handleBannerForm = async (productData, id, { onSuccess }) => {
    setIsWorking(true);
    try {
      const data = await createBanner(productData, id);
      onSuccess(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsWorking(false);
    }
  };

  return { isWorking, handleBannerForm };
}

interface ProductToEdit {
  product_id?: string;
  [key: string]: any;
}

function HeroBannerForm({
  productToEdit = {} as ProductToEdit,
  onClose,
  modalHandler,
}) {
  const { isWorking, handleBannerForm } = useCreateOrEditBanner();

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
    for (let i = 0; i < 6; i++) {
      if (data[`image${i + 1}`]?.[0]) {
        images.push(data[`image${i + 1}`][0]);
      }
    }

    if (images.length > 6) {
      toast.error("You can upload a maximum of 6 images.", {
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

    //filter
    const filteredData = Object.keys(data)
      .filter((key) => key === "image")
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    // Pass the images array to the handleProductForm function
    handleBannerForm(
      { ...filteredData, image: images },
      isEditing ? editId : null,
      {
        onSuccess: (data) => {
          handleClose();
          toast.success("Banner added successfully!", {
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
    toast.error("Error occurred!", {
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
            onClose();
          }}
        >
          <IoCloseSharp className="text-gray-300" size={"5rem"} />
        </button>
      </div>
      <div className="bg-gray-100 w-[60rem] h-[40rem] py-[2rem] pl-[6rem] shadow-xl rounded-[2rem] border-2 border-gray-200">
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit, onError)}
          // type={onClose ? "modal" : "regular"}
        >
          {/* photo */}
          <div className="mb-[3.5rem] relative">
            <p className="text-gray-600 font-medium">
              Add Banner Photos(first 3 for large screen, last 3 for mobile
              screen)
            </p>
            {[...Array(6)].map((_, index) => (
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
                {typeof errors.image1?.message === "string"
                  ? errors.image1.message
                  : ""}
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
              label={isEditing ? "Edit Banner" : "Add New Banner"}
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
        </form>
      </div>
    </div>
  );
}

export default HeroBannerForm;
