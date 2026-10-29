export type TRegisterUser = {
  name: string
  email: string
  password: string
}

export type TLoginUser = Omit<TRegisterUser, 'name'>