"use client";

import React, { use, useEffect, useState } from "react";
import Button from "../ui/Button";

function SizeButtons({ setSelectedSize, selectedSize }) {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSize) {
      setActiveButton(selectedSize);
    }
  }, [selectedSize]);

  const handleClick = (label: string) => {
    setActiveButton(label);
    if (setSelectedSize) {
      setSelectedSize(label); // Update the selected size
    }
    // console.log("Size selected:", label);
  };

  return (
    <div className="flex items-center gap-x-5">
      <Button
        label="M"
        type="size"
        onClick={() => handleClick("M")}
        isActive={activeButton === "M"}
        setActiveButton={undefined}
      />
      <Button
        label="L"
        type="size"
        onClick={() => handleClick("L")}
        isActive={activeButton === "L"}
        setActiveButton={undefined}
      />
      <Button
        label="XL"
        type="size"
        onClick={() => {
          handleClick("XL");
        }}
        isActive={activeButton === "XL"}
        setActiveButton={undefined}
      />
      <Button
        label="XXL"
        type="size"
        onClick={() => {
          handleClick("XXL");
        }}
        isActive={activeButton === "XXL"}
        setActiveButton={undefined}
      />
    </div>
  );
}

export default SizeButtons;
