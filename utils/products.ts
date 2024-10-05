import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
let cachedProducts = null;

//categories:
// regulart-shirt
// supersavercombo
// dropshouldert-shirt
// premium-polo
//festival

export async function getSortedProducts(categories: string[]) {
  console.log("Fetching products for categories:", categories); // Debugging log
  const { data, error } = await supabase
    .from("products_table")
    .select("*")
    .in("productCategory", categories);
  if (error) {
    console.error(error);
    throw new Error("An error occurred while fetching product data");
  }
  // console.log("Fetched product data:", data);
  return data;
}


export async function getProducts(category) {
  const { data, error } = await supabase
    .from("products_table")
    .select("*")
    .eq("productCategory", category);
  if (error) {
    console.error(error);
    throw new Error("An error occurred while fetching product data");
  }
  // console.log("Fetched coupon data:", data);
  return data;
}

export async function getProductDetails(productId) {
  const { data, error } = await supabase
    .from("products_table")
    .select("*")
    .eq("product_id", productId);
  if (error) {
    console.error(error);
    throw new Error("An error occurred while fetching product details");
  }
  return data;
}

//fetch product colors
export async function getProductColors(productId) {
  const { data, error } = await supabase
    .from("products_table")
    .select("productColor")
    .eq("product_id", productId);
  if (error) {
    console.error(error);
    throw new Error("An error occurred while fetching product details");
  }
  return data;
}

//fetch categories
export async function getCategories() {
  const { data, error } = await supabase
    .from("products_table")
    .select("productCategory");
  if (error) {
    console.error(error);
    throw new Error("An error occurred while fetching categories");
  }
  // console.log("Fetched coupon data:", data);
  return data;
}
