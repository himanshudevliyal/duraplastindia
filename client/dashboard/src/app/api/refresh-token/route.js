import { endpoints } from "@/utils/endpoints";
import axios from "axios";
import moment from "moment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(Request) {
  try {
    const cookieStore = await cookies();
    const refresh_token = cookieStore.get("refresh_token")?.value;

    if (!refresh_token) {
      return NextResponse.json(
        { error: "Refresh token missing" },
        { status: 401 },
      );
    }

    // Call backend to refresh token
    const response = await axios.post(
      `${API_URL}${endpoints.auth.refresh}`,
      { refresh_token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const { token, expire_time } = response.data;

    if (!token) {
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: 401 },
      );
    }

    // Set the new token in httpOnly cookie
    const maxAge = Math.floor(
      (new Date(expire_time).getTime() - Date.now()) / 1000,
    );
    console.log(moment(expire_time).format());

    cookieStore.set("token", token, {
      path: "/",
      maxAge: expire_time,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Return token so client can also store in localStorage
    return NextResponse.json(
      {
        token,
        expire_time,
        message: "Token refreshed successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Refresh token error:",
      error?.response?.data || error?.message,
    );

    // Clear cookies on failure
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("refresh_token");

    return NextResponse.json(
      {
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Token refresh failed",
      },
      { status: error?.response?.status || error?.status || 500 },
    );
  }
}
