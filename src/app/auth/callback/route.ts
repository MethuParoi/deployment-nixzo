import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get("code");
//   // if "next" is in param, use it as the redirect URL
//   const next = searchParams.get("next") ?? "/";

//   if (code) {
//     const cookieStore = cookies();
//     const supabase = createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           get(name: string) {
//             return cookieStore.get(name)?.value;
//           },
//           set(name: string, value: string, options: CookieOptions) {
//             cookieStore.set({ name, value, ...options });
//           },
//           remove(name: string, options: CookieOptions) {
//             cookieStore.delete({ name, ...options });
//           },
//         },
//       }
//     );
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     if (!error) {
//       // changed
//       return NextResponse.redirect(`${process.env.NEXT_PUBLIC_REDIRECT_URL}`);
//       // return NextResponse.redirect(`${origin}`);
//     }
//   }

//   // return the user to an error page with instructions
//   return NextResponse.redirect(`${process.env.NEXT_PUBLIC_REDIRECT_URL}`);
//   // return NextResponse.redirect(`${origin}/auth/auth-code-error`);
// }

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
      const cookieStore = cookies();
      const supabase = createServerClient(
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

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Exchange code error:", error);
        return NextResponse.redirect(
          new URL("/auth/auth-code-error", request.url)
        );
      }

      // Successful login redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect to error page if no code is present
    return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
  } catch (err) {
    console.error("Callback handler error:", err);
    return NextResponse.error(); // Gracefully handle server error
  }
}

