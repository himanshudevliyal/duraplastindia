import { endpoints } from "@/utils/endpoints";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("token")?.value;
    const refresh_token = cookieStore.get("refresh_token")?.value;

    // If no access token but has refresh token, refresh it
    if (!token && refresh_token) {
      try {
        const refreshResponse = await axios.post(
          `${API_URL}${endpoints.auth.refresh}`,
          { refresh_token },
          { headers: { "Content-Type": "application/json" } },
        );

        const newTokenData = refreshResponse.data;
        if (newTokenData?.token) {
          token = newTokenData.token;

          const maxAge = Math.floor(
            (new Date(newTokenData.expire_time).getTime() - Date.now()) / 1000,
          );

          // Set new token in cookies
          cookieStore.set("token", token, {
            path: "/",
            maxAge: newTokenData.expire_time,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        } else {
          throw new Error("No token in refresh response");
        }
      } catch (refreshError) {
        console.error(
          "Token refresh failed:",
          refreshError?.response?.data || refreshError?.message,
        );
        cookieStore.delete("token");
        cookieStore.delete("refresh_token");
        return NextResponse.json(
          { message: "Refresh token expired, please login again" },
          { status: 401 },
        );
      }
    }

    // If still no token after refresh attempt
    if (!token) {
      return NextResponse.json(
        { message: "No user logged in" },
        { status: 401 },
      );
    }

    // Fetch user profile with valid token
    try {
      const res = await axios.get(`${API_URL}${endpoints.profile}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return NextResponse.json({ user: res.data }, { status: 200 });
    } catch (profileError) {
      console.error("Profile fetch error:", profileError?.response?.status);

      // If profile request also fails with 401, tokens are invalid
      if (profileError?.response?.status === 401) {
        cookieStore.delete("token");
        cookieStore.delete("refresh_token");
      }

      return NextResponse.json(
        {
          message:
            profileError?.response?.data?.message ?? "Failed to fetch profile",
        },
        { status: profileError?.response?.status || 500 },
      );
    }
  } catch (error) {
    console.error("Profile route error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
