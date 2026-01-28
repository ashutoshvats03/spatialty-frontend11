import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
    const HOST = process.env.NEXT_PUBLIC_HOST;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        // Validate token by fetching profile from Django
        const response = await axios.get(`${HOST}/profile/`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return NextResponse.json({ 
            user: response.data.user, 
            data: response.data.data 
        });
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}