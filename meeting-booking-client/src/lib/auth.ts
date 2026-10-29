import "server-only";
import type { TUser } from "@/hooks/auth/auth.types";
import { serverFetch } from "./server-api";

export const getMe = () => serverFetch<TUser>("/users/me");
