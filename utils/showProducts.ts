import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getProducts(initialProducts) {
  let query = supabase.from("products_table").select("*");

  if (initialProducts === "initial") {
    query = query.order("created_at", { ascending: false }).limit(10);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("An error occurred while fetching products");
  }

  return data;
}

