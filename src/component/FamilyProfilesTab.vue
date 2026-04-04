<template>
    <div class="fade-in">
        <div class="card-header">
            <div class="header-text">
                <h2>Hồ sơ người thân</h2>
                <p class="text-muted">Quản lý danh sách người thân để đặt lịch khám nhanh chóng.</p>
            </div>
            <button class="btn-primary" @click="openAddModal">
                Thêm hồ sơ
            </button>
        </div>

        <div v-if="isLoading" class="loading-state">
            <span class="spinner-large"></span>
            <p>Đang tải danh sách hồ sơ...</p>
        </div>

        <div v-else-if="profiles.length === 0" class="empty-state">
            <h3>Chưa có hồ sơ người thân</h3>
            <p>Thêm thông tin người thân để dễ dàng đặt lịch trực tuyến.</p>
        </div>

        <div v-else class="profiles-grid">
            <div class="profile-card" v-for="profile in profiles" :key="profile.profileCode">
                <div class="card-top">
                    <div class="avatar-circle-large card-avatar">
                        {{ getInitials(profile.fullName) }}
                    </div>
                    <div class="card-title-area">
                        <h3 class="profile-name">{{ profile.fullName }}</h3>

                        <div class="badges-wrapper">
                            <span v-if="formatRelationship(profile.relationship)" class="badge"
                                :class="getRelationshipClass(profile.relationship)">
                                {{ formatRelationship(profile.relationship) }}
                            </span>

                            <span v-if="profile.isShared" class="badge badge-shared"
                                title="Hồ sơ được người khác chia sẻ với bạn">
                                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2"
                                    fill="none">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                </svg>
                                Được chia sẻ
                            </span>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <div class="info-row">
                        <span class="info-label">Mã hồ sơ:</span>
                        <span class="info-value">{{ profile.profileCode || 'Chưa cấp' }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Ngày sinh:</span>
                        <span class="info-value">{{ formatDate(profile.dateOfBirth) }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Giới tính:</span>
                        <span class="info-value">{{ formatGender(profile.gender) }}</span>
                    </div>
                </div>

                <div class="card-actions">
                    <template v-if="canEdit(profile) || canBook(profile)">
                        <button v-if="canEdit(profile)" class="btn-action edit-btn"
                            @click="openEditModal(profile)">Chỉnh sửa</button>
                        <button v-if="canBook(profile)" class="btn-action book-btn">Đặt lịch khám</button>
                    </template>

                    <div v-else class="read-only-notice">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2"
                            fill="none">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>Chỉ xem thông tin</span>
                    </div>
                </div>
            </div>
        </div>

        <transition name="modal">
            <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3>{{ isEditMode ? 'Chỉnh sửa hồ sơ' : 'Thêm hồ sơ người thân' }}</h3>
                        <button class="btn-close" @click="closeAddModal">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="modal-body">
                        <form id="addProfileForm" @submit.prevent="submitAddProfile" class="profile-form">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label>Họ và tên *</label>
                                    <input type="text" v-model="newProfile.fullName" required
                                        placeholder="Nhập họ và tên" />
                                </div>
                                <div class="form-group">
                                    <label>Ngày sinh *</label>
                                    <input type="date" v-model="newProfile.dateOfBirth" required />
                                </div>
                                <div class="form-group">
                                    <label>Giới tính *</label>
                                    <select v-model="newProfile.gender">
                                        <option :value="0">Nam</option>
                                        <option :value="1">Nữ</option>
                                        <option :value="2">Khác</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Mối quan hệ *</label>
                                    <select v-model="newProfile.relationship" required>
                                        <option :value="1">Bố/Mẹ</option>
                                        <option :value="2">Con cái</option>
                                        <option :value="3">Anh/Chị/Em</option>
                                        <option :value="4">Vợ/Chồng</option>
                                        <option :value="5">Ông/Bà</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Số CCCD *</label>
                                    <input type="text" v-model="newProfile.citizenId" placeholder="Nhập số CCCD"
                                        required />
                                </div>
                                <div class="form-group">
                                    <label>Số điện thoại *</label>
                                    <input type="tel" v-model="newProfile.phoneNumber" placeholder="Nhập số điện thoại"
                                        required />
                                </div>
                                <div class="form-group">
                                    <label>Nhóm máu *</label>
                                    <select v-model="newProfile.bloodType" required>
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
                                <textarea v-model="newProfile.medicalHistory" rows="3"
                                    placeholder="Cung cấp thông tin y tế để bác sĩ lưu ý..."></textarea>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <button class="btn-secondary" @click="closeAddModal" type="button">Hủy bỏ</button>
                        <button class="btn-primary" type="submit" form="addProfileForm" :disabled="isSubmitting">
                            <span v-if="isSubmitting" class="spinner"></span>
                            <span v-else>{{ isEditMode ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ' }}</span>
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

const profileStore = useProfileStore()
const isLoading = ref(true)
const profiles = ref([])

const showAddModal = ref(false)
const isSubmitting = ref(false)
const isEditMode = ref(false)

const initialProfileState = {
    fullName: '',
    dateOfBirth: '',
    gender: 0,
    citizenId: '',
    phoneNumber: '',
    relationship: 1,
    bloodType: 0,
    medicalHistory: ''
}
const newProfile = ref({ ...initialProfileState })

onMounted(async () => {
    await fetchProfiles()
})

const fetchProfiles = async () => {
    isLoading.value = true
    try {
        const data = await profileStore.getUserProfiles()
        profiles.value = data
    } catch (error) {
        console.error(error);
        alert(error.message.replace(/^Error:\s*/, '').trim());
    } finally {
        isLoading.value = false;
    }
}

const canEdit = (profile) => {
    if (!profile.isShared) return true;
    return profile.sharePermission === 2;
}

const canBook = (profile) => {
    if (!profile.isShared) return true;
    return profile.sharePermission === 1;
}

const openAddModal = () => {
    isEditMode.value = false
    newProfile.value = { ...initialProfileState }
    showAddModal.value = true
}

const openEditModal = (profile) => {
    isEditMode.value = true
    newProfile.value = {
        ...profile,
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        medicalHistory: profile.medicalHistory || ''
    }
    showAddModal.value = true
}

const closeAddModal = () => {
    showAddModal.value = false
}

const submitAddProfile = async () => {
    isSubmitting.value = true
    try {
        if (isEditMode.value) {
            await profileStore.updateUserProfile(newProfile.value)
            alert('Cập nhật hồ sơ thành công!')
        } else {
            await profileStore.createUserProfile(newProfile.value)
            alert('Thêm hồ sơ người thân thành công!')
        }
        closeAddModal()
        await fetchProfiles()
    } catch (error) {
        console.error(error);
        alert(error.message.replace(/^Error:\s*/, '').trim());
    } finally {
        isSubmitting.value = false;
    }
}

const getInitials = (name) => {
    if (!name) return 'U'
    const words = name.trim().split(' ')
    return words.length >= 2 ? (words[0][0] + words[words.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
}
const formatGender = (g) => g === 0 ? 'Nam' : (g === 1 ? 'Nữ' : 'Khác')
const formatDate = (d) => d ? new Intl.DateTimeFormat('vi-VN').format(new Date(d)) : ''

const formatRelationship = (r) => {
    switch (r) {
        case 1: return 'Bố/Mẹ';
        case 2: return 'Con cái';
        case 3: return 'Anh/Chị/Em';
        case 4: return 'Vợ/Chồng';
        case 5: return 'Ông/Bà';
    }
}
const getRelationshipClass = (r) => {
    switch (r) {
        case 1: return 'badge-parent';
        case 2: return 'badge-child';
        case 3: return 'badge-sibling';
        case 4: return 'badge-spouse';
        case 5: return 'badge-grandparent';
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
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e7eb;
    gap: 16px;
}

.header-text {
    width: 100%;
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
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.profiles-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
}

.profile-card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    background: #fff;
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
}

.profile-card:hover {
    box-shadow: 0 10px 25px rgba(69, 195, 210, 0.2);
    transform: translateY(-4px);
}

.card-top {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
}

.card-avatar {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #e0f7f5 0%, #f0fbf9 100%);
    color: #45C3D2;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    flex-shrink: 0;
}

.card-title-area {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
}

.profile-name {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: #111827;
}

/* CHỈNH SỬA: Flexbox cho vùng Badge để chứa được 2 thẻ nhãn */
.badges-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12.5px;
    font-weight: 600;
    display: inline-block;
    white-space: nowrap;
}

.badge-parent {
    background-color: #fef3c7;
    color: #d97706;
}

.badge-child {
    background-color: #e0e7ff;
    color: #4338ca;
}

.badge-sibling {
    background-color: #dcfce7;
    color: #15803d;
}

.badge-spouse {
    background-color: #fce7f3;
    color: #be185d;
}

.badge-grandparent {
    background-color: #f3e8ff;
    color: #7e22ce;
}

/* CSS nhãn "Được chia sẻ" */
.badge-shared {
    background-color: #f9fafb;
    color: #4b5563;
    border: 1px solid #d1d5db;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
}

.card-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
    flex: 1;
}

.info-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    border-bottom: 1px dashed #f3f4f6;
    padding-bottom: 6px;
}

.info-label {
    color: #4b5563;
}

.info-value {
    font-weight: 500;
    color: #111827;
}

/* CHỈNH SỬA: Đổi card-actions sang Flex để nút tự giãn ra nếu chỉ có 1 nút được hiển thị */
.card-actions {
    display: flex;
    gap: 12px;
    width: 100%;
}

.btn-action {
    flex: 1;
    /* Cho phép các nút chia đều chiều rộng */
    padding: 10px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;
}

.edit-btn {
    background-color: #f9fafb;
    color: #4b5563;
    border-color: #e5e7eb;
}

.edit-btn:hover {
    background-color: #e5e7eb;
    color: #111827;
}

.book-btn {
    background-color: #f0fbf9;
    color: #45C3D2;
}

.book-btn:hover {
    background-color: #45C3D2;
    color: #fff;
}

/* CSS Thông báo Chỉ đọc */
.read-only-notice {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    background-color: #f9fafb;
    color: #6b7280;
    border-radius: 8px;
    font-size: 13.5px;
    font-weight: 500;
    font-style: italic;
}

.empty-state,
.loading-state {
    text-align: center;
    padding: 60px 20px;
    border-radius: 12px;
}

.empty-state h3 {
    font-size: 18px;
    margin: 0 0 8px;
    color: #111827;
}

.empty-state p {
    color: #4b5563;
    font-size: 14.5px;
    margin: 0;
}

.spinner,
.spinner-large {
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.spinner {
    width: 18px;
    height: 18px;
}

.spinner-large {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 3px solid rgba(69, 195, 210, 0.2);
    border-top-color: #45C3D2;
    margin-bottom: 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* CSS cho Modal (Giữ nguyên như cũ của bạn) */
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
    max-width: 750px;
    max-height: 90vh;
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
    z-index: 10;
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
    overflow-y: auto;
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
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.2s;
    width: auto;
}

.btn-secondary:hover {
    background-color: #f3f4f6;
    color: #111827;
    border-color: #9ca3af;
}

.modal-footer .btn-primary {
    width: auto;
    flex: none;
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

textarea {
    resize: vertical;
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

@media (max-width: 1024px) {
    .profiles-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 600px) {
    .form-grid {
        grid-template-columns: 1fr;
    }

    .modal-container {
        max-height: 100vh;
        border-radius: 0;
    }
}
</style>