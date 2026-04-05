<template>
    <div class="fade-in">
        <div class="card-header">
            <div class="header-text">
                <h2>Thông tin cá nhân</h2>
                <p class="text-muted">Vui lòng cung cấp thông tin chính xác để đồng bộ với hồ sơ y tế của bạn.</p>
            </div>

            <div class="header-actions">
                <button class="btn-primary-outline share-btn" @click="openShareModal" type="button">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"
                        style="margin-right: 6px;">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Chia sẻ hồ sơ
                </button>

                <button class="btn-primary" @click="handleUpdateProfile" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner"></span>
                    <span v-else>Lưu thay đổi</span>
                </button>
            </div>
        </div>

        <form @submit.prevent="handleUpdateProfile" class="profile-form">
            <div class="form-grid">
                <div class="form-group">
                    <label>Mã hồ sơ <span class="text-muted">(Chỉ đọc)</span></label>
                    <input type="text" v-model="form.profileCode" disabled class="input-readonly" />
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
                    <input type="tel" v-model="form.phoneNumber" required placeholder="Nhập số điện thoại" />
                </div>

                <div class="form-group">
                    <label>Mối quan hệ</label>
                    <select v-model="form.relationship" disabled class="input-readonly">
                        <option :value="0">Bản thân</option>
                        <option :value="1">Bố/Mẹ</option>
                        <option :value="2">Con cái</option>
                        <option :value="3">Anh/Chị/em</option>
                        <option :value="4">Vợ/Chồng</option>
                        <option :value="5">Ông/Bà</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Nhóm máu</label>
                    <select v-model="form.bloodType">
                        <option :value="0">Chưa xác định</option>
                        <option :value="1">O+</option>
                        <option :value="2">O-</option>
                        <option :value="3">A+</option>
                        <option :value="4">A-</option>
                        <option :value="5">B+</option>
                        <option :value="6">B-</option>
                        <option :value="7">AB+</option>
                        <option :value="8">AB-</option>
                    </select>
                </div>
            </div>

            <div class="form-group mt-20">
                <label>Tiền sử bệnh (Dị ứng, bệnh mãn tính...)</label>
                <textarea v-model="form.medicalHistory" rows="4"
                    placeholder="Cung cấp thông tin y tế để bác sĩ lưu ý..."></textarea>
            </div>
        </form>

        <transition name="modal">
            <div v-if="showShareModal" class="modal-overlay" @click.self="closeShareModal">
                <div class="modal-container share-modal">
                    <div class="modal-header">
                        <h3>Chia sẻ hồ sơ y tế</h3>
                        <button class="btn-close" @click="closeShareModal" type="button">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="share-info-box">
                            <span class="info-label">Đang chia sẻ hồ sơ:</span>
                            <span class="info-value">{{ form.fullName }} ({{ form.profileCode }})</span>
                        </div>

                        <form id="shareProfileForm" @submit.prevent="submitShareProfile" class="profile-form">
                            <div class="form-group mt-20">
                                <label>Email người nhận *</label>
                                <input type="email" v-model="shareForm.email" required
                                    placeholder="Nhập email tài khoản BookingCare" />
                            </div>

                            <div class="form-group mt-20">
                                <label>Quyền hạn *</label>
                                <select v-model="shareForm.permission" required>
                                    <option :value="0">Chỉ xem thông tin</option>
                                    <option :value="1">Được phép đặt lịch khám</option>
                                    <option :value="2">Toàn quyền quản lý</option>
                                </select>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <button class="btn-secondary" @click="closeShareModal" type="button">Hủy bỏ</button>
                        <button class="btn-primary" type="submit" form="shareProfileForm" :disabled="isSharing">
                            <span v-if="isSharing" class="spinner"></span>
                            <span v-else>Gửi lời mời</span>
                        </button>
                    </div>
                </div>
            </div>
        </transition>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import axios from 'axios'
import { notifySuccess, notifyError, messageFromCaught } from '../utils/notify'

const profileStore = useProfileStore()
const isLoading = ref(false)

const form = ref({
    id: '',
    patientCode: '',
    profileCode: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    citizenId: '',
    phoneNumber: '',
    relationship: '',
    bloodType: '',
    medicalHistory: ''
})

onMounted(async () => {
    const data = await profileStore.getUserProfile()
    form.value = {
        ...data,
        id: data.id,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        medicalHistory: data.medicalHistory || ''
    }
})

const handleUpdateProfile = async () => {
    isLoading.value = true
    try {
        await profileStore.updateUserProfile(form.value)
        notifySuccess('Cập nhật hồ sơ thành công!')
    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    } finally {
        isLoading.value = false;
    }
}

const showShareModal = ref(false)
const isSharing = ref(false)

const shareForm = ref({
    profileId: '',
    email: '',
    permission: 0
})

const openShareModal = () => {
    shareForm.value = {
        profileId: form.value.id,
        email: '',
        permission: 0
    }
    showShareModal.value = true
}

const closeShareModal = () => {
    showShareModal.value = false
}

const submitShareProfile = async () => {
    if (!shareForm.value.profileId) {
        notifyError('Lỗi: Không tìm thấy ID hồ sơ để chia sẻ!');
        return;
    }
    isSharing.value = true
    try {
        await profileStore.shareUserProfile(shareForm.value)
        notifySuccess('Đã gửi lời mời chia sẻ hồ sơ thành công!')
        closeShareModal()
    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    } finally {
        isSharing.value = false;
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
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e7eb;
    gap: 20px;
}

.header-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
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
    line-height: 1.5;
}

.header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-shrink: 0;
}

.btn-primary-outline {
    color: #45C3D2;
    border: 1.5px solid #45C3D2;
    background: transparent;
    padding: 0 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14.5px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 42px;
    transition: all 0.2s;
    white-space: nowrap;
}

.btn-primary-outline:hover {
    background-color: #f0fbf9;
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 42px;
    white-space: nowrap;
    transition: all 0.2s;
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

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

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
    box-shadow: 0 0 0 4px rgba(69, 195, 210, 0.12);
}

.input-readonly {
    background-color: #f9fafb;
    color: #4b5563;
    cursor: not-allowed;
}

.input-readonly:focus {
    border-color: #e5e7eb;
    box-shadow: none;
}

textarea {
    resize: vertical;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal-container {
    background: #fff;
    width: 100%;
    max-width: 500px;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    color: #111827;
}

.btn-close {
    background: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.2s;
}

.btn-close svg {
    width: 20px;
    height: 20px;
}

.btn-close:hover {
    background-color: #f3f4f6;
    color: #ef4444;
}

.modal-body {
    padding: 24px;
}

.share-info-box {
    background-color: #f0fbf9;
    border: 1px solid #45C3D2;
    padding: 12px 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.info-label {
    font-size: 13px;
    color: #4b5563;
}

.info-value {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
}

.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    background-color: #f9fafb;
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
    height: 42px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    white-space: nowrap;
}

.btn-secondary:hover {
    background-color: #f3f4f6;
    color: #111827;
    border-color: #9ca3af;
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    transform: scale(0.95) translateY(20px);
}

@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }

    .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .header-actions {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 12px;
    }

    .btn-primary,
    .btn-primary-outline {
        flex: 1;
        width: auto;
        padding: 0 10px;
    }

    .modal-container {
        border-radius: 12px;
        margin: 16px;
    }
}
</style>