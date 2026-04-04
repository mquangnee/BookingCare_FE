<template>
    <div class="booking-page-wrapper fade-in">
        <div class="booking-card">
            <div class="wizard-header">
                <div class="header-text text-center">
                    <h2>Đặt lịch khám bệnh</h2>
                    <p class="text-muted">Hoàn tất thủ tục nhanh chóng chỉ với 4 bước</p>
                </div>

                <div class="modern-stepper">
                    <div class="step" :class="{ active: step >= 1, completed: step > 1 }">
                        <div class="step-circle"><span v-if="step > 1">✓</span><span v-else>1</span></div>
                        <span class="step-label">Chuyên môn</span>
                    </div>
                    <div class="step-line" :class="{ completed: step > 1 }"></div>

                    <div class="step" :class="{ active: step >= 2, completed: step > 2 }">
                        <div class="step-circle"><span v-if="step > 2">✓</span><span v-else>2</span></div>
                        <span class="step-label">Thời gian</span>
                    </div>
                    <div class="step-line" :class="{ completed: step > 2 }"></div>

                    <div class="step" :class="{ active: step >= 3, completed: step > 3 }">
                        <div class="step-circle"><span v-if="step > 3">✓</span><span v-else>3</span></div>
                        <span class="step-label">Hồ sơ</span>
                    </div>
                    <div class="step-line" :class="{ completed: step > 3 }"></div>

                    <div class="step" :class="{ active: step === 4 }">
                        <div class="step-circle">4</div>
                        <span class="step-label">Xác nhận</span>
                    </div>
                </div>
            </div>

            <div class="wizard-body">
                <div v-if="isSuccess" class="success-screen text-center fade-in">
                    <div class="success-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h3>Đặt lịch thành công!</h3>
                    <p class="text-muted">Cảm ơn bạn đã tin tưởng. Thông tin chi tiết đã được gửi qua Email.</p>
                    <div class="wizard-footer justify-center mt-20">
                        <button class="btn-primary" @click="resetWizard">Về trang chủ</button>
                    </div>
                </div>

                <transition v-else name="slide-fade" mode="out-in">
                    <div v-if="step === 1" class="step-content" key="step1">
                        <div class="segmented-control">
                            <button :class="['segment-btn', { active: bookingMode === 'doctor' }]"
                                @click="setMode('doctor')">Khám theo Bác sĩ</button>
                            <button :class="['segment-btn', { active: bookingMode === 'service' }]"
                                @click="setMode('service')">Khám theo Dịch vụ</button>
                        </div>

                        <div v-if="bookingMode === 'doctor'" class="flow-container fade-in">
                            <h3 class="section-title">1. Chọn Chuyên khoa</h3>
                            <div class="grid-list">
                                <div v-for="spec in specialties" :key="spec.id"
                                    :class="['selection-card small-card', { selected: selectedSpecialty?.id === spec.id }]"
                                    @click="selectSpecialty(spec)">

                                    <img v-if="spec.imageUrl" :src="spec.imageUrl" class="spec-icon-mini">

                                    <div class="card-info">
                                        <h4 class="mb-0">{{ spec.name }}</h4>
                                    </div>
                                    <div class="radio-circle"></div>
                                </div>
                            </div>

                            <div v-if="selectedSpecialty" class="mt-24 fade-in">
                                <h3 class="section-title">2. Chọn Bác sĩ ({{ selectedSpecialty.name }})</h3>

                                <div v-if="filteredDoctors.length === 0" class="empty-state">
                                    <p>Hiện tại chưa có bác sĩ trực thuộc chuyên khoa này.</p>
                                </div>

                                <div v-else class="grid-list">
                                    <div v-for="doc in filteredDoctors" :key="doc.id"
                                        :class="['selection-card', { selected: selectedDoctor?.id === doc.id }]"
                                        @click="selectedDoctor = doc">

                                        <img :src="doc.avatarUrl || 'https://via.placeholder.com/150'"
                                            :alt="doc.fullName" class="card-avatar-img">

                                        <div class="card-info">
                                            <h4>{{ doc.fullName }}</h4>
                                            <p class="text-muted">{{ doc.doctorCode }}</p>
                                            <p class="price-text">{{ formatPrice(doc.price) }}</p>
                                        </div>
                                        <div class="radio-circle"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="wizard-footer">
                            <div class="spacer"></div>
                            <button class="btn-primary" :disabled="!canProceedToStep2" @click="step = 2">
                                Tiếp tục
                            </button>
                        </div>
                    </div>

                    <div v-else-if="step === 2" class="step-content" key="step2">
                        <h3 class="section-title">Chọn ngày khám</h3>
                        <div class="date-selector">
                            <div v-for="date in next7Days" :key="date.full"
                                :class="['date-card', { active: selectedDate === date.full }]"
                                @click="selectedDate = date.full">
                                <span class="day-name">{{ date.dayName }}</span>
                                <span class="day-number">{{ date.dayNumber }}</span>
                            </div>
                        </div>

                        <h3 class="section-title mt-24">Ca khám trống</h3>
                        <div v-if="isLoadingSlots" class="loading-state">
                            <span class="spinner-large"></span>
                            <p>Đang tìm lịch trống...</p>
                        </div>
                        <div v-else-if="availableSlots.length === 0" class="empty-state">
                            <p>Không có ca làm việc nào trống trong ngày này. Vui lòng chọn ngày khác.</p>
                        </div>
                        <div v-else class="time-slots">
                            <button v-for="slot in availableSlots" :key="slot.id"
                                :class="['slot-btn', { selected: selectedSlot?.id === slot.id, full: slot.isFull }]"
                                :disabled="slot.isFull" @click="selectedSlot = slot">
                                <span class="time">{{ slot.time }}</span>
                                <span v-if="bookingMode === 'service' && !slot.isFull" class="doctor-hint">{{
                                    slot.doctorName }}</span>
                                <span v-if="slot.isFull" class="status-full">Đã kín lịch</span>
                            </button>
                        </div>

                        <div class="wizard-footer">
                            <button class="btn-secondary" @click="step = 1">Quay lại</button>
                            <div class="spacer"></div>
                            <button class="btn-primary" :disabled="!selectedSlot" @click="step = 3">Tiếp tục</button>
                        </div>
                    </div>

                    <div v-else-if="step === 3" class="step-content" key="step3">
                        <h3 class="section-title">Chọn hồ sơ bệnh nhân</h3>

                        <div v-if="isLoadingProfiles" class="loading-state fade-in">
                            <span class="spinner-large"></span>
                            <p>Đang tải danh sách hồ sơ phù hợp...</p>
                        </div>

                        <div v-else-if="availableProfiles.length === 0" class="empty-state fade-in">
                            <p>Không có hồ sơ nào khả dụng vào thời gian này (có thể do trùng lịch khám). Vui lòng quay
                                lại chọn khung giờ khác hoặc tạo hồ sơ mới.</p>
                        </div>

                        <div v-else class="grid-list fade-in">
                            <div v-for="profile in availableProfiles" :key="profile.id"
                                :class="['selection-card', { selected: selectedProfile?.id === profile.id }]"
                                @click="selectedProfile = profile">
                                <div class="avatar-circle">{{ profile.fullName ? profile.fullName.substring(0,
                                    1).toUpperCase() : 'U' }}</div>
                                <div class="card-info">
                                    <h4>{{ profile.fullName }}</h4>
                                    <p class="text-muted text-sm">
                                        Sinh năm: {{ new Date(profile.dateOfBirth).getFullYear() }}
                                        - {{ profile.gender === 0 ? 'Nam' : (profile.gender === 1 ? 'Nữ' : 'Khác') }}
                                        <span v-if="profile.relationship"> - {{
                                            getRelationshipName(profile.relationship) }}</span>
                                    </p>
                                    <span v-if="profile.isShared" class="text-primary text-sm font-bold"> (Được chia
                                        sẻ)</span>
                                </div>
                                <div class="radio-circle"></div>
                            </div>
                        </div>

                        <div class="wizard-footer">
                            <button class="btn-secondary" @click="step = 2">Quay lại</button>
                            <div class="spacer"></div>
                            <button class="btn-primary" :disabled="!selectedProfile" @click="step = 4">Tiếp tục</button>
                        </div>
                    </div>

                    <div v-else-if="step === 4" class="step-content" key="step4">
                        <div class="summary-box fade-in">
                            <h3 class="summary-title">Tóm tắt lịch hẹn</h3>
                            <div class="summary-section">
                                <div class="summary-row">
                                    <span class="label">Bệnh nhân:</span>
                                    <span class="value font-bold">{{ selectedProfile?.fullName }}</span>
                                </div>

                                <template v-if="bookingMode === 'doctor'">
                                    <div class="summary-row">
                                        <span class="label">Chuyên khoa:</span>
                                        <span class="value">{{ selectedSpecialty?.name }}</span>
                                    </div>
                                    <div class="summary-row">
                                        <span class="label">Bác sĩ:</span>
                                        <span class="value">{{ selectedDoctor?.fullName }}</span>
                                    </div>
                                </template>

                                <template v-else>
                                    <div class="summary-row">
                                        <span class="label">Dịch vụ:</span>
                                        <span class="value">{{ selectedService?.name }}</span>
                                    </div>
                                    <div v-if="selectedService?.doctorName" class="summary-row">
                                        <span class="label">Bác sĩ thực hiện:</span>
                                        <span class="value">{{ selectedService?.doctorName }}</span>
                                    </div>
                                </template>

                                <div class="summary-row highlight">
                                    <span class="label">Thời gian:</span>
                                    <span class="value font-bold text-primary">
                                        {{ selectedSlot?.time }} - {{ formatDateFull(selectedDate) }}
                                    </span>
                                </div>
                            </div>

                            <div class="summary-section pt-0">
                                <div class="summary-row total-row">
                                    <span class="label">Tổng chi phí dự kiến:</span>
                                    <span class="value total-price">{{ formatPrice(calculateTotal()) }}</span>
                                </div>
                                <p class="text-muted text-sm text-center mt-2" style="font-style: italic;">
                                    * Chi phí này là phí khám/dịch vụ ban đầu, chưa bao gồm các chỉ định cận lâm sàng
                                    phát sinh (nếu có).
                                </p>
                            </div>
                        </div>

                        <div class="wizard-footer">
                            <button class="btn-secondary" @click="step = 3" :disabled="isSubmitting">Quay lại</button>
                            <div class="spacer"></div>
                            <button class="btn-primary" :disabled="isSubmitting" @click="submitBooking">
                                <span v-if="isSubmitting" class="spinner"></span>
                                <span v-else>Xác nhận đặt lịch</span>
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSpecialtyStore } from '../stores/specialtyStore'
import { useDoctorStore } from '../stores/doctorStore'
import { useWorkSessionStore } from '../stores/workSessionStore'
import { useProfileStore } from '../stores/profileStore'
import { useServiceStore } from '../stores/serviceStore'
import { useAppointmentStore } from '../stores/appointmentStore'
import { getRelationshipName } from '../constants/enum'

