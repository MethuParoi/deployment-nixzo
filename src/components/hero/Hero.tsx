"use client";

import React, { useEffect, useState, Suspense } from "react";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import Image from "next/image";
import { useDispatch } from "react-redux";
import {
  setUser,
  setUserAvatar,
  setUserName,
} from "@/store/features/auth/userSlice";
import { getBanner } from "../../../utils/manageHeroBanner";

const localSlides = [
  {
    src: "/images/hero/hero1.jpg",
    title: "Slide 1",
    description: "This is the description of slide 1",
  },
  {
    src: "/images/hero/hero2.jpg",
    title: "Slide 2",
    description: "This is the description of slide 2",
  },
  {
    src: "/images/hero/hero3.jpg",
    title: "Slide 3",
    description: "This is the description of slide 3",
  },
  {
    src: "/images/hero/m-hero-1.jpg",
    title: "Slide 4",
    description: "This is the description of slide 1",
  },
  {
    src: "/images/hero/m-hero-2.jpg",
    title: "Slide 5",
    description: "This is the description of slide 2",
  },
  {
    src: "/images/hero/m-hero-1.jpg",
    title: "Slide 6",
    description: "This is the description of slide 1",
  },
];

const UserFetcher = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      const userResponse = await fetch("/api/supabase-client");
      const userData = await userResponse.json();
      if (userData.user) {
        dispatch(setUser(userData.user.id));
        dispatch(setUserName(userData.user.user_metadata.full_name));
        dispatch(setUserAvatar(userData.user.user_metadata.avatar_url));
      }
    };

    fetchUserData();
  }, [dispatch]);

  return null;
};

const Hero = () => {
  const [page, setPage] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);
  const [bannerImages, setBannerImages] = useState(localSlides);

  useEffect(() => {
    const fetchInitialData = async () => {
      const bannerResponse = await getBanner();
      console.log("banner response", bannerResponse);
      const img = bannerResponse[0]?.banner_image_link;
      const image = img ? img.split(",") : [];
      if (bannerResponse.length > 0) {
        setBannerImages(
          image.map((item) => ({
            src: item,
            title: "",
            description: "",
          }))
        );
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const int = setInterval(() => {
      setPage((prev) => (prev + 1 >= 3 ? 0 : prev + 1));
      setMobilePage((prev) => (prev + 1 >= 3 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(int);
  }, []);

  const handlePrevPage = () => {
    setPage((prev) => (prev - 1 < 0 ? 2 : prev - 1));
    setMobilePage((prev) => (prev - 1 < 0 ? 2 : prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => (prev + 1 >= 3 ? 0 : prev + 1));
    setMobilePage((prev) => (prev + 1 >= 3 ? 0 : prev + 1));
  };

  // Remove any double slashes
  const sanitizeUrl = (url) => {
    return url ? url.replace(/([^:]\/)\/+/g, "$1") : "";
  };

  const getImageSrc = () => {
    return sanitizeUrl(bannerImages[page]?.src || localSlides[page]?.src);
  };

  const getMobileImageSrc = () => {
    return sanitizeUrl(
      bannerImages[mobilePage + 3]?.src || localSlides[mobilePage + 3]?.src
    );
  };

  return (
    <section className="h-[55vh] md:min-h-[78vh] grid lg:grid-rows-5">
      <div className="lg:row-span-3">
        <div className="relative h-[40rem] md:h-[53rem] w-full">
          {" "}
          {/* Adjust mobile height */}
          {/* Desktop */}
          <link rel="preload" as="image" href={localSlides[0].src} />
          <div className="hidden md:block">
            <Image
              src={getImageSrc()}
              alt={`Slide ${page + 1}`}
              fill={true}
              objectFit="contain" // Ensure full cover to fill container
              className="absolute inset-0"
              loading="lazy"
              unoptimized={true}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              onClick={handlePrevPage}
              className="z-10 absolute bottom-1/2 -left-5 md:left-10" // Adjust position for better visibility
            >
              <button className="bg-gray-800 bg-opacity-60 text-white p-6 rounded-full flex justify-center items-center">
                <FaLessThan size={20} />
              </button>
            </div>

            <div
              onClick={handleNextPage}
              className="z-10 absolute bottom-1/2 -right-5 md:right-10" // Adjust position for better visibility
            >
              <button className="bg-gray-800 bg-opacity-60 text-white p-6 rounded-full flex justify-center items-center">
                <FaGreaterThan size={20} />
              </button>
            </div>
          </div>
          {/* Mobile */}
          <link rel="preload" as="image" href={localSlides[0].src} />
          <div className="block w-full md:hidden">
            <Image
              src={getMobileImageSrc()}
              alt={`Slide ${mobilePage + 1}`}
              fill={true}
              objectFit="contain" // Make sure the image fills the mobile screen without cropping
              className=" inset-0"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              onClick={handlePrevPage}
              className="z-10 absolute bottom-1/2 left-4" // Adjust button position for mobile
            >
              <button className="bg-gray-800 bg-opacity-60 text-white p-4 rounded-full flex justify-center items-center">
                <FaLessThan size={13} />
              </button>
            </div>

            <div
              onClick={handleNextPage}
              className="z-10 absolute bottom-1/2 right-4" // Adjust button position for mobile
            >
              <button className="bg-gray-800 bg-opacity-60 text-white p-4 rounded-full flex justify-center items-center">
                <FaGreaterThan size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<div>Loading user data...</div>}>
        <UserFetcher />
      </Suspense>
    </section>
  );
};

export default Hero;

