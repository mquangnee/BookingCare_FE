<template>
    <header class="header">
        <div class="header-content container">
            <div class="logo-area">
                <router-link to="/">
                    <img src="https://storage.googleapis.com/bookingcare/%24RKY6O8O.png" alt="BookingCare"
                        class="logo" />
                </router-link>
            </div>

            <nav class="main-nav">
                <router-link to="/home" class="nav-link" active-class="active">Trang chủ</router-link>
                <a href="#" class="nav-link">Chuyên khoa</a>
                <a href="#" class="nav-link">Cơ sở y tế</a>
                <a href="#" class="nav-link">Bác sĩ</a>
                <a href="#" class="nav-link">Gói khám</a>
            </nav>

            <div class="user-actions">
                <template v-if="!isAuthenticated">
                    <button class="btn-outline">Hỗ trợ</button>
                    <router-link to="/login" class="btn-primary">Đăng nhập</router-link>
                </template>

                <template v-else>
                    <router-link to="/booking" class="btn-primary-outline">Đặt lịch ngay</router-link>
                    <router-link to="/history" class="nav-link history-link">Lịch sử</router-link>

                    <div class="notification-wrapper">
                        <button class="bell-btn" @click.stop="toggleNotifications">
                            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2"
                                fill="none">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            <span v-if="unreadCount > 0" class="noti-badge">{{ unreadCount }}</span>
                        </button>

                        <div v-show="showNotifications" class="noti-dropdown">
                            <div class="noti-header">
                                <h4>Thông báo</h4>
                            </div>
                            <div class="noti-list">
                                <div v-if="notifications.length === 0" class="noti-empty">
                                    Không có thông báo nào.
                                </div>

                                <div v-for="noti in notifications" :key="noti.notificationId" class="noti-item"
                                    :class="{ 'unread': !noti.isRead }" @click="handleMarkNotificationRead(noti)">

                                    <div v-if="noti.type === EnumNotificationType.ShareProfileInvite"
                                        class="noti-icon action-icon">
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor"
                                            stroke-width="2" fill="none">
                                            <circle cx="18" cy="5" r="3"></circle>
                                            <circle cx="6" cy="12" r="3"></circle>
                                            <circle cx="18" cy="19" r="3"></circle>
                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                        </svg>
                                    </div>

                                    <div class="noti-content">
                                        <p v-html="noti.message"></p>
                                        <span class="noti-time">{{ formatDateTime(noti.createdDate) }}</span>

                                        <div v-if="noti.type === EnumNotificationType.ShareProfileInvite && !noti.isActioned"
                                            class="noti-actions mt-2">
                                            <button class="btn-accept"
                                                @click.stop="handleRespondNotification(noti.notificationId, true)">Đồng
                                                ý</button>
                                            <button class="btn-reject"
                                                @click.stop="handleRespondNotification(noti.notificationId, false)">Từ
                                                chối</button>
                                        </div>

                                        <div v-else-if="noti.type === EnumNotificationType.ShareProfileInvite && noti.isActioned"
                                            class="noti-status mt-2">
                                            <span class="text-muted">Đã xử lý</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="user-dropdown">
                        <div class="avatar-circle" @click.stop="toggleMenu">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>

                        <div class="dropdown-menu" v-show="isMenuOpen">
                            <router-link to="/profile" class="dropdown-item" active-class="active-item"
                                @click="isMenuOpen = false">Quản lý tài khoản</router-link>
                            <div class="divider"></div>
                            <a href="#" @click.prevent.stop="handleLogout" class="dropdown-item text-danger">Đăng
                                xuất</a>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import * as signalR from '@microsoft/signalr'
import { EnumNotificationType } from '../constants/enum'
import { SIGNALR_URL } from '../utils/apiConfig'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const isAuthenticated = computed(() => authStore.isAuthenticated.value)
const router = useRouter()

const isMenuOpen = ref(false)
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
    if (isMenuOpen.value) showNotifications.value = false
}

