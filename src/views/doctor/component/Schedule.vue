<template>
    <div class="schedule-page slide-up">
        <div class="card schedule-layout">
            <div class="panel-header">
                <h2>Lịch làm việc tuần này</h2>
                <button class="btn-primary" @click="openRegisterModal">
                    <svg class="fixed-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Đăng ký lịch làm việc
                </button>
            </div>

            <div class="calendar-wrapper">
                <table class="gcal-table">
                    <thead>
                        <tr>
                            <th class="gcal-time-header">Ca trực</th>
                            <th v-for="day in weekDays" :key="day.date">
                                <div class="gcal-day-name">{{ day.dayName }}</div>
                                <div class="gcal-day-date" :class="{ 'today': day.isToday }">{{ day.dateNumber }}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="shift in shifts" :key="shift.id">
                            <td class="gcal-time-cell">
                                <strong>{{ shift.name }}</strong>
                                <span>{{ shift.time }}</span>
                            </td>
                            <td v-for="day in weekDays" :key="day.date" class="gcal-cell">
                                <div v-if="isRegistered(day.date, shift.id)" class="gcal-event">
                                    <div class="event-title">Ca {{ shift.name }}</div>
                                    <div class="event-time">{{ shift.time }}</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Teleport to="body">
            <div v-if="isRegModalOpen" class="modal-overlay" @click.self="closeRegModal">
                <div class="modal-content modal-sm slide-down">
                    <div class="modal-header">
                        <h2>Đăng ký lịch làm việc</h2>
                        <button class="close-btn" @click="closeRegModal">&times;</button>
                    </div>
                    <div class="modal-body form-grid">
                        <div class="form-group">
                            <label>Chọn ngày làm việc <span class="text-red">*</span></label>
                            <input type="date" v-model="regForm.date" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Chọn Ca trực <span class="text-red">*</span></label>
                            <select v-model="regForm.shiftId" class="form-control">
                                <option value="">-- Chọn ca trực --</option>
                                <option v-for="shift in shifts" :key="shift.id" :value="shift.id">
                                    Ca {{ shift.name }} ({{ shift.time }})
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel" @click="closeRegModal">Hủy</button>
                        <button class="btn-submit" @click="submitRegistration">Đăng ký</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Dữ liệu khung Lịch (Shifts)
const shifts = [
    { id: 'morning', name: 'Sáng', time: '08:00 - 12:00' },
    { id: 'afternoon', name: 'Chiều', time: '13:30 - 17:30' },
    { id: 'evening', name: 'Tối', time: '18:00 - 21:00' }
]

// Dữ liệu Ngày trong tuần
const weekDays = [
    { dayName: 'Thứ 2', dateNumber: '10', date: '2026-04-10', isToday: false },
    { dayName: 'Thứ 3', dateNumber: '11', date: '2026-04-11', isToday: false },
    { dayName: 'Thứ 4', dateNumber: '12', date: '2026-04-12', isToday: false },
    { dayName: 'Thứ 5', dateNumber: '13', date: '2026-04-13', isToday: false },
    { dayName: 'Thứ 6', dateNumber: '14', date: '2026-04-14', isToday: true }, // Giả lập hôm nay
    { dayName: 'Thứ 7', dateNumber: '15', date: '2026-04-15', isToday: false },
    { dayName: 'CN', dateNumber: '16', date: '2026-04-16', isToday: false }
]

// Dữ liệu lịch đã đăng ký (Mock)
const registeredShifts = ref([
    { date: '2026-04-10', shiftId: 'morning' },
    { date: '2026-04-10', shiftId: 'afternoon' },
    { date: '2026-04-12', shiftId: 'morning' },
    { date: '2026-04-14', shiftId: 'evening' }
])

const isRegistered = (date, shiftId) => {
    return registeredShifts.value.some(s => s.date === date && s.shiftId === shiftId)
}

// --- LOGIC MODAL ĐĂNG KÝ ---
const isRegModalOpen = ref(false)
const regForm = ref({ date: '', shiftId: '' })

const openRegisterModal = () => {
    regForm.value = { date: '', shiftId: '' }
    isRegModalOpen.value = true
}

const closeRegModal = () => {
    isRegModalOpen.value = false
}

