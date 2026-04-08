import { ErrorMessageDictionary } from '../constants/errorMessageDictionary'
import { buildApiUrl } from '../utils/apiConfig'
import { AuthModel, ChangePasswordModel, LoginModel, RegisterModel, VerifyPasswordModel } from '../types/index'

// === Constants ===
const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken')
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

export async function doChangePassword(body: ChangePasswordModel): Promise<boolean> {
  const url = buildApiUrl('/auth/change-password')

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const errorData = await res.json()
    const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
    throw new Error(errorMessage)
  }
  return true
}

export async function doSendChangePasswordOtp (data: ChangePasswordModel): Promise<boolean> {
  const url = buildApiUrl('/auth/send-change-password')

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json()
    const errorMessage = ErrorMessageDictionary[errorData.errorMessages[0].errorCode]
    throw new Error(errorMessage)
  }
  return true
}