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
                    <AppointmentCard v-for="item in paginatedAppointments" :key="item.id" :data="item"
                        @cancel="handleCancel" @view-result="handleViewResult" />
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

        <Transition name="fade">
            <div v-if="showResultModal" class="modal-overlay" @click.self="closeModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Kết quả khám bệnh</h2>
                        <button class="close-btn" @click="closeModal">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="modal-body" v-if="selectedAppointment">
                        <div class="appointment-summary">
                            <div class="summary-item">
                                <span class="lbl">Mã lịch hẹn:</span>
                                <span class="val text-primary">{{ selectedAppointment.appointmentCode }}</span>
                            </div>
                            <div class="summary-item">
                                <span class="lbl">Bệnh nhân:</span>
                                <span class="val">{{ selectedAppointment.patientProfileName }}</span>
                            </div>
                            <div class="summary-item">
                                <span class="lbl">Bác sĩ khám:</span>
                                <span class="val">{{ selectedAppointment.doctorName }} - {{
                                    selectedAppointment.specialtyName }}</span>
                            </div>
                            <div class="summary-item">
                                <span class="lbl">Thời gian:</span>
                                <span class="val">
                                    {{ selectedAppointment.startTime?.substring(0, 5) }} |
                                    {{ formatDate(selectedAppointment.date) }}
                                </span>
                            </div>
                        </div>

                        <hr class="modal-divider" />

                        <div class="loading-state-mini" v-if="loadingResult">
                            <div class="spinner-ring"></div>
                            <p class="loading-text">Đang tải chi tiết kết quả...</p>
                        </div>

                        <div v-else-if="currentResult">
                            <div class="result-section">
                                <div class="section-icon diagnosis-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                    </svg>
                                </div>
                                <div class="section-content">
                                    <h4>Chẩn đoán</h4>
                                    <p>{{ currentResult.diagnosis || 'Không có thông tin' }}</p>
                                </div>
                            </div>

                            <div class="result-section" v-if="currentResult.instructions">
                                <div class="section-icon instruction-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                </div>
                                <div class="section-content">
                                    <h4>Lời khuyên / Chỉ định</h4>
                                    <p>{{ currentResult.instructions }}</p>
                                </div>
                            </div>

                            <div class="prescription-wrapper"
                                v-if="currentResult.prescriptionDetails && currentResult.prescriptionDetails.length > 0">
                                <h4>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M10.5 20.5V19a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5"></path>
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        <path d="M12 11v4"></path>
                                        <path d="M10 13h4"></path>
                                    </svg>
                                    Đơn thuốc
                                </h4>
                                <ul class="medicine-list">
                                    <li v-for="med in currentResult.prescriptionDetails" :key="med.id"
                                        class="medicine-item">
                                        <div class="med-header">
                                            <span class="med-name">{{ med.medicineName }}</span>
                                            <span class="med-qty">SL: {{ med.dosage }} {{
                                                getMedicineUnitName(med.medicineUnit) }}</span>
                                        </div>
                                        <div class="med-usage">
                                            <strong>Cách dùng:</strong> {{ med.usage }}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/views/system/AppHeader.vue'
import AppointmentCard from './component/BookingHistoryCard.vue'
import { useAppointmentStore } from '../../../stores/appointmentStore'
import { notifySuccess, notifyError, messageFromCaught } from '../../../utils/notify'
import { getMedicineUnitName } from '../../../constants/enum'

const appointmentStore = useAppointmentStore()

const appointments = ref([])
const loading = ref(true)
const pageNumber = ref(1)
const itemsPerPage = ref(5)

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

// State quản lý Modal
const showResultModal = ref(false)
const loadingResult = ref(false)
const currentResult = ref(null)
const selectedAppointment = ref(null) // Thêm state lưu lịch khám được chọn

// Hàm format ngày tháng dùng trong view
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
};

const currentStatusColor = computed(() =>
    statusOptions.find(s => s.value === selectedStatus.value)?.color ?? '#9ca3af'
)

const filteredAppointments = computed(() => {
    let list = [...appointments.value]

    if (selectedStatus.value !== null) {
        list = list.filter(item => item.status === selectedStatus.value)
    }

    if (searchDoctor.value.trim()) {
        const keyword = searchDoctor.value.toLowerCase().trim()
        list = list.filter(item => item.doctorName.toLowerCase().includes(keyword))
    }

    if (searchPatient.value.trim()) {
        const keyword = searchPatient.value.toLowerCase().trim()
        list = list.filter(item => item.patientProfileName.toLowerCase().includes(keyword))
    }

    return list
})