const specialtyStore = useSpecialtyStore()
const doctorStore = useDoctorStore()
const workSessionStore = useWorkSessionStore()
const profileStore = useProfileStore()
const serviceStore = useServiceStore()
const appointmentStore = useAppointmentStore()

const specialties = ref([])
const doctorsBySpecialty = ref([])
const weeklySchedule = ref([])
const availableSlots = ref([])
const availableProfiles = ref([])
const isLoadingProfiles = ref(false)

const step = ref(1)
const bookingMode = ref('doctor')
const isSubmitting = ref(false)
const isLoadingSlots = ref(false)
const isSuccess = ref(false)

const selectedSpecialty = ref(null)
const selectedDoctor = ref(null)
const selectedService = ref(null)

const getLocalToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
};

const selectedDate = ref(getLocalToday())
const selectedSlot = ref(null)
const selectedProfile = ref(null)

const fetchPatientProfiles = async () => {
    if (step.value !== 3 || !selectedSlot.value) return;

    isLoadingProfiles.value = true;
    selectedProfile.value = null;
    availableProfiles.value = [];

    try {
        const timeParts = selectedSlot.value.time.split(' - ');
        const payload = {
            date: selectedDate.value,
            startTime: timeParts[0] + ":00",
            endTime: timeParts[1] + ":00"
        };

        const data = await profileStore.getUserProfileForBooking(payload);
        availableProfiles.value = data || [];

        if (availableProfiles.value.length > 0) {
            selectedProfile.value = availableProfiles.value[0];
        }
    } catch (error) {
        console.error("Lỗi lấy hồ sơ:", error);
        alert(error.message?.replace(/^Error:\s*/, '').trim() || 'Lỗi khi tải hồ sơ');
    } finally {
        isLoadingProfiles.value = false;
    }
};

