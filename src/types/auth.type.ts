import { EnumGender } from "../constants/enum"

export type ClaimsModel = {
  sub?: string
  email?: string
  role?: string
  jti?: string
}

export type AuthModel = {
  accessToken: string
  refreshToken: string
}

export type LoginModel = {
  email: string
  password: string
}

export type RegisterModel = {
  email: string
  password: string
  confirmPassword: string
  otp: string
  fullName: string
  gender: EnumGender
  dateOfBirth: string
  phoneNumber: string
  citizenId: string
}

export type VerifyPasswordModel = {
  email: string
  otp: string
  newPassword: string
  confirmNewPassword: string
}

export type ChangePasswordModel = {
  otp?: string
  oldPassword: string
  newPassword: string
  confirmPassword: string
}