const submitRegistration = () => {
    if (!regForm.value.date || !regForm.value.shiftId) {
        alert('Vui lòng chọn đầy đủ Ngày và Ca trực!')
        return
    }

    // Kiểm tra trùng lặp
    if (isRegistered(regForm.value.date, regForm.value.shiftId)) {
        alert('Bạn đã đăng ký ca trực này rồi!')
        return
    }

    // Đẩy vào mảng (Mô phỏng API)
    registeredShifts.value.push({
        date: regForm.value.date,
        shiftId: regForm.value.shiftId
    })

    closeRegModal()
}
</script>

<style scoped>
.schedule-page {
    height: calc(100vh - 120px);
}

.card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.panel-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
}

.panel-header h2 {
    font-size: 18px;
    margin: 0;
    color: #111827;
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: 0.2s;
    background-color: #45C3D2;
    color: #fff;
    border: none;
    padding: 8px 16px;
    font-size: 13px;
    width: fit-content !important; 
    white-space: nowrap;
}

.btn-primary:hover {
    background-color: #3ba3b0;
}

.fixed-icon {
    width: 18px !important;
    height: 18px !important;
    flex-shrink: 0;
}

/* ================= GIAO DIỆN GOOGLE CALENDAR ================= */
.calendar-wrapper {
    flex: 1;
    overflow-y: auto;
    background: #f9fafb;
    padding: 24px;
}

.gcal-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
}

.gcal-table th,
.gcal-table td {
    border: 1px solid #e5e7eb;
}

/* Phần Header Ngày */
.gcal-table th {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
}

.gcal-time-header {
    width: 120px;
    background: #fff;
    border-right: 1px solid #e5e7eb;
}

.gcal-day-name {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    margin-bottom: 4px;
}

.gcal-day-date {
    font-size: 22px;
    font-weight: 400;
    color: #111827;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

/* Hiệu ứng nổi bật ngày hiện tại */
.gcal-day-date.today {
    background: #45C3D2;
    color: #fff;
    border-radius: 50%;
    font-weight: 600;
}

/* Phần Cột Thời Gian */
.gcal-time-cell {
    text-align: center;
    padding: 16px;
    border-right: 1px solid #e5e7eb;
    color: #374151;
}

.gcal-time-cell strong {
    display: block;
    font-size: 15px;
    color: #111827;
}

.gcal-time-cell span {
    font-size: 12px;
    color: #6b7280;
}

/* Phần Lưới Ô (Cells) */
.gcal-cell {
    height: 120px;
    vertical-align: top;
    padding: 8px;
    position: relative;
    transition: background 0.2s;
}

.gcal-cell:hover {
    background: #f9fafb;
}

/* Khối Sự Kiện (Event Blocks) */
.gcal-event {
    background-color: #45C3D2;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(69, 195, 210, 0.2);
    cursor: pointer;
    transition: 0.2s;
    border-left: 4px solid #00838f;
}

.gcal-event:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(69, 195, 210, 0.3);
}

.event-title {
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 4px;
}

.event-time {
    font-size: 11px;
    opacity: 0.9;
}

/* ================= MODAL ĐĂNG KÝ CSS ================= */
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
    width: 450px;
    max-width: 95%;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    font-size: 18px;
    margin: 0;
    color: #111827;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #6b7280;
    cursor: pointer;
}

.close-btn:hover {
    color: #111827;
}

.modal-body {
    padding: 24px;
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
}

.form-control {
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
}

.form-control:focus {
    border-color: #45C3D2;
    box-shadow: 0 0 0 3px rgba(69, 195, 210, 0.1);
}

.text-red {
    color: #dc2626;
}

.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    background: #f9fafb;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
}

.btn-cancel,
.btn-submit {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: 0.2s;
}

.btn-cancel {
    background: #fff;
    border: 1px solid #d1d5db;
    color: #374151;
}

.btn-cancel:hover {
    background: #f3f4f6;
}

.btn-submit {
    background: #45C3D2;
    border: 1px solid #45C3D2;
    color: #fff;
}

.btn-submit:hover {
    background: #3ba3b0;
}

.slide-up {
    animation: fadeInUp 0.4s ease forwards;
}

.slide-down {
    animation: slideDown 0.3s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>