const handleLogout = async () => {
    try {
        if (connection) {
            await connection.stop();
            connection = null;
        }
        isMenuOpen.value = false;
        showNotifications.value = false;
        if (authStore.logout) {
            await authStore.logout();
        }
        window.location.href = '/home';
    } catch (error) {
        console.error("Lỗi đăng xuất:", error);
    }
}

const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
    }).format(date);
}

const showNotifications = ref(false)
const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value
    if (showNotifications.value) isMenuOpen.value = false
}

const notifications = ref([])
const unreadCount = computed(() => {
    if (!notifications.value || !Array.isArray(notifications.value)) return 0;
    return notifications.value.filter(n => !n.isRead).length;
})

const formMarkRead = ref({ notificationId: '', isRead: '' })
const handleMarkNotificationRead = async (noti) => {
    if (noti.isRead) return;
    try {
        formMarkRead.value = { notificationId: noti.notificationId, isRead: true }
        await notificationStore.markNotificationRead(formMarkRead.value);
        noti.isRead = true;
    } catch (error) {
        console.error(error);
    }
}

const formRespond = ref({ notificationId: '', isAccepted: '' })
const handleRespondNotification = async (notiId, isAccepted) => {
    try {
        formRespond.value = { notificationId: notiId, isAccepted: isAccepted }
        await notificationStore.respondNotification(formRespond.value);
        alert(`Bạn đã ${isAccepted ? 'ĐỒNG Ý' : 'TỪ CHỐI'} lời mời chia sẻ hồ sơ!`);
        const noti = notifications.value.find(n => n.notificationId === notiId);
        if (noti) {
            noti.isActioned = true;
            noti.isRead = true;
        }
    } catch (error) {
        alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
}

let connection = null;
const startSignalR = async () => {
    if (!isAuthenticated.value) return;

    connection = new signalR.HubConnectionBuilder()
        .withUrl(SIGNALR_URL, {
            accessTokenFactory: () => localStorage.getItem('accessToken')
        })
        .withAutomaticReconnect()
        .build();

    connection.on("NotificationMessage", (newNotification) => {
        const notification = {
            notificationId: newNotification.notificationId,
            receiverId: newNotification.receiverId,
            senderId: newNotification.senderId,
            message: newNotification.message,
            type: newNotification.type,
            objectId: newNotification.objectId,
            isRead: newNotification.isRead,
            isAccepted: newNotification.isAccepted,
            isActioned: newNotification.isActioned,
            createdDate: newNotification.createdDate
        };
        if (!notifications.value) notifications.value = [];
        notifications.value.unshift(notification);
    });

    try {
        await connection.start();
    } catch (err) {
        console.error("Lỗi kết nối SignalR: ", err);
    }
}

const loadOldNotifications = async () => {
    try {
        const data = await notificationStore.getNotifications()
        if (data && Array.isArray(data)) {
            notifications.value = data.map(noti => ({
                ...noti,
                isActioned: noti.isActioned !== undefined ? noti.isActioned : (noti.isAccepted !== null && noti.isAccepted !== undefined)
            }));
        }
    } catch (error) {
        console.error(error);
        notifications.value = [];
    }
}

const closeDropdowns = (e) => {
    if (!e.target.closest('.user-dropdown')) isMenuOpen.value = false;
    if (!e.target.closest('.notification-wrapper')) showNotifications.value = false;
}

onMounted(() => {
    document.addEventListener('click', closeDropdowns);
    if (isAuthenticated.value) {
        loadOldNotifications();
        startSignalR();
    }
})

watch(isAuthenticated, (newVal) => {
    if (newVal) {
        loadOldNotifications();
        startSignalR();
    }
})

onUnmounted(() => {
    document.removeEventListener('click', closeDropdowns);
    if (connection) {
        connection.stop();
    }
})
</script>

<style scoped>
.header {
    --primary-color: #45C3D2;
    --primary-hover: #3ba3b0;
    --bg-white: #ffffff;
    --bg-light: #f9fafb;
    --text-dark: #111827;
    --text-gray: #4b5563;
    --border-color: #e5e7eb;

    background-color: var(--bg-white);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    font-family: 'Inter', -apple-system, sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
}

.logo {
    height: 35px;
    cursor: pointer;
}

.main-nav {
    display: flex;
    gap: 30px;
}

.nav-link {
    text-decoration: none;
    color: var(--text-dark);
    font-weight: 500;
    font-size: 15px;
    transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
    color: var(--primary-color);
}

.user-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.btn-outline {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-dark);
    padding: 0 16px;
    height: 40px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
}

