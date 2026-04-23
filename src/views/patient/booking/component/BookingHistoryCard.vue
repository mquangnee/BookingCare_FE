<template>
    <div class="appointment-card fade-in">
        <div class="card-header">
            <span class="appointment-code">{{ data.appointmentCode }}</span>
            <span class="status-badge" :style="{ color: status.color, backgroundColor: status.bg }">
                {{ status.text }}
            </span>
        </div>

        <div class="card-body">
            <div class="info-main">
                <div class="doctor-info">
                    <p class="label">Bác sĩ</p>
                    <h4 class="value">{{ data.doctorName }}</h4>
                    <p class="sub-value">{{ data.specialtyName }}</p>
                </div>
                <div class="time-info text-right">
                    <p class="label">Thời gian</p>
                    <h4 class="value text-primary">{{ data.startTime.substring(0, 5) }}</h4>
                    <p class="sub-value">{{ formatDate(data.date) }}</p>
                </div>
            </div>

            <div class="info-footer">
                <div class="patient-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>Bệnh nhân: {{ data.patientProfileName }}</span>
                </div>
                <div class="service-list">
                    <span class="service-tag">{{ data.serviceName }}</span>
                </div>
            </div>
        </div>

        <div class="card-actions" v-if="data.status === 0 || data.status === 3">
            <button v-if="data.status === 0" class="btn-outline-danger" @click="$emit('cancel', data.id)">
                Hủy lịch
            </button>
            <button v-if="data.status === 3" class="btn-primary" @click.stop="$emit('view-result', data.id)">
                Xem kết quả
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { getStatusDetail } from '../../../../constants/appointmentStatus';

const props = defineProps(['data']);
const emit = defineEmits(['cancel', 'view-result']); // Khai báo emit mới

const status = computed(() => getStatusDetail(props.data.status));

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
};
</script>

<style scoped>
.appointment-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.appointment-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px dashed #f3f4f6;
}

.appointment-code {
    font-weight: 700;
    color: var(--text-dark);
    font-size: 16px;
}

.status-badge {
    padding: 4px 12px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
}

.info-main {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}

.label {
    font-size: 14px;
    color: var(--text-gray);
    margin-bottom: 4px;
    text-transform: uppercase;
}

.value {
    font-size: 16px;
    color: var(--text-dark);
    margin: 0;
    font-weight: 600;
}

.sub-value {
    font-size: 14px;
    color: var(--text-gray);
    margin: 2px 0 0;
}

.text-primary {
    color: #45C3D2;
}

.text-right {
    text-align: right;
}

.info-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
}

.patient-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--text-dark);
    background: #f9fafb;
    padding: 4px 10px;
    border-radius: 6px;
}

.service-tag {
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-color);
    background: #f0fbf9;
    padding: 4px 10px;
    border-radius: 6px;
    border: 2px solid #c2f0e9;
}

.card-actions {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    /* Khoảng cách giữa các nút nếu có nhiều nút */
}

.btn-outline-danger {
    padding: 6px 16px;
    border: 1px solid #fecaca;
    background: #fff;
    color: #ef4444;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;
    font-family: inherit;
    width: fit-content;
}

.btn-outline-danger:hover {
    background: #fef2f2;
    border-color: #ef4444;
}

/* Thêm style cho nút Xem kết quả */
.btn-primary {
    padding: 6px 16px;
    border: 1px solid #45C3D2;
    background: #45C3D2;
    color: #fff;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;
    font-family: inherit;
    font-weight: 500;
    width: fit-content;
}

.btn-primary:hover {
    background: #3ba3b0;
    border-color: #3ba3b0;
}
</style>