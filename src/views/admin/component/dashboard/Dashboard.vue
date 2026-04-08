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

                    <p v-if="index === 0" class="stat-trend" :class="stat.trend >= 0 ? 'positive' : 'negative'">
                        <span class="arrow">{{ stat.trend >= 0 ? '↑' : '↓' }}</span>
                        {{ Math.abs(stat.trend) }}% so với hôm qua
                    </p>
                    <div v-else class="stat-spacer"></div>
                </div>
                <div class="stat-icon" v-html="stat.icon"></div>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-card wide">
                <div class="card-header">
                    <h3>Lượt đặt khám trong tuần</h3>
                </div>
                <div class="bar-chart-container">
                    <div v-for="(item, idx) in weeklyStats" :key="idx" class="bar-col-wrapper">
                        <div class="bar-track">
                            <div class="bar-col" :style="{ height: calculateBarHeight(item.value) + '%' }">
                                <div class="bar-fill">
                                    <span class="bar-value">{{ item.value }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="bar-label-group">
                            <span class="day-name">{{ item.label }}</span>
                            <span class="day-date">{{ formatDateShort(item.date) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chart-card">
                <div class="card-header">
                    <div class="header-titles">
                        <h3>Tỉ lệ Chuyên khoa</h3>
                        <p class="card-subtitle" v-if="currentWeekRange">{{ currentWeekRange }}</p>
                    </div>
                </div>
                <div class="mock-chart doughnut-chart">
                    <div class="circle-chart" :style="{ background: doughnutGradient }">
                        <span class="inner-circle"></span>
                    </div>
                    <div class="chart-legend">
                        <div v-for="(item, idx) in specialtyStats" :key="idx" class="legend-item" :title="item.label">
                            <span class="dot"
                                :style="{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }"></span>
                            <span class="legend-text">{{ item.label }} ({{ item.value }})</span>
                        </div>
                        <div v-if="specialtyStats.length === 0" class="empty-legend">
                            Chưa có dữ liệu tuần này
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="table-section">
            <div class="card-header">
                <h3>Lịch khám mới nhất</h3>
                <router-link to="/admin/appointments" class="view-all">Xem tất cả</router-link>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Mã đặt lịch</th>
                            <th>Bệnh nhân</th>
                            <th>Bác sĩ</th>
                            <th>Ngày khám - Ca khám</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="apt in recentAppointments" :key="apt.id">
                            <td class="fw-600">{{ apt.id }}</td>
                            <td>{{ apt.patient }}</td>
                            <td>{{ apt.doctor }}</td>
                            <td>{{ apt.time }}</td>
                        </tr>
                        <tr v-if="recentAppointments.length === 0">
                            <td colspan="4" class="empty-table">Đang tải dữ liệu hoặc không có lịch hẹn...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'

const dashboardStore = useDashboardStore()

const CHART_COLORS = [
    '#45C3D2', '#f59e0b', '#6366f1', '#10b981',
    '#a855f7', '#ec4899', '#06b6d4', '#f43f5e'
];

const currentWeekRange = ref('');

const formatDateShort = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
};

const formatTime = (t) => t ? t.substring(0, 5) : '';
const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const stats = ref([
    { title: 'Lịch khám mới', value: '0', trend: 0, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' },
    { title: 'Bác sĩ đang hoạt động', value: '0', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
    { title: 'Bệnh nhân đang hoạt động', value: '0', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
    { title: 'Dịch vụ đang cung cấp', value: '0', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#45C3D2" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>' }
])

const weeklyStats = ref([
    { label: 'Thứ 2', value: 0, date: '' },
    { label: 'Thứ 3', value: 0, date: '' },
    { label: 'Thứ 4', value: 0, date: '' },
    { label: 'Thứ 5', value: 0, date: '' },
    { label: 'Thứ 6', value: 0, date: '' },
    { label: 'Thứ 7', value: 0, date: '' },
    { label: 'Chủ Nhật', value: 0, date: '' }
]);

const specialtyStats = ref([]);
const recentAppointments = ref([]);

const calculateBarHeight = (val) => {
    const max = Math.max(...weeklyStats.value.map(s => s.value), 1);
    return (val / max) * 100;
};

const doughnutGradient = computed(() => {
    const total = specialtyStats.value.reduce((s, i) => s + i.value, 0);
    if (total === 0) return '#f3f4f6';

    let curr = 0;
    const p = specialtyStats.value.map((i, idx) => {
        const start = curr;
        curr += (i.value / total) * 100;
        return `${CHART_COLORS[idx % CHART_COLORS.length]} ${start}% ${curr}%`;
    });
    return `conic-gradient(${p.join(', ')})`;
});

onMounted(async () => {
    try {
        const [summary, weeklyData, specialtyData] = await Promise.all([
            dashboardStore.GetDashboardSummary(),
            dashboardStore.GetWeeklyBookingData(),
            dashboardStore.GetWeeklySpecialtyData()
        ]);

        if (summary) {
            stats.value[0].value = summary.appointments.total.toLocaleString();
            stats.value[0].trend = summary.appointments.balance || 0;
            stats.value[1].value = summary.doctors.total.toLocaleString();
            stats.value[2].value = summary.patients.total.toLocaleString();
            stats.value[3].value = summary.services.total.toLocaleString();

            recentAppointments.value = summary.appointments.data.slice(0, 5).map(apt => ({
                id: apt.appointmentCode,
                patient: apt.patientName || 'Khách hàng',
                doctor: apt.doctorName || 'Bác sĩ',
                time: `${formatDate(apt.date)} - (${formatTime(apt.startTime)} - ${formatTime(apt.endTime)})`
            }));
        }

        if (weeklyData && weeklyData.length > 0) {
            weeklyStats.value = weeklyData;
            const startOfWeek = formatDate(weeklyData[0].date);
            const endOfWeek = formatDate(weeklyData[weeklyData.length - 1].date);
            currentWeekRange.value = `Từ ${startOfWeek} đến ${endOfWeek}`;
        }

        if (specialtyData && specialtyData.length > 0) {
            specialtyStats.value = specialtyData;
        }

    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    }
});
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
    font-weight: 700;
    margin: 0;
}

.page-header p {
    color: #6b7280;
    font-size: 14px;
    margin-top: 4px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 24px;
}

.stat-card {
    background: #fff;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    transition: 0.3s;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.05);
}

.stat-title {
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
}

.stat-value {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
}

.stat-trend {
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 18px;
}

.stat-trend.positive {
    color: #10b981;
}

.stat-trend.negative {
    color: #ef4444;
}

.stat-spacer {
    height: 18px;
}

.stat-icon {
    width: 48px;
    height: 48px;
    background: rgba(69, 195, 210, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #45C3D2;
}

.stat-icon :deep(svg) {
    width: 24px;
    height: 24px;
}

.charts-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
}

.chart-card,
.table-section {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    padding: 24px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.card-header h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
}

.header-titles {
    display: flex;
    flex-direction: column;
}

.header-titles h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
}

.card-subtitle {
    margin: 4px 0 0 0;
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
}

.bar-chart-container {
    height: 250px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    padding-top: 30px;
}

.bar-col-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.bar-track {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 12px;
}

.bar-col {
    width: 45px;
    background: #45C3D222;
    border-radius: 6px 6px 0 0;
    position: relative;
    transition: height 0.6s ease;
}

.bar-fill {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #45C3D2;
    border-radius: 6px 6px 0 0;
}

.bar-label-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
}

.day-name {
    font-size: 12px;
    font-weight: 600;
    color: #4b5563;
}

.day-date {
    font-size: 11px;
    color: #9ca3af;
}

.bar-value {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-weight: 700;
    color: #45C3D2;
}

.doughnut-chart {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    width: 100%;
}

.circle-chart {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    transition: 0.5s;
}

.inner-circle {
    width: 90px;
    height: 90px;
    background: #fff;
    border-radius: 50%;
}

.chart-legend {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 12px;
    row-gap: 14px;
    padding: 0 10px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #4b5563;
}

.legend-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
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

.dot.c4 {
    background: #10b981;
}

.dot.c5 {
    background: #6366f1;
}

.view-all {
    color: #45C3D2;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    transition: 0.2s;
}

.view-all:hover {
    color: #3ba3b0;
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
    padding: 14px 16px;
    background: #f9fafb;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    border-bottom: 1px solid #e5e7eb;
}

.admin-table td {
    padding: 16px;
    font-size: 14px;
    border-bottom: 1px solid #e5e7eb;
}

.fw-600 {
    font-weight: 600;
    color: #111827;
}

.st-success {
    background: #dcfce7;
    color: #16a34a;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
}

.empty-table {
    text-align: center;
    color: #9ca3af;
    padding: 40px !important;
}

.slide-up {
    animation: fadeInUp 0.5s ease-out;
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
</style>