watch(step, (newStep) => {
    if (newStep === 2) {
        selectedDate.value = getLocalToday();
        fetchWeeklySchedule();
    } else if (newStep === 3) {
        fetchPatientProfiles();
    }
});

const mockServices = [
    { id: 'sv1', name: 'Nội soi dạ dày (Gây mê)', desc: 'Phương pháp nội soi không đau', price: 1200000 },
    { id: 'sv2', name: 'Siêu âm thai 4D', desc: 'Kiểm tra dị tật thai nhi', price: 450000 }
]

const mockProfiles = [
    { id: 'p1', name: 'Nguyễn Văn Dũng', yob: 2000, gender: 'Nam', relationship: 'Bản thân' },
    { id: 'p2', name: 'Đỗ Thị Tường Vân', yob: 1965, gender: 'Nữ', relationship: 'Mẹ' }
]

onMounted(async () => {
    try {
        const dataSpecialties = await specialtyStore.getSpecialties()
        const services = await serviceStore.getServices()
        specialties.value = dataSpecialties || []
        services.value = services || []
    } catch (error) {
        console.error("Lỗi lấy chuyên khoa:", error)
        alert(error.message?.replace(/^Error:\s*/, '').trim() || 'Lỗi hệ thống')
    }
})

watch(selectedSpecialty, async (newSpec) => {
    if (newSpec && bookingMode.value === 'doctor') {
        selectedDoctor.value = null
        try {
            const data = await doctorStore.getDoctorsBySpecialty(newSpec.id)
            doctorsBySpecialty.value = data || []
        } catch (error) {
            console.error("Lỗi lấy bác sĩ:", error)
            doctorsBySpecialty.value = []
        }
    }
})

