export type TRegisterUser = {
  name: string
  email: string
  password: string
}

export type TLoginUser = Omit<TRegisterUser, 'name'>

export type TUser = {
  id: string
  name: string
  email: string
  createdAt: string
}
