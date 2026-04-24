<template>
    <div class="schedule-page slide-up">
        <div class="card schedule-layout">
            <div class="panel-header">
                <div class="header-left">
                    <h2>Lịch làm việc</h2>
                    <div class="week-controls">
                        <button class="btn-icon" @click="prevWeek" title="Tuần trước">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <button class="btn-outline" @click="currentWeek">Tuần này</button>
                        <button class="btn-icon" @click="nextWeek" title="Tuần sau">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                        <span class="week-label">{{ weekRangeLabel }}</span>
                    </div>
                </div>

                <button class="btn-primary" @click="openRegisterModal">
                    <svg class="fixed-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Đăng ký lịch làm việc
                </button>
            </div>

            <div class="calendar-wrapper">
                <div v-if="isLoading" class="loading-container">
                    <div class="spinner"></div>
                    <p>Đang tải dữ liệu lịch làm việc...</p>
                </div>
                <table v-else class="gcal-table">
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
                                <div v-if="getRegisteredShift(day.date, shift.id)" class="gcal-event"
                                    :class="shift.cssClass">
                                    <div class="event-title">Ca {{ shift.name }}</div>
                                    <div class="event-time">
                                        {{ formatTime(getRegisteredShift(day.date, shift.id).startTime) }} -
                                        {{ formatTime(getRegisteredShift(day.date, shift.id).endTime) }}
                                    </div>
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
import { ref, computed, onMounted } from 'vue'
import { useWorkSessionStore } from '../../../stores/workSessionStore'
import { EnumShift } from '../../../constants/enum'
import { notifyError, notifySuccess } from '../../../utils/notify'

const workSessionStore = useWorkSessionStore()

const shifts = [
    { id: EnumShift.Morning, name: 'Ca Sáng', time: '07:30 - 12:00', cssClass: 'shift-morning' },
    { id: EnumShift.Afternoon, name: 'Ca Chiều', time: '13:30 - 17:30', cssClass: 'shift-afternoon' },
    { id: EnumShift.Evening, name: 'Ca Tối', time: '18:00 - 21:00', cssClass: 'shift-evening' }
]

const currentDate = ref(new Date())
const registeredShifts = ref([])
const isLoading = ref(false)

const getMonday = (d) => {
    const date = new Date(d)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(date.setDate(diff))
}

const weekDays = computed(() => {
    const monday = getMonday(currentDate.value)
    const days = []
    const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN']

    for (let i = 0; i < 7; i++) {
        const date = new Date(monday)
        date.setDate(monday.getDate() + i)

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        days.push({
            dayName: dayNames[i],
            dateNumber: date.getDate(),
            date: `${year}-${month}-${day}`,
            isToday: date.toDateString() === new Date().toDateString()
        })
    }
    return days
})

const weekRangeLabel = computed(() => {
    if (weekDays.value.length === 0) return ''
    const start = weekDays.value[0].date.split('-').reverse().join('/')
    const end = weekDays.value[6].date.split('-').reverse().join('/')
    return `${start} - ${end}`
})

const fetchSchedules = async () => {
    const startDate = weekDays.value[0].date
    isLoading.value = true

    try {
        const response = await workSessionStore.getSchedules(startDate)

        registeredShifts.value = response.map(item => {
            const datePart = item.date.split('T')[0]
            const startTimeStr = item.startTime.split('T')[1]
            const hour = parseInt(startTimeStr.split(':')[0])

            let mappedShiftId = EnumShift.Morning
            if (hour >= 13 && hour < 18) {
                mappedShiftId = EnumShift.Afternoon
            } else if (hour >= 18) {
                mappedShiftId = EnumShift.Evening
            }

            return {
                ...item,
                mappedDate: datePart,
                mappedShiftId: mappedShiftId
            }
        })
    } catch (error) {
        console.error(error)
        notifyError('Không thể tải lịch làm việc. Vui lòng thử lại sau.')
    } finally {
        isLoading.value = false
    }
}

const changeWeek = (daysOffset) => {
    const newDate = new Date(currentDate.value)
    newDate.setDate(newDate.getDate() + daysOffset)
    currentDate.value = newDate
    fetchSchedules()
}

const nextWeek = () => changeWeek(7)
const prevWeek = () => changeWeek(-7)
const currentWeek = () => {
    currentDate.value = new Date()
    fetchSchedules()
}

const shiftsMap = computed(() => {
    const map = {}
    registeredShifts.value.forEach(shift => {
        map[`${shift.mappedDate}_${shift.mappedShiftId}`] = shift
    })
    return map
})

const getRegisteredShift = (date, shiftId) => shiftsMap.value[`${date}_${shiftId}`]

const formatTime = (dateTimeString) => {
    if (!dateTimeString) return ''
    const time = dateTimeString.split('T')[1]
    return time.substring(0, 5)
}

const isRegModalOpen = ref(false)
const regForm = ref({ date: '', shiftId: '' })

const openRegisterModal = () => {
    regForm.value = { date: '', shiftId: '' }
    isRegModalOpen.value = true
}

const closeRegModal = () => {
    isRegModalOpen.value = false
}

const submitRegistration = async () => {
    if (!regForm.value.date || regForm.value.shiftId === '') {
        notifyError('Vui lòng chọn đầy đủ Ngày và Ca trực!')
        return
    }

    try {
        await workSessionStore.registerWorkSession(regForm.value.date, regForm.value.shiftId)
        notifySuccess('Đăng ký lịch làm việc thành công!')
        fetchSchedules()
        closeRegModal()
    } catch (error) {
        console.error(error);
        notifyError(error?.response?.data?.message || error?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    }
}

onMounted(() => {
    fetchSchedules()
})
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

.header-left {
    display: flex;
    align-items: center;
    gap: 24px;
}

.panel-header h2 {
    font-size: 18px;
    margin: 0;
    color: #111827;
}

.week-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f3f4f6;
    padding: 4px;
    border-radius: 8px;
}

.btn-icon,
.btn-outline {
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4b5563;
    transition: 0.2s;
    font-family: inherit;
}

.btn-icon {
    width: 32px;
    height: 32px;
}

.btn-outline {
    padding: 0 12px;
    height: 32px;
    font-size: 13px;
    font-weight: 500;
}

.btn-icon:hover,
.btn-outline:hover {
    background: #e5e7eb;
    color: #111827;
}

.btn-icon svg {
    width: 16px;
    height: 16px;
}

.week-label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-left: 12px;
    margin-right: 8px;
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

.calendar-wrapper {
    flex: 1;
    overflow-y: auto;
    background: #f9fafb;
    padding: 24px;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #6b7280;
}

.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #45C3D2;
    animation: spin 1s ease infinite;
    margin-bottom: 12px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
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

.gcal-day-date.today {
    background: #45C3D2;
    color: #fff;
    border-radius: 50%;
    font-weight: 600;
}

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

.gcal-event {
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
}

.gcal-event:hover {
    transform: translateY(-2px);
}

.shift-morning {
    background-color: #10B981;
    border-left: 4px solid #047857;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.shift-morning:hover {
    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
}

.shift-afternoon {
    background-color: #F59E0B;
    border-left: 4px solid #D97706;
    box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
}

.shift-afternoon:hover {
    box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);
}

.shift-evening {
    background-color: #6366F1;
    border-left: 4px solid #4F46E5;
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
}

.shift-evening:hover {
    box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
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