<template>
    <div class="dashboard-page slide-up">
        <div class="page-header">
            <h1>Tổng quan hệ thống</h1>
            <p>Thống kê dữ liệu hoạt động trong ngày</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card" v-for="(stat, index) in stats" :key="index">
                <div class="stat-info">
                    <p class="stat-title">{{ stat.title }}</p>
                    <h3 class="stat-value">{{ stat.value }}</h3>
                    <p class="stat-trend" :class="stat.trend > 0 ? 'positive' : 'negative'">
                        <span class="arrow">{{ stat.trend > 0 ? '↑' : '↓' }}</span> {{ Math.abs(stat.trend) }}% so với
                        hôm qua
                    </p>
                </div>
                <div class="stat-icon" v-html="stat.icon"></div>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-card wide">
                <div class="card-header">
                    <h3>Lượt đặt khám trong tuần</h3>
                    <select class="filter-select">
                        <option>Tuần này</option>
                        <option>Tháng này</option>
                    </select>
                </div>
                <div class="mock-chart line-chart">
                    <div class="bar-col" v-for="h in [40, 60, 30, 80, 50, 90, 70]" :key="h"
                        :style="{ height: h + '%' }">
                        <div class="bar-fill"></div>
                    </div>
                </div>
            </div>

            <div class="chart-card">
                <div class="card-header">
                    <h3>Tỉ lệ Chuyên khoa</h3>
                </div>
                <div class="mock-chart doughnut-chart">
                    <div class="circle-chart">
                        <span class="inner-circle"></span>
                    </div>
                    <div class="chart-legend">
                        <div class="legend-item"><span class="dot c1"></span> Cơ xương khớp</div>
                        <div class="legend-item"><span class="dot c2"></span> Tiêu hóa</div>
                        <div class="legend-item"><span class="dot c3"></span> Thần kinh</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="table-section">
            <div class="card-header">
                <h3>Lịch khám mới nhất</h3>
                <a href="#" class="view-all">Xem tất cả</a>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Mã đặt lịch</th>
                            <th>Bệnh nhân</th>
                            <th>Bác sĩ</th>
                            <th>Chuyên khoa</th>
                            <th>Ngày - Giờ</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="apt in recentAppointments" :key="apt.id">
                            <td class="fw-600">{{ apt.id }}</td>
                            <td>{{ apt.patient }}</td>
                            <td>{{ apt.doctor }}</td>
                            <td>{{ apt.specialty }}</td>
                            <td>{{ apt.time }}</td>
                            <td>
                                <span class="status-badge" :class="apt.statusClass">{{ apt.status }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Dữ liệu giả lập cho các thẻ thống kê
const stats = ref([
    {
        title: 'Lịch khám mới',
        value: '142',
        trend: 12.5,
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
    },
    {
        title: 'Bác sĩ đang hoạt động',
        value: '86',
        trend: 2.4,
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
    },
    {
        title: 'Bệnh nhân mới',
        value: '324',
        trend: -4.2,
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
    },
    {
        title: 'Dịch vụ đang cung cấp',
        value: '45',
        trend: 0,
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>'
    }
])

// Dữ liệu giả lập cho bảng lịch hẹn
const recentAppointments = ref([
    { id: '#APT-001', patient: 'Nguyễn Văn A', doctor: 'PGS. Nguyễn Trọng Hưng', specialty: 'Cơ xương khớp', time: 'Hôm nay, 08:30', status: 'Đã xác nhận', statusClass: 'st-success' },
    { id: '#APT-002', patient: 'Trần Thị B', doctor: 'BS. Đỗ Thị Tường Vân', specialty: 'Tiêu hóa', time: 'Hôm nay, 09:15', status: 'Chờ khám', statusClass: 'st-warning' },
    { id: '#APT-003', patient: 'Lê Hoàng C', doctor: 'TS. Lê Ngọc Thành', specialty: 'Tim mạch', time: 'Hôm nay, 10:00', status: 'Hoàn thành', statusClass: 'st-info' },
    { id: '#APT-004', patient: 'Phạm Văn D', doctor: 'BS. Trần Thị Dung', specialty: 'Sản Phụ khoa', time: 'Hôm nay, 10:30', status: 'Đã hủy', statusClass: 'st-danger' },
])
</script>

<style scoped>
.dashboard-page {
    color: #111827;
}

.page-header {
    margin-bottom: 24px;
}

.page-header h1 {
    font-size: 24px;
    margin: 0 0 5px 0;
}

.page-header p {
    color: #6b7280;
    margin: 0;
    font-size: 14.5px;
}

/* STATS CARDS */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 24px;
}

.stat-card {
    background: #ffffff;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.03);
}

.stat-title {
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 10px 0;
}

.stat-value {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 10px 0;
}

.stat-trend {
    font-size: 12px;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 4px;
}

.stat-trend.positive {
    color: #10b981;
}

.stat-trend.negative {
    color: #ef4444;
}

.stat-icon {
    width: 48px;
    height: 48px;
    background: rgba(69, 195, 210, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-icon :deep(svg) {
    width: 24px;
    height: 24px;
}

/* CHARTS SECTION */
.charts-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
}

.chart-card,
.table-section {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.filter-select {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    outline: none;
    background: #fff;
}

/* MOCK CHARTS (CSS Only for visual representation) */
.mock-chart {
    height: 220px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-top: 20px;
}

.line-chart .bar-col {
    width: 10%;
    background: rgba(69, 195, 210, 0.2);
    border-radius: 4px 4px 0 0;
    position: relative;
}

.line-chart .bar-fill {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60%;
    background: #45C3D2;
    border-radius: 4px 4px 0 0;
}

.doughnut-chart {
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.circle-chart {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: conic-gradient(#45C3D2 0% 45%, #f59e0b 45% 75%, #3b82f6 75% 100%);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.inner-circle {
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
}

.chart-legend {
    display: flex;
    gap: 15px;
    font-size: 12px;
    color: #6b7280;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.dot.c1 {
    background: #45C3D2;
}

.dot.c2 {
    background: #f59e0b;
}

.dot.c3 {
    background: #3b82f6;
}

/* TABLE SECTION */
.view-all {
    color: #45C3D2;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
}

.table-responsive {
    overflow-x: auto;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
}

.admin-table th {
    text-align: left;
    padding: 12px 16px;
    color: #6b7280;
    font-size: 13px;
    font-weight: 600;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f9fafb;
}

.admin-table td {
    padding: 16px;
    font-size: 14px;
    border-bottom: 1px solid #e5e7eb;
}

.fw-600 {
    font-weight: 600;
}

.status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.st-success {
    background: #dcfce7;
    color: #16a34a;
}

.st-warning {
    background: #fef9c3;
    color: #ca8a04;
}

.st-info {
    background: #e0f2fe;
    color: #0284c7;
}

.st-danger {
    background: #fee2e2;
    color: #dc2626;
}

.slide-up {
    animation: fadeInUp 0.4s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(15px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>