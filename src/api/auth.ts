import { ErrorMessageDictionary } from '../constants/ErrorMessageDictionary'
import { EnumGender } from '../constants/enum'
import { buildApiUrl } from '../utils/apiConfig'

//=== Models ===
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

//=== API ===
export async function doLogin(body: LoginModel): Promise<AuthModel> {
  const url = buildApiUrl('/auth/login')

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const errorData = await res.json()
    const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
    throw new Error(errorMessage)
  }
  return (await res.json()).result as Promise<AuthModel>
}

export async function doRegistere(body: RegisterModel): Promise<AuthModel> {
  const url = buildApiUrl('/auth/register')

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const errorData = await res.json()
    const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
    throw new Error(errorMessage)
  }
  return (await res.json()).result as Promise<AuthModel>
}

export async function doSendRegisterOtp(email: string): Promise<boolean> {
  const url = buildApiUrl('/auth/send-register-otp')

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) {
    const errorData = await res.json()
    const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
    throw new Error(errorMessage)
  }
  return (await res.json()).result as boolean
}

export async function doSendVerifyPasswordOtp(email: string): Promise<boolean> {
  const url = buildApiUrl('/auth/send-verify-password-otp')

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) {
    const errorData = await res.json()
    const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
    throw new Error(errorMessage)
  }
  return (await res.json()).result as boolean
}

export async function doVerifyPassword(body: VerifyPasswordModel): Promise<boolean> {
  const url = buildApiUrl('/auth/verify-password')

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const errorData = await res.json()
    const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
    throw new Error(errorMessage)
  }
  return (await res.json()).result as Promise<boolean>
}
