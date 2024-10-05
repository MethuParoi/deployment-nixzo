import React, { useEffect, useState } from "react";

function ColorDropdown({
  selectedColor,
  setSelectedColor,
  productColor,
  allcolors,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  //   console.log("colors", allcolors.productColor);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !(event.target as HTMLElement).closest("#dropdownButton") &&
        !(event.target as HTMLElement).closest("#dropdown")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  //handle color selection
  //   const colors = productColor.split(", ");
  const colors = productColor
    ? productColor.split(", ")
    : allcolors
    ? allcolors.productColor && allcolors.productColor.split(", ")
    : [];


  const handleColor = (event) => {
    setSelectedColor(event.target.textContent);
    setIsOpen(false);
  };

  return (
    <div className="relative md:absolute">
      <button
        id="dropdownButton"
        onClick={toggleDropdown}
        className="text-primary bg-accent hover:bg-accent-dark focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[1.6rem] md:text-[1.8rem] px-3 md:px-5 py-2.5 w-[13rem] md:w-[15rem] text-center inline-flex items-center justify-center"
        type="button"
      >
        {selectedColor || "Select Color"}{" "}
        <svg
          className="w-7.5 h-3.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          id="dropdown"
          className="z-10 bg-gray-300 divide-y divide-gray-100 rounded-lg shadow w-[13rem] md:w-[15rem]"
        >
          <ul
            className="py-2 text-sm text-gray-700"
            aria-labelledby="dropdownButton"
          >
            {colors &&
              colors.map((color) => (
                <li key={color}>
                  <button
                    onClick={handleColor}
                    className="block text-[1.6rem] text-center md:text-[1.8rem] text-secondary-dark font-medium px-3 md:px-5 py-2.5 w-[13rem] md:w-[15rem] hover:bg-accent hover:text-primary-light"
                  >
                    {color}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ColorDropdown;
