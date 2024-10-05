import React, { Suspense } from "react";

const Hero = React.lazy(() => import("@/components/hero/Hero"));
const Categories = React.lazy(() => import("@/components/category/Categories"));
const MemoizedHero = React.memo(Hero);
const MemoizedCategories = React.memo(Categories);
// const worker = new Worker(new URL("../utils/worker.js", import.meta.url));

const HomePage = () => {
  return (
    <main>
      <Suspense fallback={<div>Loading Hero...</div>}>
        <MemoizedHero />
      </Suspense>
      <div className="mt-[-8rem]">
        <Suspense fallback={<div>Loading Categories...</div>}>
          <MemoizedCategories />
        </Suspense>
      </div>
    </main>
  );
};

export default HomePage;

// import Hero from "@/components/hero/Hero";
// import Categories from "@/components/category/Categories";

// import React from "react";

// const HomePage = () => {
//   return (
//     <main>
//       <Hero />
//       <div className="mt-[-8rem]">
//         <Categories />
//       </div>
//     </main>
//   );
// };

// export default HomePage