.btn-outline:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.btn-primary {
    background-color: var(--primary-color);
    color: #fff;
    border: none;
    padding: 0 20px;
    height: 40px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    white-space: nowrap;
}

.btn-primary:hover {
    background-color: var(--primary-hover);
}

.btn-primary-outline {
    color: var(--primary-color);
    border: 1.5px solid var(--primary-color);
    background-color: transparent;
    padding: 7px 18px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
}

.btn-primary-outline:hover {
    background-color: var(--primary-color);
    color: #fff;
}

.history-link {
    font-size: 14.5px;
    padding: 0 5px;
}

.user-dropdown {
    position: relative;
}

.avatar-circle {
    width: 36px;
    height: 36px;
    background-color: #f3f4f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-gray);
    cursor: pointer;
    transition: background 0.2s;
}

.avatar-circle:hover {
    background-color: #e5e7eb;
}

.avatar-circle svg {
    width: 20px;
    height: 20px;
}

.dropdown-menu {
    position: absolute;
    top: 120%;
    right: 0;
    width: 200px;
    background: #fff;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    padding: 8px 0;
    z-index: 200;
}

.dropdown-item {
    padding: 12px 20px;
    text-decoration: none;
    color: var(--text-dark);
    font-size: 14.5px;
    font-weight: 500;
    transition: background 0.2s;
}

.dropdown-item:hover {
    background-color: var(--bg-light);
    color: var(--primary-color);
}

.dropdown-item.active-item {
    color: var(--primary-color);
    background-color: #f0fbf9;
}

.text-danger {
    color: #ef4444;
}

.text-danger:hover {
    background-color: #fef2f2;
    color: #dc2626;
}

.divider {
    height: 1px;
    background-color: var(--border-color);
    margin: 4px 0;
}

.notification-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.bell-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #4b5563;
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
}

.bell-btn:hover {
    background: #f3f4f6;
    color: var(--primary-color);
}

.noti-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: bold;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
}

.noti-dropdown {
    position: absolute;
    top: 120%;
    right: 0;
    width: 360px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    border: 1px solid var(--border-color);
    z-index: 1000;
    overflow: hidden;
}

.noti-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
    background: #fdfdfd;
}

.noti-header h4 {
    margin: 0;
    font-size: 16px;
    color: var(--text-dark);
    font-weight: 600;
}

.noti-list {
    max-height: 400px;
    overflow-y: auto;
}

.noti-empty {
    padding: 30px;
    text-align: center;
    color: var(--text-gray);
    font-size: 14px;
}

.noti-item {
    display: flex;
    gap: 14px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--bg-light);
    transition: 0.2s;
    cursor: pointer;
}

.noti-item:hover {
    background: #f9fafb;
}

.noti-item.unread {
    background: #f0fbf9;
}

.noti-icon {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.action-icon {
    background: var(--primary-color);
    color: #fff;
}

.noti-content p {
    margin: 0 0 6px 0;
    font-size: 14px;
    color: var(--text-dark);
    line-height: 1.5;
}

.noti-time {
    font-size: 12px;
    color: #9ca3af;
}

.noti-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
}

.btn-accept,
.btn-reject {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: 0.2s;
}

.btn-accept {
    background: var(--primary-color);
    color: white;
}

.btn-accept:hover {
    background: var(--primary-hover);
}

.btn-reject {
    background: #f3f4f6;
    color: #4b5563;
}

.btn-reject:hover {
    background: #e5e7eb;
    color: var(--text-dark);
}

.noti-status {
    font-size: 13px;
    font-style: italic;
}

@media (max-width: 900px) {
    .main-nav {
        display: none;
    }
}
</style>