<template>
    <div class="profile-page">
        <div class="container slide-up-1">

            <div class="page-header">
                <h1 class="page-title">Quản lý tài khoản</h1>
                <p class="page-subtitle">Quản lý thông tin cá nhân và hồ sơ y tế của bạn</p>
            </div>

            <div class="profile-layout">

                <aside class="profile-sidebar slide-up-2">
                    <div class="user-summary">
                        <div class="avatar-circle">
                            <span class="avatar-text">{{ getInitials(form.fullName) }}</span>
                        </div>
                        <h3 class="user-name">{{ form.fullName || 'Người dùng' }}</h3>
                        <span class="badge">{{ form.patientCode }}</span>
                    </div>

                    <nav class="sidebar-nav">
                        <a href="#" class="nav-item active">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Hồ sơ cá nhân
                        </a>
                        <a href="#" class="nav-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Hồ sơ người thân
                        </a>
                        <a href="#" class="nav-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Lịch sử đặt khám
                        </a>
                        <a href="#" class="nav-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Đổi mật khẩu
                        </a>
                    </nav>
                </aside>

                <main class="profile-content slide-up-3">
                    <div class="card-header">
                        <h2>Thông tin cá nhân</h2>
                        <button class="btn-primary" @click="saveProfile" :disabled="isLoading">
                            <span v-if="isLoading" class="spinner"></span>
                            <span v-else>Lưu thay đổi</span>
                        </button>
                    </div>

                    <form @submit.prevent="saveProfile" class="profile-form">
                        <div class="form-grid">

                            <div class="form-group">
                                <label>Mã bệnh nhân <span class="text-muted">(Chỉ đọc)</span></label>
                                <input type="text" v-model="form.patientCode" disabled class="input-readonly" />
                            </div>

                            <div class="form-group">
                                <label>Họ và tên *</label>
                                <input type="text" v-model="form.fullName" required placeholder="Nhập họ và tên" />
                            </div>

                            <div class="form-group">
                                <label>Ngày sinh *</label>
                                <input type="date" v-model="form.dateOfBirth" required />
                            </div>

                            <div class="form-group">
                                <label>Giới tính *</label>
                                <select v-model="form.gender">
                                    <option :value="0">Nam</option>
                                    <option :value="1">Nữ</option>
                                    <option :value="2">Khác</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Số CCCD / Hộ chiếu *</label>
                                <input type="text" v-model="form.citizenId" required placeholder="Nhập số CCCD" />
                            </div>

                            <div class="form-group">
                                <label>Số điện thoại *</label>
                                <input type="tel" v-model="form.phoneNumber" required
                                    placeholder="Nhập số điện thoại" />
                            </div>

                            <div class="form-group">
                                <label>Mối quan hệ</label>
                                <select v-model="form.relationship" disabled class="input-readonly">
                                    <option :value="0">Bản thân</option>
                                    <option :value="1">Vợ/Chồng</option>
                                    <option :value="2">Con cái</option>
                                    <option :value="3">Bố/Mẹ</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Nhóm máu</label>
                                <select v-model="form.bloodType">
                                    <option :value="0">Chưa xác định</option>
                                    <option :value="1">A+</option>
                                    <option :value="2">A-</option>
                                    <option :value="3">B+</option>
                                    <option :value="4">B-</option>
                                    <option :value="5">AB+</option>
                                    <option :value="6">AB-</option>
                                    <option :value="7">O+</option>
                                    <option :value="8">O-</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group mt-20">
                            <label>Tiền sử bệnh (Dị ứng, bệnh mãn tính...)</label>
                            <textarea v-model="form.medicalHistory" rows="4"
                                placeholder="Cung cấp thông tin y tế để bác sĩ lưu ý..."></textarea>
                        </div>
                    </form>
                </main>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProfileStore } from '../stores/profileStore'

const isLoading = ref(false)
const profileStore = useProfileStore();
const form = ref({
    patientCode: '',
    fullName: '',
    dateOfBirth: '',
    gender: 0,
    citizenId: '',
    phoneNumber: '',
    relationship: 0,
    bloodType: 0,
    medicalHistory: ''
})

