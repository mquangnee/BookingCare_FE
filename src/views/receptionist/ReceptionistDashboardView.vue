<template>
    <div class="app-container">
        <Sidebar />

        <main class="main-content">
            <DashboardHeader v-model="selectedDate" @date-changed="fetchDataForDate"
                @open-walk-in="isWalkInModalOpen = true" />

            <div class="dashboard-layout slide-up">
                <WorkSessionListPanel :date="selectedDate" :selectedWorkSessionId="selectedWorkSession?.id"
                    @select="selectWorkSession" @work-sessions-loaded="handleWorkSessionsLoaded" />

                <AppointmentTablePanel :doctor="selectedWorkSession" :appointments="sortedAppointments"
                    @check-in="handleCheckIn" @standby="handleStandby" @no-show="handleNoShow" @undo="undoCheckIn" />
            </div>
        </main>

        <WalkInModal :isOpen="isWalkInModalOpen" :defaultDoctorId="selectedDoctor?.id"
            @close="isWalkInModalOpen = false" @submit="submitWalkIn" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppointmentStore } from '@/stores/appointmentStore'
import { useServiceStore } from '../../stores/serviceStore'

import Sidebar from './component/Sidebar.vue'
import DashboardHeader from './component/DashboardHeader.vue'
import WorkSessionListPanel from './component/WorkSessionListPanel.vue'
import AppointmentTablePanel from './component/AppointmentTablePanel.vue'
import WalkInModal from './component/WalkInModal.vue'
import { EnumAppointmentPriority, EnumAppointmentStatus } from '../../constants/enum'
import { notifySuccess, notifyError } from '@/utils/notify'

const appointmentStore = useAppointmentStore()
const serviceStore = useServiceStore()

const selectedDate = ref(new Date().toISOString().split('T')[0]);
const selectedWorkSession = ref(null);
const isWalkInModalOpen = ref(false);

const selectedDoctor = ref(null);

const allServices = ref([]);
const appointments = ref([]);
const isLoadingAppointments = ref(false);

onMounted(async () => {
    try {
        const res = await serviceStore.getServices();
        allServices.value = res || [];
    } catch (error) {
        console.error("Lỗi lấy danh sách dịch vụ", error);
    }
});

const handleWorkSessionsLoaded = (data) => {
    console.log("Đã tải xong danh sách ca làm việc:", data);
}

const fetchDataForDate = () => {
    selectedWorkSession.value = null;
    appointments.value = [];
}

const selectWorkSession = async (workSession) => {
    selectedWorkSession.value = workSession;
    await fetchAppointments(workSession.id);
}

const fetchAppointments = async (worksessionId) => {
    isLoadingAppointments.value = true;
    try {
        const response = await appointmentStore.getAppointmentsByWorkSessionId(worksessionId);
        appointments.value = response.map(appt => {
            const hasCheckedIn = appt.checkInDate && !appt.checkInDate.startsWith('0001-01-01');
            const expectedTimeStr = `${appt.startTime.substring(0, 5)} - ${appt.endTime.substring(0, 5)}`;
            const checkInTimeStr = hasCheckedIn ? appt.checkInDate.split('T')[1].substring(0, 5) : null;
            return {
                id: appt.id,
                doctorId: appt.doctorId,
                appointmentCode: appt.appointmentCode,
                patientName: appt.patientName,
                age: appt.age,
                gender: appt.gender,
                expectedTime: expectedTimeStr,
                checkInTime: checkInTimeStr,
                type: appt.type,
                status: appt.status
            }
        });
    } catch (error) {
        console.error("Lỗi khi tải lịch khám:", error);
        appointments.value = [];
    } finally {
        isLoadingAppointments.value = false;
    }
}

