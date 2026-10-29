import { api } from "@/lib/axios"
import { TLoginUser, TRegisterUser } from "./auth.types"

export const registerUser = async (body: TRegisterUser): Promise<void> => {
  await api.post('/auth/register', body)
}

export const loginUser = async (body: TLoginUser): Promise<void> => {
  await api.post('/auth/login', body)
}

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout')
}