const fetchWeeklySchedule = async () => {
    if (step.value !== 2) return;

    isLoadingSlots.value = true;
    selectedSlot.value = null;
    availableSlots.value = [];
    weeklySchedule.value = [];

    const targetDoctorId = bookingMode.value === 'doctor'
        ? selectedDoctor.value?.id
        : selectedService.value?.doctorId;

    if (!targetDoctorId) {
        isLoadingSlots.value = false;
        return;
    }

    const targetDuration = bookingMode.value === 'service'
        ? (selectedService.value?.durationInMinutes || 30)
        : 30;

    const targetStartDate = getLocalToday();

    try {
        const payload = {
            doctorId: targetDoctorId,
            date: targetStartDate,
            durationInMinutes: targetDuration
        };

        const data = await workSessionStore.getAvailableTimeSlots(payload);

        weeklySchedule.value = data || [];
        extractSlotsForSelectedDate();

    } catch (error) {
        console.error("Lỗi lấy lịch trống:", error);
    } finally {
        isLoadingSlots.value = false;
    }
};

const extractSlotsForSelectedDate = () => {
    if (!weeklySchedule.value.length) {
        availableSlots.value = [];
        return;
    }

    const dateStr = selectedDate.value;

    const dayData = weeklySchedule.value.find(d => {
        const backendDateStr = d.date.split('T')[0];
        return backendDateStr === dateStr;
    });

    if (dayData && dayData.availableTimeSlots && dayData.availableTimeSlots.length > 0) {
        availableSlots.value = dayData.availableTimeSlots.map(s => ({
            id: s.startTime,
            time: s.timeString,
            isFull: s.isFull
        }));
    } else {
        availableSlots.value = [];
    }
};

