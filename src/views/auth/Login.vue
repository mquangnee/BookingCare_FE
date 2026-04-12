<template>
  <div class="split-layout">
    <div class="auth-banner">
      <router-link to="/home" class="floating-back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
          stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Quay lại trang chủ
      </router-link>
      <div class="banner-overlay"></div>
      <div class="banner-content fade-in-late">
        <h2 class="banner-title">Chăm sóc sức khỏe<br />toàn diện & tiện lợi</h2>
        <p class="banner-subtitle">
          Đặt lịch khám nhanh chóng với hàng ngàn bác sĩ chuyên khoa giỏi,
          bảo mật thông tin tuyệt đối.
        </p>
      </div>
    </div>

    <div class="auth-section">
      <div class="auth-card">
        <div class="brand-header">
          <img src="https://storage.googleapis.com/bookingcare/%24RKY6O8O.png" alt="BookingCare Logo"
            class="brand-logo" />
        </div>

        <h2 class="auth-title">Đăng nhập</h2>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group slide-up-1">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="Ví dụ: hotro@bookingcare.vn" required
              :disabled="isLoading" />
          </div>

          <div class="form-group slide-up-2">
            <div class="password-label-group">
              <label for="password">Mật khẩu</label>
              <router-link to="/forgot-password" class="forgot-password">Quên mật khẩu?</router-link>
            </div>
            <input type="password" id="password" v-model="password" placeholder="Nhập mật khẩu của bạn" required
              :disabled="isLoading" />
          </div>

          <button type="submit" class="btn-primary slide-up-3" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>Đăng nhập</span>
          </button>
        </form>

        <div class="auth-links fade-in-late">
          <span>Chưa có tài khoản? <router-link to="/register" class="text-link">Đăng ký ngay</router-link></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { notifySuccess, notifyError, messageFromCaught } from '../../utils/notify'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  if (!email.value || !password.value) return;

  try {
    isLoading.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    await authStore.login({
      email: email.value,
      password: password.value
    })

    const role = authStore.getClaimsModel().role;
    switch (role) {
      case 'Admin':
        router.push('/admin')
        break
      case 'Doctor':
        router.push('/doctor/examination')
        break
      // case 'Receptionist':
      //   router.push('/receptionist/dashboard')
      //   break
      case 'Patient':
        router.push('/home')
        break
      default:
        router.push('/unauthorized')
        break
    }
    notifySuccess('Đăng nhập thành công')
    await new Promise((resolve) => setTimeout(resolve, 1500))
  } catch (error) {
    console.error(error);
    notifyError(messageFromCaught(error));
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.split-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #F4F7F9;
  position: relative;
  overflow: hidden;
}

.auth-banner {
  flex: 1.1;
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=2000&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 60px;
  overflow: hidden;
  animation: bannerFadeScale 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes bannerFadeScale {
  from {
    opacity: 0;
    transform: scale(1.05);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.1) 100%);
  z-index: 1;
  animation: fadeIn 1.5s ease forwards;
}

.banner-content {
  position: relative;
  z-index: 2;
  color: #fff;
  max-width: 500px;
}

.banner-title {
  font-size: 38px;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.banner-subtitle {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.95;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
}

.auth-section {
  width: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #ffffff;
  overflow-y: auto;
}

.auth-card {
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  padding: 50px 40px;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.04), 0 5px 15px rgba(0, 0, 0, 0.02);
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.brand-header {
  text-align: center;
  margin-bottom: 35px;
}

.brand-logo {
  max-width: 220px;
  height: auto;
  animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.auth-title {
  color: #000;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: left;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 10px;
}

.password-label-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  font-size: 13.5px;
  color: #000;
  text-decoration: underline;
  font-weight: 500;
  transition: opacity 0.2s;
}

.forgot-password:hover {
  opacity: 0.6;
}

input {
  width: 100%;
  padding: 15px 18px;
  font-size: 15.5px;
  color: #000;
  background-color: #fff;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

input::placeholder {
  color: #999;
}

input:focus {
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
}

input:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.btn-primary {
  width: 100%;
  padding: 15px;
  background-color: #45C3D2;
  color: #fff;
  font-size: 16.5px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 54px;
  font-family: inherit;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3ba3b0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(69, 195, 210, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s ease-in-out infinite;
}

.auth-links {
  margin-top: 35px;
  text-align: center;
  font-size: 15px;
  color: #333;
}

.text-link {
  color: #000;
  text-decoration: underline;
  font-weight: 700;
  margin-left: 4px;
  transition: opacity 0.2s;
}

.text-link:hover {
  opacity: 0.6;
}

.floating-back-link {
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 17px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
}

.floating-back-link svg {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.floating-back-link:hover {
  color: #ffffff;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
}

.floating-back-link:hover svg {
  transform: translateX(-5px);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8));
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up-1 {
  animation: fadeInUp 0.5s ease forwards 0.1s;
  opacity: 0;
}

.slide-up-2 {
  animation: fadeInUp 0.5s ease forwards 0.2s;
  opacity: 0;
}

.slide-up-3 {
  animation: fadeInUp 0.5s ease forwards 0.3s;
  opacity: 0;
}

.fade-in-late {
  animation: fadeInUp 0.8s ease forwards 0.5s;
  opacity: 0;
}

@media (max-width: 900px) {
  .auth-banner {
    display: none;
  }

  .auth-section {
    max-width: 100%;
    padding: 20px;
  }

  .auth-card {
    padding: 40px 30px;
  }

  .floating-back-link {
    top: 20px;
    left: 20px;
    color: #4b5563;
    text-shadow: none;
  }

  .floating-back-link svg {
    filter: none;
  }

  .floating-back-link:hover {
    color: #45C3D2;
    text-shadow: none;
  }
}
</style>