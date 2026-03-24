import axios from 'axios'
import { API_PREFIX } from './apiConfig'

const axiosClient = axios.create({
  baseURL: API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor cho Request: Gắn token nếu có
axiosClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor cho Response: Xử lý dữ liệu trả về hoặc lỗi chung
axiosClient.interceptors.response.use(
  (response) => {
    // Chỉ trả về data của response
    if (response && response.data) {
      return response.data
    }
    return response
  },
  (error) => {
    // Xử lý lỗi tập trung ở đây (ví dụ: thông báo lỗi, xử lý khi token hết hạn)
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default axiosClient