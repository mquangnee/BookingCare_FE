<template>
    <aside class="sidebar">
        <div class="sidebar-brand">
            <div class="brand-logo">BC</div>
            <span class="brand-text">BookingCare</span>
        </div>

        <nav class="sidebar-nav">
            <a href="#" class="nav-item active">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Điều phối lịch
            </a>
            <!-- <a href="#" class="nav-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Bệnh nhân
            </a> -->
        </nav>

        <div class="sidebar-footer">
            <div class="user-profile">
                <div class="avatar">LT</div>
                <div class="info">
                    <strong>Lễ tân {{ receptionistProfile?.fullName }}</strong>
                    <span>Đang làm việc</span>
                </div>
            </div>
            <button class="logout-btn" @click="handleLogout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Đăng xuất
            </button>
        </div>
    </aside>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import { notifyError } from '@/utils/notify'

const router = useRouter()
const authStore = useAuthStore()
const profileStore = useProfileStore()

const receptionistProfile = ref(null)

onMounted(async () => {
    try {
        const res = await profileStore.getReceptionistProfile()
        receptionistProfile.value = res
    } catch (error) {
        console.error("Lỗi lấy thông tin lễ tân:", error)
        notifyError("Có lỗi xảy ra khi lấy thông tin lễ tân.")
    }
})

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}
</script>

<style scoped>
.sidebar {
    width: 220px;
    background: #ffffff;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    z-index: 100;
}

.sidebar-brand {
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #e5e7eb;
}

.brand-logo {
    width: 36px;
    height: 36px;
    background: #45C3D2;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.brand-text {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
}

.sidebar-nav {
    padding: 24px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    color: #4b5563;
    text-decoration: none;
    font-weight: 500;
    transition: 0.2s;
}

.nav-item svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.nav-item:hover {
    background: #f9fafb;
    color: #111827;
}

.nav-item.active {
    background: #e0f7fa;
    color: #00838f;
}

.sidebar-footer {
    padding: 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-profile .avatar {
    width: 40px;
    height: 40px;
    background: #e5e7eb;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #4b5563;
}

.user-profile .info strong {
    display: block;
    font-size: 14px;
    color: #111827;
}

.user-profile .info span {
    font-size: 12px;
    color: #10b981;
}

.logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    width: 100%;
    background: transparent;
    border: 0px #fee2e2;
    border-radius: 8px;
    color: #ef4444;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Inter', sans-serif;
}

.logout-btn svg {
    width: 18px;
    height: 18px;
}

.logout-btn:hover {
    background: #fef2f2;
    border-color: #ef4444;
}
</style>