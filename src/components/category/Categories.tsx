import React from 'react';
import LpProductCard from '../ui/CategoryCard';
import t1 from '../../../public/images/categories/trendy-1.jpg';
import t2 from '../../../public/images/categories/trendy-2.jpg';
import t3 from '../../../public/images/categories/trendy-3.jpg';
import c1 from '../../../public/images/categories/classic-1.jpg';
import c2 from '../../../public/images/categories/classic-2.jpg';
import c3 from '../../../public/images/categories/classic-3.jpg';
import m1 from '../../../public/images/categories/mens-1.jpg';
import m2 from '../../../public/images/categories/mens-2.jpg';
import m3 from '../../../public/images/categories/mens-3.jpg';
import l1 from '../../../public/images/categories/ladies-1.jpg';
import l2 from '../../../public/images/categories/ladies-2.jpg';
import l3 from '../../../public/images/categories/ladies-3.jpg';
import CategoryCard from '../ui/CategoryCard';
import CoreFeatureCard from '../ui/CoreFeatureCard';
import { FaShippingFast, FaHeadset } from 'react-icons/fa'; // Correcting import path
import { BsCashCoin } from "react-icons/bs";


const features = [
  {
    icon: <FaShippingFast />, // Fastest Shipping icon
    title: "Fastest Shipping",
    description: "Get delivered in the shortest time.",
  },
  {
    icon: <BsCashCoin />, // Cash Return icon
    title: "Cash Return",
    description: "Easy and hassle-free returns.",
  },
  {
    icon: <FaHeadset />, // 24/7 Support icon
    title: "24/7 Support",
    description: "Our team is available 24/7 by you.",
  },
];

const products = [
  {
    title: "Regular t-shirt",
    description:
      "Elegance meets practicality in our collection of bags—crafted for every journey..",
    images: [t1, t2, t3],
    btnLink: "/products",
  },
  {
    title: "Super Saver Combo",
    description:
      "Experience sophistication with our wallets—where timeless design meets everyday function..",
    images: [c1, c2, c3],
    btnLink: "/products",
  },
  {
    title: "Drop Shoulder t-shirt",
    description:
      "Step confidently in our shoes—designed for comfort and style with every stride.",
    images: [m1, m2, m3],
    btnLink: "/products",
  },
  {
    title: "Premium Polo",
    description:
      "Step confidently in our shoes—designed for comfort and style with every stride.",
    images: [l1, l2, l3],
    btnLink: "/products",
  },
  {
    title: "Festival",
    description:
      "Elegance meets practicality in our collection of bags—crafted for every journey..",
    images: [t1, t2, t3],
    btnLink: "/products",
  },
  /*
  {
    title: "Hoodi",
    description:
      "Experience sophistication with our wallets—where timeless design meets everyday function..",
    images: [c1, c2, c3],
    btnLink: "/products",
  },
  
  {
    title: "Jersey",
    description:
      "Elegance meets practicality in our collection of bags—crafted for every journey..",
    images: [t1, t2, t3],
    btnLink: "/products",
  },
  {
    title: "Shirt",
    description:
      "Experience sophistication with our wallets—where timeless design meets everyday function..",
    images: [c1, c2, c3],
    btnLink: "/products",
  },
  {
    title: "Short kurta",
    description:
      "Step confidently in our shoes—designed for comfort and style with every stride.",
    images: [m1, m2, m3],
    btnLink: "/products",
  },
  {
    title: "Dhuti",
    description:
      "Step confidently in our shoes—designed for comfort and style with every stride.",
    images: [l1, l2, l3],
    btnLink: "/products",
  },
   {
    title: "Punjabi",
    description:
      "Step confidently in our shoes—designed for comfort and style with every stride.",
    images: [l1, l2, l3],
    btnLink: "/products",
  },
  */
  // Add more product objects as needed
];

const Categories = () => {
  return (
    <section className="bg-primary mt-[2rem] 2xl:mt-0" id="category">
      <div className="container mx-auto px-4 py-14 flex flex-col items-center">
        <h2 className="text-5xl font-bold text-center text-accent mb-4">
          Shop by Category
        </h2>
        <hr className="w-[26rem] h-1 bg-accent mx-auto mb-6" />
        <p className="text-center text-[1.6rem] text-secondary mb-8">
          Explore our premium collection of handpicked items designed for trend
          and style.
        </p>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-2 items-center place-items-center ">
          {/* <div className="flex flex-wrap gap-2 justify-center max-w-[100rem]"> }
          {products.map((product, index) => (
            <CategoryCard
              key={index}
              title={product.title}
              images={product.images}
              btnLink={product.btnLink}
            />
          ))}
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-5 md:gap-y-10 items-center place-items-center">
          {products.map((product, index) => (
            <CategoryCard
              key={index}
              title={product.title}
              images={product.images}
              btnLink={product.btnLink}
              className={`${index === 3
                ? "lg:ml-[30rem] xl:ml-0"
                : index === 4
                  ? "md:ml-[35rem] xl:ml-[38rem] xl:col-span-1 xl:col-start-2"
                  : ""
                }`}
            />
          ))}
        </div>
      </div>
      <div className=" lg:row-span-2">
        <div className="container mx-auto py-24">
          {/* <div className='p-10 md:p-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'> */}
          <div className="flex flex-wrap gap-5 py-5 md:py-10 justify-center items-center">
            {features.map((feature, index) => (
              <div key={index} className="h-full grid place-items-center">
                <CoreFeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;