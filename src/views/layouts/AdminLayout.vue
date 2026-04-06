<template>
    <div class="admin-container">
        <aside class="sidebar">
            <div class="sidebar-logo">
                <div class="logo-icon">+</div>
                <h2>BookingCare <span>Admin</span></h2>
            </div>

            <nav class="sidebar-nav">
                <p class="nav-label">TỔNG QUAN</p>
                <router-link to="/admin" class="nav-item" exact>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    Dashboard
                </router-link>

                <p class="nav-label">QUẢN LÝ NHÂN SỰ</p>
                <router-link to="/admin/doctors" class="nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Tài khoản Bác sĩ
                </router-link>
                <router-link to="/admin/receptionists" class="nav-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Tài khoản Lễ tân
                </router-link>

                <p class="nav-label">QUẢN LÝ DỊCH VỤ</p>
                <router-link to="/admin/specialties" class="nav-item">login
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Chuyên khoa
                </router-link>
            </nav>
        </aside>

        <main class="main-content">
            <header class="topbar">
                <div class="search-bar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" placeholder="Tìm kiếm nhanh..." />
                </div>
                <div class="topbar-actions">
                    <div class="admin-profile">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=45C3D2&color=fff" alt="Admin" />
                        <div class="profile-info">
                            <span class="name">Quản trị viên</span>
                            <span class="role">Admin</span>
                        </div>
                    </div>
                </div>
            </header>

            <div class="dynamic-content">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </main>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.admin-container {
    --primary-color: #45C3D2;
    --primary-light: rgba(69, 195, 210, 0.1);
    --bg-main: #f4f7f6;
    --bg-white: #ffffff;
    --text-dark: #111827;
    --text-gray: #6b7280;
    --border-color: #e5e7eb;

    display: flex;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-main);
}

.sidebar {
    width: 260px;
    background-color: var(--bg-white);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    z-index: 100;
}

.sidebar-logo {
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--border-color);
}

.logo-icon {
    width: 36px;
    height: 36px;
    background: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-radius: 8px;
    font-size: 20px;
}

.sidebar-logo h2 {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: var(--text-dark);
}

.sidebar-logo span {
    color: var(--primary-color);
}

.sidebar-nav {
    padding: 20px 16px;
    overflow-y: auto;
}

.nav-label {
    font-size: 11px;
    font-weight: 700;
    color: #9ca3af;
    margin: 24px 0 10px 12px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    color: var(--text-gray);
    text-decoration: none;
    font-weight: 500;
    font-size: 14.5px;
    border-radius: 8px;
    margin-bottom: 4px;
    transition: all 0.2s;
}

.nav-item svg {
    width: 20px;
    height: 20px;
}

.nav-item:hover {
    background-color: #f9fafb;
    color: var(--text-dark);
}

/* VUE ROUTER TỰ ĐỘNG ACTIVE CLASS NÀY KHI TRÙNG URL */
.nav-item.router-link-exact-active {
    background-color: var(--primary-light) !important;
    color: var(--primary-color) !important;
    font-weight: 600;
}

.main-content {
    flex: 1;
    margin-left: 260px;
    display: flex;
    flex-direction: column;
}

.topbar {
    height: 70px;
    background-color: var(--bg-white);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    position: sticky;
    top: 0;
    z-index: 99;
}

.search-bar {
    display: flex;
    align-items: center;
    background: var(--bg-main);
    padding: 8px 16px;
    border-radius: 20px;
    width: 350px;
}

.search-bar svg {
    width: 18px;
    height: 18px;
    color: #9ca3af;
    margin-right: 10px;
}

.search-bar input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: 14px;
}

.admin-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
}

.admin-profile img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
}

.profile-info {
    display: flex;
    flex-direction: column;
}

.profile-info .name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-dark);
}

.profile-info .role {
    font-size: 12px;
    color: var(--text-gray);
}

.dynamic-content {
    padding: 30px;
}

/* Hiệu ứng chuyển trang mượt mà */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>