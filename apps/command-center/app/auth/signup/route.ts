import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  if (!name || !email || password.length < 8)
    return NextResponse.redirect(new URL("/signup?error=invalid_input", request.url), 303);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    const code = error.message.toLowerCase().includes("already") ? "account_exists" : "signup_failed";
    return NextResponse.redirect(new URL("/signup?error=" + code, request.url), 303);
  }

  if (data.session) return NextResponse.redirect(new URL("/companies/new", request.url), 303);
  return NextResponse.redirect(new URL("/signup?created=1", request.url), 303);
}