import { CookieOptions } from "express";

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const ACCESS_TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000;
export const SALT_ROUNDS = 10;

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: ACCESS_TOKEN_MAX_AGE_MS,
}

export const CLEAR_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
}