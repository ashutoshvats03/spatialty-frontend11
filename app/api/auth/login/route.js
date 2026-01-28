import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
    const HOST = process.env.NEXT_PUBLIC_HOST;
    
    try {
        const { username, password } = await request.json();

        // 1. Call Django Backend
        const response = await axios.post(`${HOST}/login/`, {
            username,
            password
        });

        const { access, refresh, user, data } = response.data;
        const cookieStore = await cookies();

        // 2. Set Access Token (15 min)
        cookieStore.set("access_token", access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15,
        });

        // 3. Set Refresh Token (7 days)
        cookieStore.set("refresh_token", refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({ user, data });
    } catch (error) {
        return NextResponse.json(
            { error: error.response?.data || "Authentication failed" },
            { status: error.response?.status || 401 }
        );
    }
}