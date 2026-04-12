<template>
    <main class="appointment-panel card">
        <template v-if="doctor">
            <div class="panel-header flex-between">
                <div class="header-title-container">
                    <h2 class="no-wrap" :title="'Lịch hẹn - BS. ' + doctor.name">Lịch hẹn - BS. {{ doctor.name }}</h2>
                    <p class="text-sm text-gray">Sắp xếp theo độ ưu tiên & thời gian</p>
                </div>
                <div class="stats-badges">
                    <span class="stat-badge total">Tổng: {{ appointments.length }}</span>
                    <span class="stat-badge waiting">Đã đến: {{ checkedInCount }}</span>
                </div>
            </div>

            <div class="appointment-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th width="15%">Mã lịch hẹn</th>
                            <th width="10%">Ca khám</th>
                            <th width="25%">Tên bệnh nhân</th>
                            <th width="20%">Loại lịch hẹn</th>
                            <th width="15%">Trạng thái</th>
                            <th width="15%">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="appt in appointments" :key="appt.id"
                            :class="{ 'row-highlight': appt.status === EnumAppointmentStatus.Waiting }">
                            <td>
                                <span class="p-code">{{ appt.appointmentCode }}</span>
                            </td>

                            <td class="time-cell">
                                <div class="expected-time">{{ appt.expectedTime }}</div>
                                <div v-if="appt.checkInTime" class="checkin-time">Check-in: {{ appt.checkInTime }}</div>
                            </td>

                            <td>
                                <div class="patient-name">{{ appt.patientName }}</div>
                                <div class="patient-meta">{{ getGenderName(appt.gender) }} - {{ appt.age }} tuổi</div>
                            </td>

                            <td>
                                <span class="type-badge"
                                    :class="appt.type === EnumAppointmentType.Online ? 'badge-online' : 'badge-walkin'">
                                    {{ getAppointmentTypeName(appt.type) }}
                                </span>
                            </td>

                            <td>
                                <span class="status-badge" :class="getStatusClass(appt.status)">
                                    {{ getAppointmentStatusName(appt.status) }}
                                </span>
                            </td>

                            <td class="actions-cell">
                                <div class="actions-wrapper">
                                    <template v-if="appt.status === EnumAppointmentStatus.Pending || appt.status === EnumAppointmentStatus.Approved">
                                        <button class="btn-primary" @click="$emit('check-in', appt)">
                                            Xác nhận đến
                                        </button>
                                        <div class="dropdown">
                                            <button class="btn-more">⋯</button>
                                            <div class="dropdown-content">
                                                <a @click="$emit('standby', appt)">
                                                    Đến muộn
                                                </a>
                                                <a @click="$emit('no-show', appt)" class="text-red">
                                                    Vắng mặt
                                                </a>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else-if="appt.status === EnumAppointmentStatus.Waiting">
                                        <div class="status-action-group">
                                            <span class="chip-transferred">
                                                Đã chuyển đến bác sĩ
                                            </span>
                                        </div>
                                    </template>
                                    <span v-else class="state-label" :class="{
                                        'state-inprogress': appt.status === EnumAppointmentStatus.InProgress,
                                        'state-cancelled': appt.status === EnumAppointmentStatus.NoShow,
                                        'state-done': appt.status === EnumAppointmentStatus.Completed
                                    }">
                                        {{ appt.status === EnumAppointmentStatus.InProgress ? 'Đang khám' : appt.status === EnumAppointmentStatus.NoShow ? 'Đã hủy/Vắng' : 'Kết thúc' }}
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="appointments.length === 0">
                            <td colspan="6">
                                <div class="empty-state">Không có lịch hẹn nào.</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <div v-else class="empty-state fill-height">
            <p class="text-lg text-gray">Vui lòng chọn bác sĩ ở danh sách bên trái</p>
        </div>
    </main>
</template>

<script setup>
import { computed } from 'vue'
import { getGenderName, getAppointmentStatusName, getAppointmentTypeName, EnumAppointmentType, EnumAppointmentStatus } from '../../../constants/enum'

const props = defineProps({
    doctor: { type: Object, default: null },
    appointments: { type: Array, required: true }
})
defineEmits(['check-in', 'standby', 'no-show'])

const checkedInCount = computed(() => props.appointments.filter(a => [EnumAppointmentStatus.Waiting, EnumAppointmentStatus.InProgress, EnumAppointmentStatus.Completed].includes(a.status)).length)

const getStatusClass = (status) => {
    const map = {
        [EnumAppointmentStatus.Pending]: 'status-pending',
        [EnumAppointmentStatus.Approved]: 'status-approved',
        [EnumAppointmentStatus.Waiting]: 'status-waiting',  
        [EnumAppointmentStatus.Standby]: 'status-standby',
        [EnumAppointmentStatus.InProgress]: 'status-inprogress',
        [EnumAppointmentStatus.Completed]: 'status-done',
        [EnumAppointmentStatus.NoShow]: 'status-noshow'
    };
    return map[status] || status;
}
</script>

<style scoped>
.card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.panel-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