onMounted(async () => {
    const data = await profileStore.getUserProfile()
    form.value = {
        ...data,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        medicalHistory: data.medicalHistory || ''
    }
})

const getInitials = (name) => {
    if (!name) return 'U'
    const words = name.trim().split(' ')
    if (words.length >= 2) {
        return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
}

const saveProfile = async () => {
    isLoading.value = true
    try {
        // Gọi API updateProfile(form.value)
        await new Promise(resolve => setTimeout(resolve, 800)) // Fake delay
        alert('Cập nhật hồ sơ thành công!')
    } catch (error) {
        alert('Có lỗi xảy ra!')
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.profile-page {
    font-family: 'Inter', -apple-system, sans-serif;
    background-color: #F4F7F9;
    /* Nền xám xanh cực nhạt để tôn thẻ trắng lên */
    min-height: 100vh;
    padding: 40px 20px;
    color: #111827;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
}

/* HEADER */
.page-header {
    margin-bottom: 30px;
}

.page-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #111827;
}

.page-subtitle {
    color: #6b7280;
    font-size: 15px;
    margin: 0;
}

/* LAYOUT 2 CỘT */
.profile-layout {
    display: flex;
    gap: 30px;
    align-items: flex-start;
}

/* SIDEBAR */
.profile-sidebar {
    width: 280px;
    background: #ffffff;
    border-radius: 12px;
    padding: 24px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    flex-shrink: 0;
}

.user-summary {
    text-align: center;
    padding: 0 20px 24px;
    border-bottom: 1px solid #f3f4f6;
    margin-bottom: 16px;
}

.avatar-circle {
    width: 70px;
    height: 70px;
    background-color: #e0f7f5;
    color: #45C3D2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    margin: 0 auto 12px;
}

.user-name {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 8px 0;
}

.badge {
    display: inline-block;
    background: #f3f4f6;
    color: #4b5563;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 24px;
    color: #4b5563;
    text-decoration: none;
    font-weight: 500;
    font-size: 15px;
    transition: all 0.2s;
    border-left: 3px solid transparent;
}

.nav-item svg {
    width: 20px;
    height: 20px;
    color: #9ca3af;
    transition: color 0.2s;
}

.nav-item:hover {
    background-color: #f9fafb;
    color: #111827;
}

.nav-item.active {
    background-color: #f0fbf9;
    color: #45C3D2;
    border-left-color: #45C3D2;
}

.nav-item.active svg {
    color: #45C3D2;
}

/* MAIN CONTENT */
.profile-content {
    flex: 1;
    background: #ffffff;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f3f4f6;
}

.card-header h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

/* BUTTONS */
.btn-primary {
    background-color: #45C3D2;
    color: #fff;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14.5px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 140px;
    height: 42px;
}

.btn-primary:hover:not(:disabled) {
    background-color: #3ba3b0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(69, 195, 210, 0.25);
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* FORM STYLES */
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.mt-20 {
    margin-top: 20px;
}

label {
    font-size: 13.5px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
}

.text-muted {
    color: #9ca3af;
    font-weight: 400;
}

input,
select,
textarea {
    padding: 12px 16px;
    font-size: 15px;
    color: #111827;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    background-color: #fff;
    transition: all 0.2s;
    font-family: inherit;
    outline: none;
}

input:focus,
select:focus,
textarea:focus {
    border-color: #45C3D2;
    box-shadow: 0 0 0 3px rgba(69, 195, 210, 0.1);
}

.input-readonly {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
}

.input-readonly:focus {
    border-color: #e5e7eb;
    box-shadow: none;
}

textarea {
    resize: vertical;
}

/* ANIMATIONS */
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

@keyframes spin {
    to {
        transform: rotate(360deg);
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

/* RESPONSIVE */
@media (max-width: 900px) {
    .profile-layout {
        flex-direction: column;
    }

    .profile-sidebar {
        width: 100%;
    }
}

@media (max-width: 600px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>