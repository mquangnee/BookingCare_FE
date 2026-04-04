<template>
    <div class="history-page">
        <AppHeader />

        <div class="page-hero">
            <div class="hero-inner">
                <div class="hero-text">
                    <h1 class="hero-title">Lịch sử đặt lịch</h1>
                    <p class="hero-sub">Xem và quản lý toàn bộ lịch hẹn khám bệnh của bạn</p>
                </div>
                <router-link to="/booking" class="btn-book-now">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Đặt lịch mới
                </router-link>
            </div>
        </div>

        <div class="page-body">

            <div class="toolbar">
                <div class="toolbar-item">
                    <label class="filter-label">Trạng thái</label>
                    <div class="control-wrap">
                        <span class="ctrl-icon dot-icon" :style="{ background: currentStatusColor }"></span>
                        <select :value="selectedStatus === null ? 'null' : String(selectedStatus)"
                            @change="applyStatusFilter($event.target.value === 'null' ? null : Number($event.target.value))"
                            class="filter-select">
                            <option v-for="s in statusOptions" :key="String(s.value)" :value="String(s.value)">
                                {{ s.label }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Bác sĩ -->
                <div class="toolbar-item">
                    <label class="filter-label">Bác sĩ</label>
                    <div class="control-wrap">
                        <svg class="ctrl-icon" width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input v-model="searchDoctor" @input="debouncedSearch" type="text" placeholder="Tên bác sĩ..."
                            class="filter-input" />
                    </div>
                </div>

                <!-- Bệnh nhân -->
                <div class="toolbar-item">
                    <label class="filter-label">Bệnh nhân</label>
                    <div class="control-wrap">
                        <svg class="ctrl-icon" width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input v-model="searchPatient" @input="debouncedSearch" type="text"
                            placeholder="Tên bệnh nhân..." class="filter-input" />
                    </div>
                </div>

                <!-- Sắp xếp -->
                <div class="toolbar-item">
                    <label class="filter-label">Sắp xếp</label>
                    <div class="control-wrap">
                        <svg class="ctrl-icon" width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="6" y1="12" x2="18" y2="12"></line>
                            <line x1="9" y1="18" x2="15" y2="18"></line>
                        </svg>
                        <select v-model="sortKey" class="filter-select">
                            <option value="date_desc">Ngày mới nhất</option>
                            <option value="date_asc">Ngày cũ nhất</option>
                            <option value="doctor_asc">Bác sĩ A → Z</option>
                            <option value="doctor_desc">Bác sĩ Z → A</option>
                            <option value="patient_asc">Bệnh nhân A → Z</option>
                            <option value="status_asc">Trạng thái</option>
                        </select>
                    </div>
                </div>

            </div>

            <div class="summary-bar" v-if="!loading">
                <span class="total-count"><strong>{{ totalCount }}</strong> lịch hẹn</span>
                <span class="page-info-inline" v-if="totalPages > 1">Trang {{ pageNumber }} / {{ totalPages }}</span>
            </div>

            <div v-if="loading" class="loading-state">
                <div class="spinner-ring"></div>
                <p>Đang tải dữ liệu...</p>
            </div>

            <div v-else-if="sortedAppointments.length === 0" class="empty-state">
                <div class="empty-icon-wrap">
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </div>
                <h3>Không có lịch hẹn nào</h3>
                <p>Thử thay đổi bộ lọc hoặc đặt lịch khám mới.</p>
                <router-link to="/booking" class="btn-empty-book">Đặt lịch ngay</router-link>
            </div>

            <div v-else class="list-wrapper">
                <TransitionGroup name="card-list" tag="div" class="card-list">
                    <AppointmentCard v-for="item in sortedAppointments" :key="item.id" :data="item"
                        @cancel="handleCancel" />
                </TransitionGroup>

                <div class="pagination" v-if="totalPages > 1">
                    <button class="page-btn" :disabled="!hasPrevious" @click="changePage(pageNumber - 1)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        Trước
                    </button>
                    <div class="page-numbers">
                        <button v-for="p in visiblePages" :key="p"
                            :class="['page-num', { active: p === pageNumber, ellipsis: p === '...' }]"
                            :disabled="p === '...'" @click="p !== '...' && changePage(p)">{{ p }}</button>
                    </div>
                    <button class="page-btn" :disabled="!hasNext" @click="changePage(pageNumber + 1)">
                        Sau
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '../component/AppHeader.vue'
import AppointmentCard from '../component/BookingHistoryCard.vue'
import { useAppointmentStore } from '../stores/appointmentStore'

const appointmentStore = useAppointmentStore()

const appointments = ref([])
const loading = ref(true)
const totalCount = ref(0)
const totalPages = ref(1)
const pageNumber = ref(1)
const hasNext = ref(false)
const hasPrevious = ref(false)

const selectedStatus = ref(null)
const searchDoctor = ref('')
const searchPatient = ref('')
const sortKey = ref('date_desc')

let debounceTimer = null

const statusOptions = [
    { value: null, label: 'Tất cả', color: '#9ca3af' },
    { value: 0, label: 'Chờ xác nhận', color: '#f59e0b' },
    { value: 1, label: 'Đã xác nhận', color: '#45C3D2' },
    { value: 2, label: 'Đang diễn ra', color: '#3b82f6' },
    { value: 3, label: 'Hoàn thành', color: '#10b981' },
    { value: 4, label: 'Đã hủy', color: '#ef4444' },
]

const currentStatusColor = computed(() =>
    statusOptions.find(s => s.value === selectedStatus.value)?.color ?? '#9ca3af'
)

const sortedAppointments = computed(() => {
    const list = [...appointments.value]
    switch (sortKey.value) {
        case 'date_asc': return list.sort((a, b) => new Date(a.date) - new Date(b.date))
        case 'date_desc': return list.sort((a, b) => new Date(b.date) - new Date(a.date))
        case 'doctor_asc': return list.sort((a, b) => a.doctorName.localeCompare(b.doctorName, 'vi'))
        case 'doctor_desc': return list.sort((a, b) => b.doctorName.localeCompare(a.doctorName, 'vi'))
        case 'patient_asc': return list.sort((a, b) => a.patientProfileName.localeCompare(b.patientProfileName, 'vi'))
        case 'status_asc': return list.sort((a, b) => a.status - b.status)
        default: return list
    }
})

const visiblePages = computed(() => {
    const total = totalPages.value, cur = pageNumber.value
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    if (cur <= 4) return [1, 2, 3, 4, 5, '...', total]
    if (cur >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
    return [1, '...', cur - 1, cur, cur + 1, '...', total]
})

const loadData = async (page = 1) => {
    loading.value = true
    try {
        const payload = {
            pageNumber: page,
            ...(selectedStatus.value !== null && { status: selectedStatus.value }),
            ...(searchDoctor.value.trim() && { doctorName: searchDoctor.value.trim() }),
            ...(searchPatient.value.trim() && { patientProfileName: searchPatient.value.trim() }),
        }
        const res = await appointmentStore.getHistory(payload)
        appointments.value = res.items
        totalCount.value = res.totalCount
        totalPages.value = res.totalPages
        pageNumber.value = res.pageNumber
        hasNext.value = res.hasNextPage
        hasPrevious.value = res.hasPreviousPage
    } catch (err) {
        console.error('Lỗi tải lịch sử:', err)
    } finally {
        loading.value = false
    }
}

const applyStatusFilter = (status) => { selectedStatus.value = status; loadData(1) }
const debouncedSearch = () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(() => loadData(1), 450) }
const changePage = (newPage) => { loadData(newPage); window.scrollTo({ top: 0, behavior: 'smooth' }) }

const handleCancel = async (id) => {
    if (confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
        try {
            await appointmentStore.cancelAppointment(id)
            alert('Hủy lịch hẹn thành công.')
        } catch (error) {
            alert(String(error.message || error).replace(/^Error:\s*/, '').trim())
        }
        loadData(pageNumber.value)
    }
}

onMounted(() => loadData())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.history-page {
    --primary-color: #45C3D2;
    --primary-hover: #3ba3b0;
    --bg-white: #ffffff;
    --bg-light: #f9fafb;
    --text-dark: #111827;
    --text-gray: #4b5563;
    --border-color: #e5e7eb;
    min-height: 100vh;
    background-color: #F4F7F9;
    background-image:
        radial-gradient(circle at top left, rgba(69, 195, 210, 0.08), transparent 500px),
        radial-gradient(circle at bottom right, rgba(69, 195, 210, 0.05), transparent 500px);
    background-attachment: fixed;
    font-family: 'Inter', -apple-system, sans-serif;
    color: var(--text-dark);
}

.page-hero {
    background: #ffffff;
    border-bottom: 1px solid var(--border-color);
    padding: 40px 0 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.hero-inner {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
}

.hero-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px;
    color: var(--text-dark);
}

.hero-sub {
    font-size: 15px;
    color: var(--text-gray);
    margin: 0;
}

.btn-book-now {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--primary-color);
    color: #fff;
    padding: 10px 22px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.2s, transform 0.15s;
    flex-shrink: 0;
}

