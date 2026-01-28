import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    
    // Delete both tokens
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json({ success: true, message: "Logged out successfully" });
}