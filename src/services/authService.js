import axiosClient from '../utils/axiosClient'

const authService = {
  login: (data) => {
    return axiosClient.post('/auth/login', data)
  },
  registerStep1: (data) => {
    return axiosClient.post('/auth/register/step1', data)
  },
  verifyOtp: (data) => {
    return axiosClient.post('/auth/register/verify-otp', data)
  },
  registerFinal: (data) => {
    return axiosClient.post('/auth/register/final', data)
  }
}

export default authService