const sortedAppointments = computed(() => {
    const getPriorityScore = (status) => {
        if (status === EnumAppointmentStatus.Completed) return 3;

        if (status === EnumAppointmentStatus.Waiting || status === EnumAppointmentStatus.InProgress) return 2;
        return 1;
    };

    return [...appointments.value].sort((a, b) => {
        const scoreA = getPriorityScore(a.status);
        const scoreB = getPriorityScore(b.status);
        if (scoreA !== scoreB) {
            return scoreA - scoreB;
        }
        return a.expectedTime.localeCompare(b.expectedTime);
    });
});

const handleCheckIn = async (appt) => {
    const payload = {
        appointmentId: appt.id,
        status: EnumAppointmentStatus.Waiting,
        priority: EnumAppointmentPriority.Level1
    }
    try {
        await appointmentStore.changeAppointmentStatus(payload)
        await fetchAppointments(selectedWorkSession.value.id);
        notify.success("Check-in thành công!");
    } catch (error) {
        console.error("Lỗi khi check-in:", error);
        notify.error("Có lỗi xảy ra khi check-in.");
    }
}

const handleStandby = async (appt) => {
    const payload = {
        appointmentId: appt.id,
        status: EnumAppointmentStatus.Waiting,
        priority: EnumAppointmentPriority.Level3
    }
    try {
        await appointmentStore.changeAppointmentStatus(payload)
        await fetchAppointments(selectedWorkSession.value.id);
        notify.success("Chuyển chờ gọi thành công!");
    } catch (error) {
        console.error("Lỗi khi chuyển chờ:", error);
        notify.error("Có lỗi xảy ra.");
    }
}

const handleNoShow = async (appt) => {
    if (confirm(`Xác nhận vắng mặt cho ${appt.patientName}?`)) {
        const payload = {
            appointmentId: appt.id,
            status: EnumAppointmentStatus.NoShow
        };
        try {
            await appointmentStore.changeAppointmentStatus(payload);
            await fetchAppointments(selectedWorkSession.value.id);
            notify.success("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            notify.error("Có lỗi xảy ra khi cập nhật trạng thái.");
        }
    }
}

const undoCheckIn = async (appt) => {
    if (confirm(`Bạn muốn hủy trạng thái chờ khám (Check-in) của ${appt.patientName}?`)) {
        const payload = {
            appointmentId: appt.id,
            status: EnumAppointmentStatus.Approved
        };
        try {
            await appointmentStore.changeAppointmentStatus(payload);
            await fetchAppointments(selectedWorkSession.value.id);
            notify.success("Đã hoàn tác Check-in!");
        } catch (error) {
            console.error("Lỗi khi hoàn tác:", error);
            notify.error("Có lỗi xảy ra khi hoàn tác Check-in.");
        }
    }
}

const submitWalkIn = async (payload) => {
    const timeParts = payload.appointment.timeString.split(' - ');
    const startTime = timeParts[0] + ":00";
    const endTime = timeParts[1] + ":00";

    const newId = Math.floor(Math.random() * 1000) + 500;

    appointments.value.push({
        id: newId,
        doctorId: payload.appointment.doctorId,
        appointmentCode: `WLK-${newId}`,
        patientName: payload.patient.name,
        age: payload.patient.dob ? (new Date().getFullYear() - new Date(payload.patient.dob).getFullYear()) : 0,
        gender: payload.patient.gender,
        expectedTime: payload.appointment.timeString,
        checkInTime: payload.appointment.timeString.substring(0, 5),
        type: 'WalkIn',
        status: 'Waiting'
    });

    isWalkInModalOpen.value = false;
    notify.success(`Tiếp nhận thành công! Khách hàng chọn thanh toán: ${payload.payment.method === 'qr' ? 'Chuyển khoản' : 'Tiền mặt'}`);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.app-container {
    display: flex;
    height: 100vh;
    font-family: 'Inter', sans-serif;
    background-color: #f3f4f6;
    overflow: hidden;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow-y: auto;
}

.dashboard-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 24px;
    flex: 1;
    min-height: 0;
}

.slide-up {
    animation: fadeInUp 0.4s ease forwards;
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
</style>