.btn-book-now:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
}

.page-body {
    max-width: 960px;
    margin: 0 auto;
    padding: 32px 24px 60px;
}

.toolbar {
    background: var(--bg-white);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 18px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    align-items: end;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.03);
}

.toolbar-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.filter-label {
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
}

.control-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.ctrl-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
    flex-shrink: 0;
}

.dot-icon {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transform: translateY(-50%);
    transition: background 0.2s;
}

.filter-select,
.filter-input {
    width: 100%;
    padding: 9px 12px 9px 32px;
    border: 1.5px solid var(--border-color);
    border-radius: 8px;
    font-size: 14.5px;
    font-family: inherit;
    color: var(--text-dark);
    background: var(--bg-white);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}

.filter-select {
    cursor: pointer;
}

.filter-input::placeholder {
    color: #9ca3af;
}

.filter-select:focus,
.filter-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px rgba(69, 195, 210, 0.12);
}

.summary-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-size: 14.5px;
    color: var(--text-gray);
}

.total-count strong {
    color: var(--text-dark);
    font-weight: 700;
}

.page-info-inline {
    font-weight: 500;
}

.loading-state {
    text-align: center;
    padding: 80px 0;
    color: #9ca3af;
    font-size: 15px;
}

.spinner-ring {
    width: 40px;
    height: 40px;
    border: 3px solid #e5e7eb;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.empty-state {
    text-align: center;
    padding: 72px 24px;
    background: var(--bg-white);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.03);
}

