<template>
    <div class="profile-page">
        <AppHeader />

        <div class="container content-wrapper">
            <div class="page-header slide-up-2">
                <h1 class="page-title">Quản lý tài khoản</h1>
                <p class="page-subtitle">Quản lý thông tin cá nhân và hồ sơ y tế của bạn</p>
            </div>

            <div class="profile-layout">
                <aside class="profile-sidebar slide-up-3">
                    <div class="user-summary">
                        <div class="avatar-circle-large">
                            <span class="avatar-text">{{ getInitials(sidebarInfo.fullName) }}</span>
                        </div>
                        <h3 class="sidebar-user-name">{{ sidebarInfo.fullName || 'Người dùng' }}</h3>
                        <span class="badge">{{ sidebarInfo.patientCode }}</span>
                    </div>

                    <nav class="sidebar-nav">
                        <a href="#" :class="['nav-item', { active: currentTab === 'personal' }]"
                            @click.prevent="currentTab = 'personal'">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Hồ sơ cá nhân
                        </a>
                        <a href="#" :class="['nav-item', { active: currentTab === 'family' }]"
                            @click.prevent="currentTab = 'family'">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Hồ sơ người thân
                        </a>
                        <a href="#" :class="['nav-item', { active: currentTab === 'sharing' }]"
                            @click.prevent="currentTab = 'sharing'">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                            Quản lý chia sẻ
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
                        <a href="#" :class="['nav-item', { active: currentTab === 'password' }]"
                            @click.prevent="currentTab = 'password'">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Đổi mật khẩu
                        </a>
                    </nav>
                </aside>

                <main class="profile-content slide-up-4">
                    <transition name="fade-tab" mode="out-in">
                        <PersonalProfileTab v-if="currentTab === 'personal'" />
                        <FamilyProfilesTab v-else-if="currentTab === 'family'" />
                        <SharedManagementTab v-else-if="currentTab === 'sharing'" />
                        <ChangePasswordTab v-else-if="currentTab === 'password'" />
                    </transition>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/views/system/AppHeader.vue'
import { useProfileStore } from '../../../stores/profileStore'
import PersonalProfileTab from '@/views/patient/profile/component/PersonalProfileTab.vue'
import FamilyProfilesTab from '@/views/patient/profile/component/FamilyProfilesTab.vue'
import SharedManagementTab from '@/views/patient/profile/component/SharedManagementTab.vue'
import ChangePasswordTab from '@/views/patient/profile/component/ChangePasswordTab.vue'

const profileStore = useProfileStore()
const currentTab = ref('personal')

const sidebarInfo = ref({
    fullName: '',
    patientCode: ''
})

onMounted(async () => {
    try {
        const data = await profileStore.getUserProfile()
        sidebarInfo.value.fullName = data.fullName
        sidebarInfo.value.patientCode = data.patientCode
    } catch (e) {
        console.error(e)
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.profile-page {
    --primary-color: #45C3D2;
    --primary-hover: #3ba3b0;
    --bg-white: #ffffff;
    --bg-light: #f9fafb;
    --text-dark: #111827;
    --text-gray: #4b5563;
    --border-color: #e5e7eb;
    font-family: 'Inter', -apple-system, sans-serif;
    background-color: #F4F7F9;
    background-image: radial-gradient(circle at top left, rgba(69, 195, 210, 0.08), transparent 500px), radial-gradient(circle at bottom right, rgba(69, 195, 210, 0.05), transparent 500px);
    background-attachment: fixed;
    min-height: 100vh;
    padding: 0 0 40px 0;
    color: var(--text-dark);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.content-wrapper {
    margin-top: 30px;
}

.page-header {
    margin-bottom: 30px;
}

.page-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: var(--text-dark);
}

.page-subtitle {
    color: var(--text-gray);
    font-size: 15px;
    margin: 0;
}

.profile-layout {
    display: flex;
    gap: 30px;
    align-items: flex-start;
}

.profile-sidebar,
.profile-content {
    background: var(--bg-white);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.03);
}

.profile-sidebar {
    width: 280px;
    padding: 24px 0;
    flex-shrink: 0;
}

.user-summary {
    text-align: center;
    padding: 0 20px 24px;
    border-bottom: 1px solid #f3f4f6;
    margin-bottom: 16px;
}

.avatar-circle-large {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #e0f7f5 0%, #f0fbf9 100%);
    color: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    margin: 0 auto 12px;
    box-shadow: 0 4px 10px rgba(69, 195, 210, 0.1);
}

.sidebar-user-name {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 8px 0;
}

.badge {
    display: inline-block;
    background: #f3f4f6;
    color: var(--text-gray);
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
    color: var(--text-gray);
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
    background-color: var(--bg-light);
    color: var(--text-dark);
}

.nav-item.active {
    background-color: #f0fbf9;
    color: var(--primary-color);
    border-left-color: var(--primary-color);
}

.nav-item.active svg {
    color: var(--primary-color);
}

.profile-content {
    flex: 1;
    padding: 30px;
    width: 100%;
    min-height: 400px;
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

.slide-up-2 {
    animation: fadeInUp 0.5s ease forwards 0.15s;
    opacity: 0;
}

.slide-up-3 {
    animation: fadeInUp 0.5s ease forwards 0.25s;
    opacity: 0;
}

.slide-up-4 {
    animation: fadeInUp 0.5s ease forwards 0.35s;
    opacity: 0;
}

.fade-tab-enter-active,
.fade-tab-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-tab-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-tab-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

@media (max-width: 900px) {
    .profile-layout {
        flex-direction: column;
    }

    .profile-sidebar {
        width: 100%;
    }
}
</style>