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
        <h2 class="banner-title">Đăng ký thành viên<br />Hệ thống BookingCare</h2>
        <p class="banner-subtitle">
          Khởi tạo hồ sơ sức khỏe điện tử cá nhân để bắt đầu đặt lịch khám
          và quản lý y tế trọn đời.
        </p>
      </div>
    </div>

    <div class="auth-section">
      <div class="auth-card">
        <div class="brand-header">
          <img src="https://storage.googleapis.com/bookingcare/%24RKY6O8O.png" alt="BookingCare Logo"
            class="brand-logo" />
        </div>

        <h2 class="auth-title">Tạo tài khoản</h2>

        <div class="steps-wrapper slide-up-1">
          <el-steps :active="step - 1" align-center class="custom-steps">
            <el-step title="Tài khoản" />
            <el-step title="Xác thực & Thông tin" />
          </el-steps>
        </div>

        <transition name="step-fade" mode="out-in">
          <form v-if="step === 1" @submit.prevent="handleStep1" class="auth-form" key="step1">
            <div class="form-group slide-up-2">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="form.email" placeholder="Nhập email của bạn" required
                :disabled="isLoading" />
            </div>

            <div class="form-group slide-up-3">
              <label for="password">Mật khẩu</label>
              <input type="password" id="password" v-model="form.password" placeholder="Nhập mật khẩu" required
                :disabled="isLoading" />
            </div>

            <div class="form-group slide-up-3">
              <label for="confirmPassword">Xác nhận mật khẩu</label>
              <input type="password" id="confirmPassword" v-model="form.confirmPassword" placeholder="Nhập lại mật khẩu"
                required :disabled="isLoading" />
            </div>

            <button type="submit" class="btn-primary slide-up-4" :disabled="isLoading">
              <span v-if="isLoading" class="spinner"></span>
              <span v-else>Tiếp tục</span>
            </button>
          </form>

          <form v-else-if="step === 2" @submit.prevent="handleStep2" class="auth-form" key="step2">
            <div class="otp-message slide-up-1">
              Mã xác thực đã được gửi đến email<br />
              <strong>{{ form.email }}</strong>
            </div>

            <div class="form-group slide-up-2">
              <label for="otp">Mã xác thực OTP</label>
              <input type="text" id="otp" v-model="form.otp" placeholder="VD: 123456" class="text-center-input" required
                :disabled="isLoading" />
            </div>

            <div class="form-group slide-up-2">
              <label for="fullName">Họ và tên</label>
              <input type="text" id="fullName" v-model="form.fullName" placeholder="VD: Nguyễn Văn A" required
                :disabled="isLoading" />
            </div>

            <div class="form-row slide-up-3">
              <div class="form-group half-width">
                <label for="gender">Giới tính</label>
                <select id="gender" v-model="form.gender" required :disabled="isLoading">
                  <option value="" disabled>Chọn</option>
                  <option value="0">Nam</option>
                  <option value="1">Nữ</option>
                  <option value="2">Khác</option>
                </select>
              </div>
              <div class="form-group half-width">
                <label for="dob">Ngày sinh</label>
                <input type="date" id="dob" v-model="form.dob" required :disabled="isLoading" />
              </div>
            </div>

            <div class="form-group slide-up-3">
              <label for="phone">Số điện thoại</label>
              <input type="tel" id="phone" v-model="form.phone" placeholder="VD: 0912345678" required
                :disabled="isLoading" />
            </div>

            <div class="form-group slide-up-4">
              <label for="cccd">Số CCCD / CMND</label>
              <input type="text" id="cccd" v-model="form.cccd" placeholder="Nhập số CCCD (12 số)" required
                :disabled="isLoading" />
            </div>

            <button type="submit" class="btn-primary slide-up-4" :disabled="isLoading">
              <span v-if="isLoading" class="spinner"></span>
              <span v-else>Hoàn tất đăng ký</span>
            </button>

            <div class="auth-links slide-up-4" v-if="!isLoading">
              <a href="#" @click.prevent="step = 1" class="text-link">Quay lại sửa email</a>
            </div>
          </form>
        </transition>

        <transition name="step-fade">
          <div class="auth-links fade-in-late" v-if="step === 1 && !isLoading">
            <span>Đã có tài khoản? <router-link to="/login" class="text-link">Đăng nhập</router-link></span>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { notifySuccess, notifyError, messageFromCaught } from '../utils/notify'