.empty-icon-wrap {
    margin-bottom: 16px;
}

.empty-state h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0 0 8px;
}

.empty-state p {
    font-size: 15px;
    color: var(--text-gray);
    margin: 0 0 24px;
}

.btn-empty-book {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--primary-color);
    color: #fff;
    padding: 10px 26px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s;
}

.btn-empty-book:hover {
    background: var(--primary-hover);
}

.card-list {
    display: flex;
    flex-direction: column;
}

.card-list-enter-active,
.card-list-leave-active {
    transition: all 0.25s ease;
}

.card-list-enter-from {
    opacity: 0;
    transform: translateY(12px);
}

.card-list-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 36px;
    flex-wrap: wrap;
}

.page-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 18px;
    border: 1.5px solid var(--border-color);
    background: var(--bg-white);
    border-radius: 8px;
    font-size: 14.5px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
}

.page-btn:hover:not(:disabled) {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: #f0fbf9;
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 4px;
}

.page-num {
    width: 38px;
    height: 38px;
    border: 1.5px solid var(--border-color);
    background: var(--bg-white);
    border-radius: 8px;
    font-size: 14.5px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.18s;
    font-family: inherit;
}

.page-num.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
    font-weight: 700;
}

.page-num:hover:not(.active):not(.ellipsis) {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: #f0fbf9;
}

.page-num.ellipsis {
    border: none;
    cursor: default;
    background: transparent;
    color: #9ca3af;
}

@media (max-width: 768px) {
    .toolbar {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 480px) {
    .hero-inner {
        flex-direction: column;
        align-items: flex-start;
    }

    .toolbar {
        grid-template-columns: 1fr;
    }
}
</style>