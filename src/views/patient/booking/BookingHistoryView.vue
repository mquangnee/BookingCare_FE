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
                <div class="modal-content modal-lg">
                    <div class="modal-header bg-primary-light">
                        <div>
                            <h2 class="text-primary-dark">Chi tiết Bệnh án</h2>
                            <p class="mb-0 text-sm mt-1">Ngày khám: {{ formatDate(selectedAppointment?.date) }}</p>
                        </div>
                        <button class="close-btn" @click="closeModal">&times;</button>
                    </div>

                    <div class="modal-body" v-if="selectedAppointment">
                        <div class="patient-summary-card">
                            <div class="avatar-circle">{{ selectedAppointment?.patientProfileName.charAt(0) }}</div>
                            <div class="ps-info">
                                <h3>{{ selectedAppointment?.patientProfileName }}</h3>
                                <p>Mã lịch hẹn: {{ selectedAppointment?.appointmentCode }} | Bác sĩ khám: {{ selectedAppointment?.doctorName }}</p>
                            </div>
                        </div>

                        <div class="loading-state-mini" v-if="loadingResult">
                            <div class="spinner-ring"></div>
                            <p class="loading-text">Đang tải chi tiết kết quả...</p>
                        </div>

                        <div v-else-if="currentResult">
                            <div class="detail-section mt-4">
                                <h4 class="section-title">1. Chẩn đoán lâm sàng</h4>
                                <div class="info-box">
                                    <div>{{ currentResult?.diagnosis || 'Không có thông tin' }}</div>
                                </div>
                            </div>

                            <div class="detail-section mt-4">
                                <h4 class="section-title">2. Lời khuyên & Chỉ định</h4>
                                <div class="info-box bg-yellow-50 text-yellow-900">
                                    <div>{{ currentResult?.instructions || 'Không có chỉ định đặc biệt. Theo dõi thêm tại nhà.' }}</div>
                                </div>
                            </div>

                            <div class="detail-section mt-4">
                                <h4 class="section-title">3. Đơn thuốc (Kê toa)</h4>
                                <div v-if="currentResult?.prescriptionDetails && currentResult?.prescriptionDetails?.length > 0" class="prescription-wrapper">
                                    <table class="prescription-table">
                                        <thead>
                                            <tr>
                                                <th>Tên thuốc</th>
                                                <th style="width: 100px; text-align: center;">Số lượng</th>
                                                <th>Cách dùng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="med in currentResult.prescriptionDetails" :key="med.id">
                                                <td class="font-medium">{{ med.medicineName }}</td>
                                                <td class="text-center">{{ med.dosage }} {{ getMedicineUnitName(med.medicineUnit) }}</td>
                                                <td class="text-gray">{{ med.usage }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div v-else class="info-box text-gray text-center italic">
                                    Không có kê đơn thuốc.
                                </div>
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

const showResultModal = ref(false)
const loadingResult = ref(false)
const currentResult = ref(null)
const selectedAppointment = ref(null)

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

const handleViewResult = async (id) => {
    selectedAppointment.value = appointments.value.find(item => item.id === id);

    showResultModal.value = true;
    loadingResult.value = true;
    currentResult.value = null;

    try {
        const res = await appointmentStore.getMedicalReportPatient(id);
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

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(17, 24, 39, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    overflow: hidden;
}

.modal-lg {
    width: 700px;
    max-width: 95%;
}

.modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.bg-primary-light {
    background-color: #f0fbfc;
}

.text-primary-dark {
    color: #45C3D2;
    margin: 0;
    font-size: 20px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #6b7280;
    cursor: pointer;
    line-height: 1;
    margin-top: -4px;
}

.close-btn:hover {
    color: #111827;
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
    background-color: #fff;
}

.patient-summary-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}

.avatar-circle {
    width: 50px;
    height: 50px;
    background: #45C3D2;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    flex-shrink: 0;
}

.ps-info h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
    color: #111827;
}

.ps-info p {
    margin: 0;
    font-size: 13px;
    color: #6b7280;
}

.section-title {
    font-size: 15px;
    color: #374151;
    font-weight: 600;
    margin: 0 0 12px 0;
    border-bottom: 2px solid #f3f4f6;
    padding-bottom: 8px;
}

.info-box {
    padding: 12px 16px;
    background: #f9fafb;
    border-radius: 8px;
    font-size: 14px;
    color: #111827;
    line-height: 1.5;
    border: 1px solid #f3f4f6;
}

.bg-yellow-50 {
    background-color: #fefce8;
    border-color: #fef08a;
}

.text-yellow-900 {
    color: #713f12;
}

.italic {
    font-style: italic;
}

.prescription-wrapper {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
}

.prescription-table {
    width: 100%;
    border-collapse: collapse;
}

.prescription-table th,
.prescription-table td {
    padding: 12px;
    font-size: 14px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
}

.prescription-table th {
    background: #f9fafb;
    color: #4b5563;
    font-weight: 600;
}

.prescription-table tr:last-child td {
    border-bottom: none;
}

.font-medium {
    font-weight: 500;
    color: #111827;
}

.mt-4 {
    margin-top: 24px;
}

.mt-1 {
    margin-top: 4px;
}

.mb-0 {
    margin-bottom: 0;
}

.text-sm {
    font-size: 13px;
}

.text-center {
    text-align: center;
}

.text-gray {
    color: #6b7280;
}

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