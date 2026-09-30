import { NextResponse } from "next/server";
import { createCompany } from "../../../lib/company-creation";

export async function POST(request: Request) {
  try {
    const input = await request.json();
    if (!input?.name || !input?.description || !input?.targetCustomer || !input?.desiredOutcome) {
      return NextResponse.json({ error: "Name, description, target customer and desired outcome are required." }, { status: 400 });
    }
    const result = await createCompany(input);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Company creation failed." }, { status: 500 });
  }
}
