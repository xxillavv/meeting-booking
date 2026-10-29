import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { TUser } from "@/hooks/auth/auth.types";
import { ACCESS_TOKEN_COOKIE } from "./constants";

export const getMe = async (): Promise<TUser> => {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    redirect("/login");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: { Cookie: `${ACCESS_TOKEN_COOKIE}=${token}` },
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error("Не вдалося завантажити користувача");
  }

  return response.json();
};
