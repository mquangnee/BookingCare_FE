<template>
    <div class="doctor-layout">
        <aside class="sidebar">
            <div class="sidebar-header">
                <img src="https://storage.googleapis.com/bookingcare/%24RKY6O8O.png" alt="BookingCare" class="logo" />
                <span class="role-badge">Dành cho Bác sĩ</span>
            </div>

            <nav class="sidebar-nav">
                <router-link to="/doctor/examination" class="nav-item" active-class="active">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                    Phòng khám bệnh
                </router-link>

                <router-link to="/doctor/schedule" class="nav-item" active-class="active">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Lịch làm việc
                </router-link>

                <router-link to="/doctor/history" class="nav-item" active-class="active">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Tra cứu bệnh án
                </router-link>

                <router-link to="/doctor/profile" class="nav-item" active-class="active">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Quản lý tài khoản
                </router-link>
            </nav>

            <div class="sidebar-footer">
                <button @click="handleLogout" class="btn-logout">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Đăng xuất
                </button>
            </div>
        </aside>

        <main class="main-wrapper">
            <header class="top-header">
                <div class="header-info">
                    <h2>Xin chào, {{ getPositionName(doctorProfile.position) }} {{ doctorProfile.fullName }}</h2>
                    <p>Hôm nay: {{ currentDate }}</p>
                </div>
            </header>

            <div class="page-content">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore';
import { useProfileStore } from '../../stores/profileStore';
import { notifyError } from '../../utils/notify';
import { getPositionName } from '../../constants/enum';

const router = useRouter()
const authStore = useAuthStore()
const profileStore = useProfileStore()

const doctorProfile = ref({
    id: '',
    userId: '',
    specialtyId: '',
    specialtyName: '',
    doctorCode: '',
    email: '',
    phoneNumber: '',
    avatarUrl: '',
    fullName: '',
    dateOfBirth: '',
    gender: 0,
    citizenId: '',
    experienceYears: 0,
    position: 0,
    workingHistory: '',
    description: '',
    status: 0,
    price: 0,
    startTime: ''
})

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

const currentDate = computed(() => {
    return new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

provide('doctorProfile', doctorProfile)

onMounted(async () => {
    try {
        const response = await profileStore.getDoctorProfile()
        doctorProfile.value = response
    } catch (error) {
        console.error('Không lấy được thông tin bác sĩ: ', error)
        notifyError('Không lấy được thông tin bác sĩ. Vui lòng thử lại sau.')
    }
})

</script>

<style scoped>
.doctor-layout {
    display: flex;
    height: 100vh;
    background-color: #F4F6F8;
    font-family: 'Inter', sans-serif;
    color: #111827;
}

.sidebar {
    width: 260px;
    background-color: #ffffff;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.sidebar-header {
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.logo {
    height: 32px;
    object-fit: contain;
}

.role-badge {
    background: #e0f7fa;
    color: #00838f;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
}

.sidebar-nav {
    flex: 1;
    padding: 24px 16px;
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
    transition: all 0.2s ease;
}

.nav-item svg {
    width: 20px;
    height: 20px;
}

.nav-item:hover {
    background-color: #f9fafb;
    color: #111827;
}

.nav-item.active {
    background-color: #e0f7fa;
    color: #00838f;
    font-weight: 600;
}

.nav-item.active svg {
    color: #45C3D2;
}

.sidebar-footer {
    padding: 24px 16px;
    border-top: 1px solid #e5e7eb;
}

.btn-logout {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: none;
    color: #dc2626;
    font-weight: 600;
    font-family: inherit;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
}

.btn-logout:hover {
    background: #fee2e2;
}

.btn-logout svg {
    width: 18px;
    height: 18px;
}

.main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.top-header {
    background: #ffffff;
    height: 70px;
    padding: 0 32px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

.header-info h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.header-info p {
    font-size: 13px;
    color: #6b7280;
    margin: 4px 0 0 0;
}

.page-content {
    flex: 1;
    padding: 24px 32px;
    overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>