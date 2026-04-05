<template>
    <div class="tab-pane">
        <div class="tab-header">
            <h2 class="tab-title">Quản lý chia sẻ hồ sơ</h2>
            <p class="tab-desc">Kiểm soát danh sách những người có quyền xem và sử dụng hồ sơ y tế của bạn.</p>
        </div>

        <div v-if="isLoading" class="text-center py-4 text-gray">Đang tải dữ liệu...</div>

        <div v-else-if="sharedUsers.length === 0" class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <p>Bạn chưa chia sẻ hồ sơ với ai.</p>
        </div>

        <div v-else class="shared-list">
            <div class="shared-card" v-for="user in sharedUsers" :key="user.id">
                <div class="user-info">
                    <div class="avatar">{{ getInitials(user.userName) }}</div>
                    <div class="details">
                        <h4>{{ user.userName }}</h4>
                        <p class="email">{{ user.email }}</p>
                    </div>
                </div>

                <div class="permission-info">
                    <span :class="['badge', getPermissionClass(user.sharePermission)]">
                        {{ getPermissionText(user.sharePermission) }}
                    </span>
                    <span class="date-shared">Từ: {{ formatDate(user.createdDate) }}</span>
                </div>

                <div class="action-area">
                    <button class="btn-revoke-mixed" @click="handleRevokeAccess(user.id, user.userName)">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="#ef4444" stroke-width="2" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                            </path>
                        </svg>
                        <span>Hủy quyền</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import { notifySuccess, notifyError, messageFromCaught } from '../utils/notify'

const isLoading = ref(false)
const sharedUsers = ref([])
const profileStore = useProfileStore()

const fetchSharedUsers = async () => {
    isLoading.value = true
    try {
        const data = await profileStore.getSharedProfiles()
        sharedUsers.value = data
        isLoading.value = false
    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    }
}

onMounted(() => {
    fetchSharedUsers()
})

const getInitials = (name) => {
    if (!name) return 'U'
    const words = name.trim().split(' ')
    return words.length >= 2 ? (words[0][0] + words[words.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString))
}

const getPermissionText = (permissionCode) => {
    switch (permissionCode) {
        case 0: return 'Chỉ xem thông tin'
        case 1: return 'Được đặt lịch khám'
        case 2: return 'Toàn quyền quản lý'
        default: return 'Không xác định'
    }
}

const getPermissionClass = (permissionCode) => {
    switch (permissionCode) {
        case 0: return 'badge-blue'
        case 1: return 'badge-green'
        case 2: return 'badge-purple'
        default: return 'badge-gray'
    }
}

const handleRevokeAccess = async (shareId, name) => {
    if (confirm(`Bạn có chắc chắn muốn HỦY quyền truy cập hồ sơ của "${name}" không?`)) {
        try {
            await profileStore.cancelSharedProfile(shareId)
            sharedUsers.value = sharedUsers.value.filter(u => u.id !== shareId)
            notifySuccess('Hủy quyền thành công!')
        } catch (error) {
            notifyError(messageFromCaught(error) || 'Có lỗi xảy ra khi hủy quyền.')
        }
    }
}
</script>

<style scoped>
.tab-header {
    margin-bottom: 24px;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 16px;
}

.tab-title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 8px 0;
}

.tab-desc {
    color: #6b7280;
    font-size: 14.5px;
    margin: 0;
}

.text-gray {
    color: #6b7280;
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
    border-radius: 12px;
}

.empty-state svg {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
}

.shared-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.shared-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    transition: all 0.2s;
}

.shared-card:hover {
    box-shadow: 0 10px 25px rgba(69, 195, 210, 0.2);
    transform: translateY(-4px);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 40%;
    min-width: 0;
}

.avatar {
    width: 42px;
    height: 42px;
    background: #e0f7f5;
    color: #45C3D2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 15px;
    flex-shrink: 0;
}

.details {
    min-width: 0;
    flex: 1;
}

.details h4 {
    margin: 0 0 4px 0;
    font-size: 15px;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.details .email {
    margin: 0;
    font-size: 13px;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.permission-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    width: 35%;
}

.badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
}

.badge-blue {
    background: #eff6ff;
    color: #2563eb;
}

.badge-green {
    background: #f0fdf4;
    color: #16a34a;
}

.badge-purple {
    background: #faf5ff;
    color: #9333ea;
}

.badge-gray {
    background: #f3f4f6;
    color: #4b5563;
}

.date-shared {
    font-size: 12.5px;
    color: #9ca3af;
}

.btn-revoke-mixed {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border: 1px solid #d1d5db;
    color: #111827;
    padding: 6px 14px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13.5px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-revoke-mixed:hover {
    border-color: #ef4444;
    background: #fef2f2;
    color: #ef4444;
}

@media (max-width: 768px) {
    .shared-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .user-info,
    .permission-info {
        width: 100%;
    }

    .action-area {
        width: 100%;
        text-align: right;
    }
}
</style>