watch(selectedDate, (newDate) => {
    if (step.value === 2) {
        selectedSlot.value = null;
        extractSlotsForSelectedDate();
    }
});

const filteredDoctors = computed(() => doctorsBySpecialty.value || []);

const canProceedToStep2 = computed(() => {
    if (bookingMode.value === 'doctor') return !!selectedDoctor.value;
    if (bookingMode.value === 'service') return !!selectedService.value;
    return false;
});

const setMode = (mode) => {
    bookingMode.value = mode;
    selectedSpecialty.value = null;
    selectedDoctor.value = null;
    selectedService.value = null;
};

const selectSpecialty = (spec) => {
    selectedSpecialty.value = spec;
};

const calculateTotal = () => {
    if (bookingMode.value === 'doctor' && selectedDoctor.value) {
        return selectedDoctor.value.price || 0;
    }

    if (bookingMode.value === 'service' && selectedService.value) {
        return selectedService.value.price || 0;
    }

    return 0;
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

const formatDateFull = (dateStr) => {
    const d = new Date(dateStr);
    return `Ngày ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const next7Days = computed(() => {
    const days = [];
    const today = new Date();

    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const date = String(d.getDate()).padStart(2, '0');
        const fullDateStr = `${year}-${month}-${date}`;

        days.push({
            full: fullDateStr,
            dayName: i === 0 ? 'Hôm nay' : dayNames[d.getDay()],
            dayNumber: d.getDate()
        });
    }
    return days;
});

const submitBooking = async () => {
    isSubmitting.value = true;
    try {
        const timeParts = selectedSlot.value.time.split(' - ');
        const startTimeStr = timeParts[0] + ":00";
        const endTimeStr = timeParts[1] + ":00";

        const payload = {
            patientProfileId: selectedProfile.value.id,
            doctorId: bookingMode.value === 'doctor' ? selectedDoctor.value?.id : null,
            serviceId: bookingMode.value === 'service' ? selectedService.value?.id : null,
            date: selectedDate.value,
            startTime: startTimeStr,
            endTime: endTimeStr
        };

        const result = await appointmentStore.createAppointment(payload);
        isSuccess.value = true;

    } catch (error) {
        console.error('Lỗi đặt lịch:', error);
        alert(error.message?.replace(/^Error:\s*/, '').trim() || 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!');
    } finally {
        isSubmitting.value = false;
    }
};

const resetWizard = () => {
    step.value = 1;
    isSuccess.value = false;
    selectedProfile.value = null;
    selectedSlot.value = null;
    selectedDoctor.value = null;
    selectedDate.value = getLocalToday();
    availableProfiles.value = [];
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.fade-in {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.booking-page-wrapper {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #111827;
}

.booking-card {
    background: #ffffff;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.03);
    overflow: hidden;
}

.wizard-header {
    padding: 32px 48px;
    border-bottom: 1px solid #e5e7eb;
    background: #ffffff;
}

.text-center {
    text-align: center;
}

.header-text h2 {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
}

.text-muted {
    color: #4b5563;
    font-size: 15px;
    margin: 0;
}

.modern-stepper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 32px;
    padding: 0 20px;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 2;
    width: 90px;
}

.step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #ffffff;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    border: 2px solid #e5e7eb;
    transition: all 0.2s;
}

.step-label {
    font-size: 14px;
    font-weight: 500;
    color: #9ca3af;
    transition: all 0.2s;
    white-space: nowrap;
}

.step.active .step-circle {
    border-color: #45C3D2;
    background-color: #45C3D2;
    color: #fff;
    box-shadow: 0 0 0 4px rgba(69, 195, 210, 0.15);
}

.step.active .step-label {
    color: #45C3D2;
    font-weight: 600;
}

.step.completed .step-circle {
    border-color: #45C3D2;
    background-color: #ffffff;
    color: #45C3D2;
}

.step.completed .step-label {
    color: #45C3D2;
    font-weight: 500;
}

.step-line {
    flex: 1;
    height: 2px;
    background-color: #e5e7eb;
    margin: -20px 0 0;
    transition: all 0.2s;
}

.step-line.completed {
    background-color: #45C3D2;
}

.wizard-body {
    padding: 40px 48px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 16px 0;
}

.mt-4 {
    margin-top: 16px;
}

.mt-20 {
    margin-top: 20px;
}

.mt-24 {
    margin-top: 24px;
}

.mb-0 {
    margin-bottom: 0 !important;
}

.text-sm {
    font-size: 13.5px;
}

.font-bold {
    font-weight: 600;
}

.text-primary {
    color: #45C3D2;
}

.segmented-control {
    display: flex;
    background-color: #f9fafb;
    padding: 4px;
    border-radius: 8px;
    margin-bottom: 32px;
    border: 1px solid #e5e7eb;
}

.segment-btn {
    flex: 1;
    padding: 12px;
    border: none;
    background: transparent;
    font-size: 15px;
    font-weight: 600;
    color: #4b5563;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
}

.segment-btn.active {
    background-color: #ffffff;
    color: #45C3D2;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.grid-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
}

.selection-card {
    display: flex;
    align-items: center;
    padding: 18px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    background: #ffffff;
}

.selection-card.small-card {
    padding: 14px 18px;
}

.selection-card:hover {
    border-color: #a0d8df;
    background-color: #fcfefe;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.selection-card.selected {
    border-color: #45C3D2;
    background-color: #f0fbf9;
    box-shadow: none;
    transform: none;
}

.spec-icon-mini {
    width: 60px !important;
    min-width: 60px !important;
    height: 60px !important;
    min-height: 60px !important;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    margin-right: 18px !important;
    flex-shrink: 0;
    background-color: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    padding: 2px;
}

.card-avatar-img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 18px;
    border: 2px solid #f3f4f6;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
}

.service-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background: #e0f7f5;
    color: #45C3D2;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    flex-shrink: 0;
}

.service-icon svg {
    width: 24px;
    height: 24px;
}

.avatar-circle {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #f3f4f6;
    color: #374151;
    font-weight: 700;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    flex-shrink: 0;
    border: 1px solid #e5e7eb;
}

.card-info {
    flex: 1;
    min-width: 0;
}

.card-info h4 {
    margin: 0 0 6px 0;
    font-size: 16px;
    color: #111827;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.price-text {
    color: #f97316;
    font-weight: 600;
    font-size: 14.5px;
    margin: 6px 0 0;
}

.radio-circle {
    width: 22px;
    height: 22px;
    border: 1.5px solid #d1d5db;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: 0.2s;
}

.selection-card.selected .radio-circle {
    border-color: #45C3D2;
    background-color: #45C3D2;
}

.selection-card.selected .radio-circle::after {
    content: '';
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
}

.date-selector {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 8px;
    margin-bottom: 20px;
}

.date-selector::-webkit-scrollbar {
    height: 4px;
}

.date-selector::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
}

.date-card {
    min-width: 85px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 14px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    cursor: pointer;
    background: #ffffff;
    transition: 0.2s;
}

.date-card.active {
    background-color: #45C3D2;
    border-color: #45C3D2;
    box-shadow: 0 4px 10px rgba(69, 195, 210, 0.2);
}

.day-name {
    font-size: 13px;
    margin-bottom: 4px;
    color: #6b7280;
    font-weight: 500;
}

.date-card.active .day-name {
    color: rgba(255, 255, 255, 0.9);
}

.day-number {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
}

.date-card.active .day-number {
    color: #ffffff;
}

.time-slots {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
}

.slot-btn {
    padding: 16px 12px;
    border: 1.5px solid #e5e7eb;
    background: #ffffff;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    transition: 0.2s;
    font-family: 'Inter', sans-serif;
}

.slot-btn:hover:not(.full) {
    border-color: #45C3D2;
    color: #45C3D2;
    background: #f0fbf9;
}

.slot-btn.selected {
    background-color: #45C3D2;
    border-color: #45C3D2;
    color: #ffffff;
}

.slot-btn.full {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.7;
}

.doctor-hint {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
}

.slot-btn.selected .doctor-hint {
    color: rgba(255, 255, 255, 0.9);
}

.summary-box {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
}

.summary-title {
    background: #f9fafb;
    padding: 18px 24px;
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    border-bottom: 1px solid #e5e7eb;
}

.summary-section {
    padding: 24px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 15px;
}

.summary-row:last-child {
    margin-bottom: 0;
}

.summary-row .label {
    color: #4b5563;
    font-weight: 500;
}

.summary-row .value {
    color: #111827;
    text-align: right;
    font-weight: 500;
}

.summary-row.highlight {
    background: #f0fbf9;
    padding: 16px;
    border-radius: 8px;
    margin: 16px -16px -16px;
    border: 1px solid #c2f0e9;
}

.pt-0 {
    padding-top: 0;
}

.total-row {
    border-top: 1px solid #e5e7eb;
    padding-top: 20px;
    font-size: 16px;
    font-weight: 600;
    align-items: center;
}

.total-price {
    color: #111827;
    font-size: 18px;
    font-weight: 700;
}

.empty-state,
.loading-state {
    text-align: center;
    padding: 40px 20px;
    background: #f9fafb;
    border-radius: 10px;
    border: 1px dashed #d1d5db;
    color: #6b7280;
    font-size: 15px;
    font-weight: 500;
}

.success-screen {
    padding: 40px 20px;
}

.success-icon {
    width: 70px;
    height: 70px;
    background: #e0f7f5;
    color: #0d9488;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
}

.success-icon svg {
    width: 36px;
    height: 36px;
}

.justify-center {
    justify-content: center !important;
}

.spinner,
.spinner-large {
    border: 2.5px solid rgba(0, 0, 0, 0.1);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.spinner {
    width: 18px;
    height: 18px;
    border-top-color: #fff;
}

.spinner-large {
    width: 32px;
    height: 32px;
    border-top-color: #45C3D2;
    margin: 0 auto 16px;
    display: block;
}

.wizard-footer {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
}

.spacer {
    flex: 1;
}

.btn-primary,
.btn-secondary {
    width: auto !important;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    height: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    padding: 0 28px;
}

.btn-primary {
    background-color: #45C3D2;
    color: #fff;
    border: none;
}

.btn-primary:hover:not(:disabled) {
    background-color: #3ba3b0;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(69, 195, 210, 0.2);
}

.btn-primary:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.btn-secondary {
    background-color: #ffffff;
    color: #4b5563;
    border: 1.5px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #f9fafb;
    border-color: #9ca3af;
    color: #111827;
}

@media (max-width: 768px) {
    .booking-card {
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    .wizard-header,
    .wizard-body {
        padding: 24px 20px;
    }

    .modern-stepper .step-label {
        display: none;
    }

    .wizard-footer {
        flex-direction: column-reverse;
    }

    .btn-primary,
    .btn-secondary {
        width: 100% !important;
    }

    .spacer {
        display: none;
    }
}
</style>