import { getBroswerData } from "@/app/api/[username]/route";
import { NextResponse } from "next/server";

export async function GET() {
    const browserData = await getBroswerData();

    return NextResponse.json({ ok: true });
}