const step = ref(1)
const isLoading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  otp: '',
  fullName: '',
  gender: '',
  dob: '',
  phone: '',
  cccd: ''
})

const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất 1 chữ cái IN HOA (A-Z).';
  }
  if (!/[a-z]/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất 1 chữ cái viết thường (a-z).';
  }
  if (!/[0-9]/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất 1 chữ số (0-9).';
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (VD: @, #, $, %, ...).';
  }
  return null;
}

const handleStep1 = async () => {
  const passwordError = validatePassword(form.password)
  if (passwordError) {
    notifyError(passwordError);
    return;
  }
  if (form.password !== form.confirmPassword) {
    notifyError('Mật khẩu xác nhận không khớp!')
    return
  }
  try {
    isLoading.value = true;
    await authStore.sendRegisterOtp(form.email)
    step.value = 2
  } catch (error) {
    notifyError(messageFromCaught(error));
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

const handleStep2 = async () => {
  if (form.otp.length < 6) {
    notifyError('Vui lòng nhập mã OTP hợp lệ!')
    return
  }
  try {
    isLoading.value = true;
    const payload = {
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      otp: form.otp,
      fullName: form.fullName,
      gender: Number(form.gender),
      dateOfBirth: form.dob,
      phoneNumber: form.phone,
      citizenId: form.cccd
    }
    await authStore.register(payload)
    notifySuccess('Đăng ký tài khoản thành công!')
    router.push('/login')
  } catch (error) {
    notifyError(messageFromCaught(error));
    console.error(error);
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
}

.auth-banner {
  flex: 1.1;
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1516826435551-36a8a09e4526?q=80&w=2000&auto=format&fit=crop');
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
  overflow-x: hidden;
  scrollbar-gutter: stable;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  padding: 50px 40px;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.04), 0 5px 15px rgba(0, 0, 0, 0.02);
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.brand-header {
  text-align: center;
  margin-bottom: 30px;
}

.brand-logo {
  max-width: 200px;
  height: auto;
}

.auth-title {
  color: #000;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: left;
}

.steps-wrapper {
  margin-bottom: 35px;
}

:deep(.custom-steps .el-step__head.is-finish),
:deep(.custom-steps .el-step__head.is-process),
:deep(.custom-steps .el-step__title.is-finish),
:deep(.custom-steps .el-step__title.is-process) {
  color: #45C3D2;
  border-color: #45C3D2;
  font-weight: 600;
}

:deep(.custom-steps .el-step__title) {
  font-size: 13px;
  font-family: 'Inter', sans-serif;
}

.auth-form {
  width: 100%;
}

.form-group {
  margin-bottom: 22px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 22px;
}

.half-width {
  flex: 1;
  margin-bottom: 0;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 10px;
}

input,
select {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  color: #000;
  background-color: #fff;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 16px top 50%;
  background-size: 10px auto;
  padding-right: 40px;
}

input::placeholder {
  color: #999;
}

input:focus,
select:focus {
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
}

input:disabled,
select:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.text-center-input {
  text-align: center;
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: 600;
}

.otp-message {
  text-align: center;
  font-size: 15px;
  color: #333;
  margin-bottom: 25px;
  line-height: 1.5;
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.otp-message strong {
  color: #000;
  display: block;
  margin-top: 4px;
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
  margin-top: 10px;
  min-height: 54px;
  font-family: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
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
  margin-top: 30px;
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

.slide-up-4 {
  animation: fadeInUp 0.5s ease forwards 0.4s;
  opacity: 0;
}

.fade-in-late {
  animation: fadeInUp 0.8s ease forwards 0.5s;
  opacity: 0;
}

.step-fade-enter-active,
.step-fade-leave-active {
  transition: all 0.3s ease-out;
}

.step-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.step-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
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
    padding: 40px 25px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .half-width {
    margin-bottom: 22px;
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