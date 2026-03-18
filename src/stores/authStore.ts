import { reactive, readonly, computed } from 'vue'
import { doLogin, doRegistere, doSendRegisterOtp, doSendVerifyPasswordOtp, doVerifyPassword } from '../api/auth'
import type { AuthModel, LoginModel, RegisterModel, VerifyPasswordModel } from '../api/auth'

// === MODELS, CONSTANTS ===
export type ClaimsModel = {
  sub?: string
  email?: string
  role?: string
  jti?: string
}

const state = reactive({
  accessToken: localStorage.getItem('accessToken') || '',
  refreshToken: localStorage.getItem('refreshToken') || ''
})

const isAuthenticated = computed(() => !!state.accessToken)

// === FUNCTIONS ===
function setTokens(tokens: Partial<AuthModel>): void {
  state.accessToken = tokens.accessToken || ''
  state.refreshToken = tokens.refreshToken || ''
  if (state.accessToken) {
    localStorage.setItem('accessToken', state.accessToken)
  } else {
    localStorage.removeItem('accessToken')
  }
  if (state.refreshToken) {
    localStorage.setItem('refreshToken', state.refreshToken)
  } else {
    localStorage.removeItem('refreshToken')
  }
}

function parseJwtPayload(token: string): Record<string, string> {
  if (!token) {
    return {}
  }
  const parts = token.split('.')
  if (parts.length < 2) {
    return {}
  }
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)
    return JSON.parse(json) as Record<string, string>
  } catch {
    return {}
  }
}

function getClaims(): Array<{ type: string; value: string }> {
  const payload = parseJwtPayload(state.accessToken)
  return Object.entries(payload).map(([type, value]) => ({
    type,
    value
  }))
}

function getClaimsModel(): ClaimsModel {
  const payload = parseJwtPayload(state.accessToken)
  return {
    sub: payload.sub,
    email: payload.email,
    role: payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    jti: payload.jti
  }
}

async function login(data: LoginModel): Promise<AuthModel> {
  const response = await doLogin(data)
  if (response) {
    setTokens(response)
  }
  return response
}

function sendRegisterOtp(email: string): Promise<boolean> {
  return doSendRegisterOtp(email)
}

function register(data: RegisterModel): Promise<AuthModel> {
  return doRegistere(data)
}

function sendVerifyPasswordOtp(email: string): Promise<boolean> {
  return doSendVerifyPasswordOtp(email)
}

function verifyPassword(data: VerifyPasswordModel): Promise<boolean> {
  return doVerifyPassword(data)
}
function logout(): void {
  setTokens({ accessToken: '', refreshToken: '' })
}

export const useAuthStore = () => ({
  state: readonly(state),
  isAuthenticated,
  setTokens,
  login,
  sendRegisterOtp,
  register,
  getClaims,
  getClaimsModel,
  logout,
  sendVerifyPasswordOtp,
  verifyPassword
})
