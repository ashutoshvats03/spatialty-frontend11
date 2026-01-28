"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // On mount, check if we have a user session via an API route
        const checkAuth = async () => {
            try {
                // You can create a simple /api/auth/me route to verify current cookie
                const response = await axios.get("api/auth/me");
                if (response.data.user) {
                    setUser(response.data.user);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        try {
            // 1. Call your INTERNAL Next.js API (which handles the Django call + cookies)
            const response = await axios.post("api/auth/login", {
                username,
                password
            });

            // 2. Extract the user and profile data returned by your Next.js API
            const { user, data } = response.data;

            setUser(user);
            setData(data);

            // 3. Redirect the user
            router.push("/wayVision1");
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            alert("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await axios.post("api/auth/logout");
        setUser(null);
        setData([]);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, data, users }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;