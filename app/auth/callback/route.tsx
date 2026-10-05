import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/dashboard";
  if (!next.startsWith("/")) next = "/dashboard"; // avoid open redirects

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: p } = await supabase
        .from("profiles")
        .select("skills")
        .eq("id", user!.id)
        .maybeSingle();

      const onboarded = (p?.skills?.length ?? 0) > 0;
      return NextResponse.redirect(`${origin}${onboarded ? next : "/onboarding"}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth`);
}