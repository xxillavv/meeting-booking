import "server-only";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ACCESS_TOKEN_COOKIE } from "./constants";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export const serverFetch = async <T>(path: string): Promise<T> => {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    redirect("/login");
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers: { Cookie: `${ACCESS_TOKEN_COOKIE}=${token}` },
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Не вдалося завантажити дані");
  }

  return response.json();
};