.header-title-container {
    flex: 1;
    min-width: 0;
}

.no-wrap {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.stats-badges {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
}

.appointment-table-container {
    overflow-y: auto;
    overflow-x: auto;
    flex: 1;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th,
.data-table td {
    padding: 16px 12px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
    vertical-align: top;
}

.data-table th {
    background: #fff;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 10;
    white-space: nowrap;
}

.row-highlight {
    background: #f0fbfc;
}

.p-code {
    font-size: 13px;
    font-weight: 600;
    color: #00838f;
    background: #e0f7fa;
    padding: 4px 8px;
    border-radius: 4px;
    display: inline-block;
    white-space: nowrap;
}

.time-cell {
    font-variant-numeric: tabular-nums;
}

.expected-time {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    white-space: nowrap;
}

.checkin-time {
    font-size: 12px;
    color: #16a34a;
    margin-top: 4px;
    font-weight: 500;
}

.patient-name {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
    white-space: nowrap;
}

.patient-meta {
    font-size: 13px;
    color: #6b7280;
    white-space: nowrap;
}

.type-badge {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
}

.badge-online {
    background: #e0e7ff;
    color: #4338ca;
}

.badge-walkin {
    background: #fce7f3;
    color: #be185d;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}

.status-approved {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
}

.status-waiting {
    background: #e0f7fa;
    color: #00838f;
}

.status-pending {
    background: #fef3c7;
    color: #d97706;
}

.status-standby {
    background: #fef3c7;
    color: #d97706;
}

.status-inprogress {
    background: #dbeafe;
    color: #1d4ed8;
}

.status-completed {
    background: #dcfce7;
    color: #15803d;
}

.status-noshow {
    background: #fee2e2;
    color: #b91c1c;
}

.actions-cell {
    vertical-align: middle;
}

.actions-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* ── Nút chính: Xác nhận đến ── */
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background-color: #45c3d2 !important; /* Thêm !important để chống bị ghi đè */
    background-image: none !important; /* Xóa gradient rác nếu có */
    color: #fff !important;
    border: 1px solid #45c3d2 !important;
    padding: 8px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.2s ease; 
}

.btn-primary:hover {
    background-color: #3ba3b0 !important; /* Đổi màu nền khi hover */
    border-color: #3ba3b0 !important;
    /* Bỏ translateY để tránh lỗi giật lag nút */
}

.btn-primary:active {
    background-color: #318a94 !important;
}

.btn-icon-check {
    font-size: 11px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.btn-more {
    background-color: #f3f4f6 !important;
    border: 1px solid #d1d5db !important;
    border-radius: 6px;
    width: 34px;
    height: 34px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    color: #4b5563 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    padding: 0;
}

.btn-more:hover {
    background-color: #e5e7eb !important;
    color: #111827 !important;
}

/* ── Dropdown ── */
.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    top: calc(100% + 6px);
    background: #fff;
    min-width: 120px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    z-index: 50;
    padding: 6px;
    animation: dropIn 0.15s ease;
}

/* Thêm đoạn này để tạo "cây cầu tàng hình" nối khoảng hở */
.dropdown-content::before {
    content: '';
    position: absolute;
    top: -10px; /* Đẩy lên trên để lấp đầy khoảng hở 6px */
    left: 0;
    right: 0;
    height: 10px;
    background: transparent; /* Tàng hình */
}

@keyframes dropIn {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown-content a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #374151;
    padding: 9px 12px;
    text-decoration: none;
    font-size: 13px;
    border-radius: 7px;
    cursor: pointer;
    transition: background 0.1s;
}

.dropdown-content a:hover {
    background: #f3f4f6;
}

.dropdown-content a.text-red {
    color: #dc2626;
}

.dropdown-content a.text-red:hover {
    background: #fef2f2;
}

.menu-icon {
    font-size: 13px;
    width: 18px;
    text-align: center;
    opacity: 0.7;
}

/* ── Trạng thái: Đã chuyển BS ── */
.status-action-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.chip-transferred {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #ecfdf5;
    color: #059669;
    border: 1px solid #a7f3d0;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}

.btn-undo {
    background: none;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #6b7280;
    font-size: 12px;
    padding: 5px 9px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
}

.btn-undo:hover {
    border-color: #9ca3af;
    color: #374151;
    background: #f9fafb;
}

/* ── State labels ── */
.state-label {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    padding: 5px 10px;
    border-radius: 20px;
}

.state-inprogress {
    background: #eff6ff;
    color: #2563eb;
}

.state-cancelled {
    background: #fef2f2;
    color: #dc2626;
}

.state-done {
    background: #f0fdf4;
    color: #16a34a;
}

/* ── Misc ── */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
    color: #9ca3af;
}

.fill-height {
    height: 100%;
}

.text-sm {
    font-size: 13px;
}

.text-lg {
    font-size: 16px;
    font-weight: 600;
}

.text-gray {
    color: #6b7280;
}

.text-green {
    color: #16a34a;
}

.text-red {
    color: #dc2626;
}
</style>