const sortedAppointments = computed(() => {
    const list = [...filteredAppointments.value]
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

const totalCount = computed(() => filteredAppointments.value.length)
const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage.value) || 1)
const hasPrevious = computed(() => pageNumber.value > 1)
const hasNext = computed(() => pageNumber.value < totalPages.value)

const paginatedAppointments = computed(() => {
    const start = (pageNumber.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return sortedAppointments.value.slice(start, end)
})

const visiblePages = computed(() => {
    const total = totalPages.value, cur = pageNumber.value
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    if (cur <= 4) return [1, 2, 3, 4, 5, '...', total]
    if (cur >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
    return [1, '...', cur - 1, cur, cur + 1, '...', total]
})

const loadHistory = async () => {
    loading.value = true
    try {
        const res = await appointmentStore.getHistory()
        appointments.value = Array.isArray(res) ? res : (res.items || [])
    } catch (err) {
        console.error('Lỗi tải lịch sử:', err)
        appointments.value = []
    } finally {
        loading.value = false
    }
}

const applyStatusFilter = (status) => {
    selectedStatus.value = status
    pageNumber.value = 1
}

const debouncedSearch = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        pageNumber.value = 1
    }, 450)
}

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        pageNumber.value = newPage
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const handleCancel = async (id) => {
    if (confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
        try {
            await appointmentStore.cancelAppointment(id)
            notifySuccess('Hủy lịch hẹn thành công.')
            await loadHistory()
        } catch (error) {
            notifyError(messageFromCaught(error))
        }
    }
}

// Logic xử lý khi click "Xem kết quả"
const handleViewResult = async (id) => {
    // 1. Tìm thông tin lịch hẹn đang được click từ danh sách data
    selectedAppointment.value = appointments.value.find(item => item.id === id);

    showResultModal.value = true;
    loadingResult.value = true;
    currentResult.value = null;

    try {
        const res = await appointmentStore.getMedicalReport(id);
        currentResult.value = res;
    } catch (error) {
        console.error('Lỗi Modal:', error);
        notifyError(messageFromCaught(error));
        showResultModal.value = false;
    } finally {
        loadingResult.value = false;
    }
};

const closeModal = () => {
    showResultModal.value = false;
    currentResult.value = null;
    selectedAppointment.value = null;
};

onMounted(() => loadHistory())
</script>

<style scoped>
/* Các style giao diện cũ được giữ nguyên... */
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

/* ------------------- CSS MODAL KẾT QUẢ MỚI ------------------- */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(17, 24, 39, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: #fff;
    width: 100%;
    max-width: 540px;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    margin: 20px;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: #f9fafb;
}

.modal-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-dark);
}

.close-btn {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: all 0.2s;
}

.close-btn:hover {
    background: #e5e7eb;
    color: var(--text-dark);
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
}

/* Thêm style cho phần hiển thị thông tin lịch hẹn */
.appointment-summary {
    background: #f0fbf9;
    border: 1px solid #c2f0e9;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14.5px;
}

.summary-item .lbl {
    color: var(--text-gray);
    font-weight: 500;
}

.summary-item .val {
    color: var(--text-dark);
    font-weight: 600;
    text-align: right;
}

.text-primary {
    color: var(--primary-color) !important;
}

.modal-divider {
    border: 0;
    height: 1px;
    background: #f3f4f6;
    margin: 0 0 20px 0;
}

.loading-state-mini {
    padding: 30px 0;
    text-align: center;
}

.loading-text {
    text-align: center;
    color: var(--text-gray);
    margin-top: 12px;
}

.result-section {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    background: #fff;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
}

.section-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.diagnosis-icon {
    background: #eff6ff;
    color: #3b82f6;
}

.instruction-icon {
    background: #fdf2f8;
    color: #ec4899;
}

.section-content h4 {
    margin: 0 0 6px;
    font-size: 14px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
}

.section-content p {
    margin: 0;
    font-size: 16px;
    color: var(--text-dark);
    font-weight: 500;
    line-height: 1.5;
}

.prescription-wrapper {
    margin-top: 32px;
}

.prescription-wrapper h4 {
    font-size: 16px;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px;
    font-weight: 700;
}

.prescription-wrapper h4 svg {
    color: var(--primary-color);
}

.medicine-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.medicine-item {
    background: #f9fafb;
    border: 1px solid var(--border-color);
    padding: 16px;
    border-radius: 10px;
}

.med-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
}

.med-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-dark);
}

.med-qty {
    font-size: 13px;
    font-weight: 600;
    background: #e0f2fe;
    color: #0284c7;
    padding: 4px 8px;
    border-radius: 6px;
}

.med-usage {
    font-size: 14px;
    color: var(--text-gray);
    line-height: 1.5;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
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