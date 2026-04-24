<template>
    <div class="account-page slide-up">
        <div class="account-layout">
            <div class="settings-sidebar card">
                <div class="profile-summary">
                    <div class="avatar-wrapper">
                        <img v-if="doctorProfile.avatarUrl" :src="doctorProfile.avatarUrl" alt="Avatar"
                            class="avatar-img" />
                        <div v-else class="avatar-placeholder">
                            {{ doctorProfile.fullName ? doctorProfile.fullName.charAt(0).toUpperCase() : 'BS' }}
                        </div>
                    </div>

                    <h3>{{ getPositionName(doctorProfile.position) }} {{ doctorProfile.fullName }}</h3>
                    <p>{{ doctorProfile.specialtyName }}</p>
                </div>
                <nav class="settings-nav">
                    <button class="nav-btn" :class="{ active: currentTab === 'profile' }"
                        @click="currentTab = 'profile'">
                        Hồ sơ cá nhân
                    </button>
                    <button class="nav-btn" :class="{ active: currentTab === 'security' }"
                        @click="currentTab = 'security'">
                        Bảo mật & Mật khẩu
                    </button>
                </nav>
            </div>

            <div class="settings-content card">
                <div v-if="currentTab === 'profile'" class="tab-pane">
                    <h2>Thông tin cá nhân</h2>
                    <p class="text-gray mb-4">Quản lý thông tin định danh và chuyên môn của bạn trên hệ thống.</p>

                    <div class="form-grid">
                        <div class="form-row-2">
                            <div class="form-group">
                                <label>Họ và tên</label>
                                <input type="text" class="form-control" :value="doctorProfile.fullName" />
                            </div>
                            <div class="form-group">
                                <label>Số điện thoại</label>
                                <input type="text" class="form-control" :value="doctorProfile.phoneNumber" />
                            </div>
                        </div>
                        <div class="form-row-2">
                            <div class="form-group">
                                <label>Email (Tên đăng nhập)</label>
                                <input type="email" class="form-control input-disabled" :value="doctorProfile.email"
                                    disabled />
                            </div>
                            <div class="form-group">
                                <label>Số CCCD</label>
                                <input type="text" class="form-control input-disabled" :value="doctorProfile.citizenId"
                                    disabled />
                            </div>
                        </div>
                        <hr class="divider" />
                        <div class="form-row-2">
                            <div class="form-group">
                                <label>Chuyên khoa</label>
                                <input type="text" class="form-control input-disabled"
                                    :value="doctorProfile.specialtyName" disabled />
                            </div>
                            <div class="form-group">
                                <label>Kinh nghiệm (Năm)</label>
                                <input type="number" class="form-control" :value="doctorProfile.experienceYears" />
                            </div>
                        </div>
                        <div class="form-action">
                            <button class="btn-primary">Lưu thay đổi</button>
                        </div>
                    </div>
                </div>

                <div v-if="currentTab === 'security'" class="tab-pane">
                    <div class="centered-form-wrapper">
                        <h2>Đổi mật khẩu</h2>
                        <p class="text-gray mb-4">Đảm bảo tài khoản của bạn sử dụng mật khẩu dài và an toàn.</p>

                        <div class="form-grid">
                            <div class="form-group">
                                <label>Mật khẩu hiện tại <span class="text-red">*</span></label>
                                <input type="password" class="form-control" placeholder="Nhập mật khẩu hiện tại" />
                            </div>
                            <div class="form-group">
                                <label>Mật khẩu mới <span class="text-red">*</span></label>
                                <input type="password" class="form-control" placeholder="Tối thiểu 8 ký tự" />
                            </div>
                            <div class="form-group">
                                <label>Xác nhận mật khẩu mới <span class="text-red">*</span></label>
                                <input type="password" class="form-control" placeholder="Nhập lại mật khẩu mới" />
                            </div>
                            <div class="form-action mt-4">
                                <button class="btn-primary">Cập nhật mật khẩu</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { getPositionName } from '../../../constants/enum';

const currentTab = ref('profile')
const doctorProfile = inject('doctorProfile')

</script>

<style scoped>
.account-page {
    height: calc(100vh - 120px);
}

.account-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
    height: 100%;
    align-items: flex-start;
}

.card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.settings-sidebar {
    padding: 24px 0;
    display: flex;
    flex-direction: column;
}

.profile-summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 24px;
    border-bottom: 1px solid #e5e7eb;
}

.avatar-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
    margin-bottom: 16px;
    border-radius: 50%;
    padding: 4px;
    background: #ffffff;
    box-shadow: 0 0 0 1px #45C3D2, 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #f3f4f6;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #45C3D2 0%, #3ba3b0 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-summary h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
    color: #111827;
}

.profile-summary p {
    margin: 0;
    font-size: 13px;
    color: #6b7280;
}

.settings-nav {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 8px;
}

.nav-btn {
    background: transparent;
    border: none;
    text-align: left;
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 500;
    color: #4b5563;
    cursor: pointer;
    font-family: inherit;
    transition: 0.2s;
}

.nav-btn:hover {
    background: #f9fafb;
    color: #111827;
}

.nav-btn.active {
    background: #e0f7fa;
    color: #00838f;
    font-weight: 600;
}

.settings-content {
    padding: 32px;
    min-height: 500px;
    display: flex;
    flex-direction: column;
}

.tab-pane {
    width: 100%;
}

.tab-pane h2 {
    font-size: 20px;
    margin: 0 0 8px 0;
    color: #111827;
}

.text-gray {
    color: #6b7280;
    font-size: 14px;
}

.mb-4 {
    margin-bottom: 24px;
}

.centered-form-wrapper {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 12px;
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
}

.form-control {
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    outline: none;
}

.form-control:focus {
    border-color: #45C3D2;
    box-shadow: 0 0 0 3px rgba(69, 195, 210, 0.1);
}

.input-disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
}

.divider {
    border: 0;
    border-top: 1px solid #e5e7eb;
    margin: 8px 0;
}

.my-4 {
    margin-top: 24px;
    margin-bottom: 24px;
}

.mt-4 {
    margin-top: 24px;
}

.text-red {
    color: #dc2626;
}

.form-action {
    display: flex;
    justify-content: flex-start;
}

.btn-primary {
    background: #45C3D2;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: 0.2s;
    width: fit-content;
}

.btn-primary:hover {
    background: #3ba3b0;
}

.slide-up {
    animation: fadeInUp 0.4s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>