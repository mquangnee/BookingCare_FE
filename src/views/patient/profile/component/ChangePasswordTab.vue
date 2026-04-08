<template>
    <div class="fade-in">
        <div class="card-header">
            <div class="header-text">
                <h2>Đổi mật khẩu</h2>
                <p class="text-muted">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu và mã OTP cho bất kỳ ai.</p>
            </div>
        </div>

        <div class="form-content">
            <transition name="slide-fade" mode="out-in">
                <form v-if="step === 1" @submit.prevent="handleRequestOTP" class="password-form">

                    <div v-if="errorMessage" class="error-alert">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2"
                            fill="none">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {{ errorMessage }}
                    </div>

                    <div class="form-group">
                        <label>Mật khẩu hiện tại *</label>
                        <div class="input-wrapper">
                            <input :type="showPasswords ? 'text' : 'password'" v-model="form.oldPassword" required
                                placeholder="Nhập mật khẩu cũ của bạn" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Mật khẩu mới *</label>
                        <div class="input-wrapper">
                            <input :type="showPasswords ? 'text' : 'password'" v-model="form.newPassword" required
                                placeholder="Ít nhất 6 ký tự, gồm chữ hoa, số và ký tự đặc biệt" minlength="6" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Xác nhận mật khẩu mới *</label>
                        <div class="input-wrapper">
                            <input :type="showPasswords ? 'text' : 'password'" v-model="form.confirmPassword" required
                                placeholder="Nhập lại mật khẩu mới" />
                        </div>
                    </div>

                    <div class="form-options">
                        <label class="checkbox-container">
                            <input type="checkbox" v-model="showPasswords">
                            <span class="checkmark"></span>
                            Hiển thị mật khẩu
                        </label>
                    </div>

                    <div class="form-actions mt-4">
                        <button type="submit" class="btn-primary full-width" :disabled="isLoading">
                            <span v-if="isLoading" class="spinner"></span>
                            <span v-else>Gửi mã xác thực OTP</span>
                        </button>
                    </div>
                </form>

                <form v-else-if="step === 2" @submit.prevent="handleVerifyOTP" class="otp-form">
                    <div class="otp-illustration">
                        <div class="mail-icon">
                            <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="1.5"
                                fill="none">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z">
                                </path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </div>
                        <h3>Kiểm tra email của bạn</h3>
                        <p class="text-muted text-center">Chúng tôi đã gửi một mã gồm 6 chữ số đến email bảo mật của
                            bạn. Vui lòng nhập mã đó vào đây để xác nhận.</p>
                    </div>

                    <div class="form-group otp-group">
                        <input type="text" v-model="form.otp" maxlength="6" required placeholder="• • • • • •"
                            class="otp-input" pattern="\d*" title="Vui lòng chỉ nhập số" autocomplete="off" />
                    </div>

                    <div class="form-actions otp-actions">
                        <button type="button" class="btn-secondary" @click="step = 1" :disabled="isLoading">Quay
                            lại</button>
                        <button type="submit" class="btn-primary" :disabled="isLoading || form.otp.length !== 6">
                            <span v-if="isLoading" class="spinner"></span>
                            <span v-else>Xác nhận</span>
                        </button>
                    </div>
                </form>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../../../stores/authStore'
import { notifySuccess, notifyError, messageFromCaught } from '../../../../utils/notify'

const authStore = useAuthStore()
const step = ref(1)
const isLoading = ref(false)
const showPasswords = ref(false)
const errorMessage = ref('')

