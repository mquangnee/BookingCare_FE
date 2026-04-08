<template>
    <div class="home-container">
        <AppHeader />

        <section class="hero-section">
            <div class="container hero-content slide-up-1">
                <h1 class="hero-title">Nền tảng y tế<br /> <span class="highlight">Chăm sóc sức khỏe toàn diện</span>
                </h1>
                <p class="hero-subtitle">Đặt lịch khám bệnh nhanh chóng, an toàn và bảo mật.</p>
                <div class="search-box">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" placeholder="Tìm bác sĩ, chuyên khoa, cơ sở y tế..." v-model="searchQuery" />
                    <button class="btn-search">Tìm kiếm</button>
                </div>
            </div>
        </section>

        <section class="services-section container slide-up-2">
            <div class="service-grid">
                <div class="service-card" v-for="(service, index) in services" :key="index">
                    <div class="icon-wrapper">
                        <span class="material-icon" v-html="service.icon"></span>
                    </div>
                    <h3>{{ service.title }}</h3>
                </div>
            </div>
        </section>

        <section class="highlight-section bg-light">
            <div class="container slide-up-3">
                <div class="section-header">
                    <h2>Chuyên khoa phổ biến</h2>
                    <a href="#" class="view-all">Xem thêm <span class="arrow">→</span></a>
                </div>
                <div class="item-grid">
                    <div class="item-card" v-for="(spec, index) in specialties" :key="index">
                        <div class="card-img"><img :src="spec.image" :alt="spec.title" /></div>
                        <h3 class="card-title">{{ spec.title }}</h3>
                    </div>
                </div>
            </div>
        </section>

        <section class="highlight-section">
            <div class="container slide-up-4">
                <div class="section-header">
                    <h2>Cơ sở y tế nổi bật</h2>
                    <a href="#" class="view-all">Xem thêm <span class="arrow">→</span></a>
                </div>
                <div class="item-grid">
                    <div class="item-card hospital-card" v-for="(hospital, index) in hospitals" :key="index">
                        <div class="card-img"><img :src="hospital.image" :alt="hospital.name" /></div>
                        <h3 class="card-title">{{ hospital.name }}</h3>
                    </div>
                </div>
            </div>
        </section>

        <footer class="footer">
            <div class="container">
                <p>&copy; 2026 Nền tảng y tế BookingCare. All rights reserved.</p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/views/system/AppHeader.vue'

const searchQuery = ref('')

const services = ref([
    { title: 'Khám chuyên khoa', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>' },
    { title: 'Khám từ xa', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>' },
    { title: 'Khám tổng quát', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>' },
    { title: 'Xét nghiệm y học', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><path d="M10 2v7.31"></path><path d="M14 9.3V1.99"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path><path d="M5.52 16h12.96"></path></svg>' },
])

const specialties = ref([
    { title: 'Cơ xương khớp', image: 'https://images.unsplash.com/photo-1597589827317-4c6d6e0a90bd?q=80&w=500&auto=format&fit=crop' },
    { title: 'Thần kinh', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=500&auto=format&fit=crop' },
    { title: 'Tiêu hóa', image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=500&auto=format&fit=crop' },
    { title: 'Tim mạch', image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=500&auto=format&fit=crop' }
])

const hospitals = ref([
    { name: 'Bệnh viện Hữu nghị Việt Đức', image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=500&auto=format&fit=crop' },
    { name: 'Bệnh viện Chợ Rẫy', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=500&auto=format&fit=crop' },
    { name: 'Phòng khám Đa khoa Quốc tế', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=500&auto=format&fit=crop' },
    { name: 'Bệnh viện Y học cổ truyền', image: 'https://images.unsplash.com/photo-1551076805-e18690c5e53b?q=80&w=500&auto=format&fit=crop' }
])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.home-container {
    --primary-color: #45C3D2;
    --primary-hover: #3ba3b0;
    --bg-white: #ffffff;
    --bg-light: #f9fafb;
    --text-dark: #111827;
    --text-gray: #4b5563;
    --border-color: #e5e7eb;
    font-family: 'Inter', -apple-system, sans-serif;
    background-color: var(--bg-white);
    color: var(--text-dark);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero-section {
    padding: 80px 0 60px;
    text-align: center;
    background-color: var(--bg-white);
}

.hero-title {
    font-size: 42px;
    font-weight: 800;
    color: var(--text-dark);
    margin-bottom: 15px;
    line-height: 1.2;
}

.highlight {
    color: var(--primary-color);
}

.hero-subtitle {
    font-size: 18px;
    color: var(--text-gray);
    margin-bottom: 40px;
}

.search-box {
    max-width: 650px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    background: var(--bg-white);
    border: 2px solid var(--border-color);
    border-radius: 50px;
    padding: 6px 6px 6px 20px;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
}

.search-box:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 10px 25px rgba(69, 195, 210, 0.15);
}

.search-icon {
    width: 20px;
    height: 20px;
    color: #9ca3af;
}

.search-box input {
    flex: 1;
    border: none;
    outline: none;
    padding: 12px 15px;
    font-size: 16px;
    color: var(--text-dark);
    background: transparent;
}

.btn-search {
    background-color: var(--primary-color);
    color: #fff;
    border: none;
    padding: 12px 28px;
    border-radius: 40px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-search:hover {
    background-color: var(--primary-hover);
}

.services-section {
    padding: 20px 0 60px;
}

.service-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.service-card {
    background: var(--bg-white);
    border: 1px solid var(--border-color);
    padding: 30px 20px;
    border-radius: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.service-card:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: 0 15px 30px rgba(69, 195, 210, 0.08);
}

.icon-wrapper {
    width: 60px;
    height: 60px;
    background: rgba(69, 195, 210, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
}

:deep(.icon-wrapper svg) {
    width: 28px;
    height: 28px;
}

.service-card h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0;
}

.highlight-section {
    padding: 60px 0;
}

.bg-light {
    background-color: var(--bg-light);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.section-header h2 {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
}

.view-all {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.view-all:hover .arrow {
    transform: translateX(4px);
}

.arrow {
    transition: transform 0.2s;
}

.item-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
}

.item-card {
    background: var(--bg-white);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.3s ease;
}

.item-card:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
    border-color: var(--primary-color);
}

.item-card .card-img {
    height: 160px;
    overflow: hidden;
}

.item-card .card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.item-card:hover .card-img img {
    transform: scale(1.05);
}

.card-title {
    padding: 16px;
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
}

.footer {
    text-align: center;
    padding: 40px 0;
    border-top: 1px solid var(--border-color);
    color: var(--text-gray);
    font-size: 14px;
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

.slide-up-1 {
    animation: fadeInUp 0.6s ease forwards 0.1s;
    opacity: 0;
}

.slide-up-2 {
    animation: fadeInUp 0.6s ease forwards 0.2s;
    opacity: 0;
}

.slide-up-3 {
    animation: fadeInUp 0.6s ease forwards 0.3s;
    opacity: 0;
}

.slide-up-4 {
    animation: fadeInUp 0.6s ease forwards 0.4s;
    opacity: 0;
}

@media (max-width: 900px) {

    .service-grid,
    .item-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>