"use server";

import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string) {
          cookieStore.set({ name, value: "", maxAge: -1 });
        },
      },
    }
  );
}

//------------------------------------

// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export async function supabaseServerClient() {
//   const cookieStore = cookies();

//   return createServerClient({
//     supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     cookieOptions: {
//       // Specify the domain explicitly to ensure cookies are consistent across attempts
//       domain: "nixzobd.com",
//       sameSite: "Lax", // Helps with proper cross-domain cookie setting
//     },
//     getCookie(name) {
//       return cookieStore.get(name)?.value;
//     },
//     setCookie(name, value, options) {
//       cookieStore.set({ name, value, ...options });
//     },
//     removeCookie(name) {
//       cookieStore.set({ name, value: "", maxAge: -1 });
//     },
//   });
// }