const form = ref({
    otp: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const otpCode = ref('')

const validatePassword = (password) => {
    if (!password || password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    if (!/[A-Z]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ cái IN HOA (A-Z).';
    if (!/[a-z]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ cái viết thường (a-z).';
    if (!/[0-9]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ số (0-9).';
    if (!/[^a-zA-Z0-9]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (VD: @, #, $, %, ...).';
    return null;
}

const handleRequestOTP = async () => {
    errorMessage.value = ''
    const passwordError = validatePassword(form.value.newPassword);
    if (passwordError) {
        errorMessage.value = passwordError;
        return;
    }
    if (form.value.newPassword !== form.value.confirmPassword) {
        errorMessage.value = 'Mật khẩu xác nhận không khớp với mật khẩu mới.'
        return
    }
    if (form.value.oldPassword === form.value.newPassword) {
        errorMessage.value = 'Mật khẩu mới không được trùng với mật khẩu cũ.'
        return
    }
    isLoading.value = true
    try {
        const body = {
            oldPassword: form.value.oldPassword,
            newPassword: form.value.newPassword,
            confirmPassword: form.value.confirmPassword
        }
        await authStore.sendChangePasswordOtp(body)
        step.value = 2
        otpCode.value = ''
    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    } finally {
        isLoading.value = false;
    }
}

const handleVerifyOTP = async () => {
    isLoading.value = true
    try {
        const body = {
            otp: form.value.otp,
            oldPassword: form.value.oldPassword,
            newPassword: form.value.newPassword,
            confirmPassword: form.value.confirmPassword
        }
        await authStore.changePassword(body)
        notifySuccess('Bạn đã đổi mật khẩu thành công.')
        form.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
        step.value = 1
        showPasswords.value = false
    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
.fade-in {
    animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e7eb;
}

.header-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.card-header h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: #111827;
}

.text-muted {
    color: #9ca3af;
    font-size: 14.5px;
    margin: 0;
    font-weight: 400;
}

.text-center {
    text-align: center;
}

.form-content {
    width: 100%;
    padding: 10px 0 30px;
}

.password-form,
.otp-form {
    max-width: 500px;
    margin: 0 auto;
}

.error-alert {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background-color: #fef2f2;
    border-left: 4px solid #ef4444;
    color: #b91c1c;
    border-radius: 4px;
    font-size: 14px;
    margin-bottom: 20px;
    font-weight: 500;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 22px;
}

.form-group label {
    font-size: 13.5px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
}

.input-wrapper {
    position: relative;
}

input {
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    color: #111827;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.2s;
    outline: none;
    font-family: inherit;
    box-sizing: border-box;
}

input:focus {
    border-color: #45C3D2;
    box-shadow: 0 0 0 4px rgba(69, 195, 210, 0.12);
}

.form-options {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
}

.checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    font-size: 14px;
    color: #4b5563;
    user-select: none;
    gap: 8px;
    font-weight: 500;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 1.5px solid #d1d5db;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
}

.checkbox-container:hover input~.checkmark {
    border-color: #45C3D2;
}

.checkbox-container input:checked~.checkmark {
    background-color: #45C3D2;
    border-color: #45C3D2;
}

.checkmark:after {
    content: "";
    display: none;
    width: 4px;
    height: 9px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-bottom: 2px;
}

.checkbox-container input:checked~.checkmark:after {
    display: block;
}

.mt-4 {
    margin-top: 24px;
}

.full-width {
    width: 100%;
}

.btn-primary {
    background-color: #45C3D2;
    color: #fff;
    border: none;
    padding: 0 24px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14.5px;
    cursor: pointer;
    height: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
    background-color: #3ba3b0;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-secondary {
    background-color: #fff;
    color: #4b5563;
    border: 1px solid #d1d5db;
    padding: 0 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14.5px;
    cursor: pointer;
    height: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #f3f4f6;
    color: #111827;
    border-color: #9ca3af;
}

.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.otp-illustration {
    text-align: center;
    margin-bottom: 30px;
}

.mail-icon {
    width: 64px;
    height: 64px;
    background: #f0fbf9;
    color: #45C3D2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
}

.otp-illustration h3 {
    font-size: 20px;
    color: #111827;
    margin: 0 0 8px 0;
}

.otp-group {
    display: flex;
    justify-content: center;
}

.otp-input {
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 12px;
    padding: 12px;
    border-radius: 8px;
}

.otp-input::placeholder {
    letter-spacing: 8px;
    color: #d1d5db;
    font-weight: 400;
}

.otp-actions {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 12px;
    margin-top: 10px;
}

.text-primary {
    color: #45C3D2;
    font-weight: 600;
    text-decoration: none;
}

.text-primary:hover {
    text-decoration: underline;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

@media (max-width: 600px) {

    .password-form,
    .otp-form {
        max-width: 100%;
    }

    .otp-actions {
        grid-template-columns: 1fr;
    }
}
</style>