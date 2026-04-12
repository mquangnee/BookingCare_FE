<template>
    <Teleport to="body">
        <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
            <div class="modal-content modal-xl slide-down">
                <div class="modal-header">
                    <div>
                        <h2 class="modal-title">Tiếp nhận Khách vãng lai</h2>
                        <p class="modal-subtitle">Hoàn tất thủ tục đăng ký và check-in</p>
                    </div>
                    <button type="button" class="close-btn" @click="$emit('close')">&times;</button>
                </div>

                <div class="stepper-container">
                    <div class="step" :class="{ active: step >= 1, completed: step > 1 }">
                        <div class="step-circle"><span v-if="step > 1">✓</span><span v-else>1</span></div>
                        <span class="step-label">Hồ sơ</span>
                    </div>
                    <div class="step-line" :class="{ completed: step > 1 }"></div>

                    <div class="step" :class="{ active: step >= 2, completed: step > 2 }">
                        <div class="step-circle"><span v-if="step > 2">✓</span><span v-else>2</span></div>
                        <span class="step-label">Dịch vụ & Lịch</span>
                    </div>
                    <div class="step-line" :class="{ completed: step > 2 }"></div>

                    <div class="step" :class="{ active: step === 3 }">
                        <div class="step-circle">3</div>
                        <span class="step-label">Thanh toán</span>
                    </div>
                </div>

                <div class="modal-body">
                    <div v-if="step === 1" class="step-content fade-in">
                        <div class="segmented-control">
                            <button type="button" :class="['segment-btn', { active: activeTab === 'existing' }]"
                                @click="activeTab = 'existing'">
                                Tra cứu Bệnh nhân cũ
                            </button>
                            <button type="button" :class="['segment-btn', { active: activeTab === 'new' }]"
                                @click="activeTab = 'new'">
                                Tạo Hồ sơ mới
                            </button>
                        </div>

                        <div v-if="activeTab === 'existing'" class="section-existing">
                            <div v-if="!selectedPatient">
                                <div class="search-box">
                                    <input type="text" v-model="searchQuery" class="form-control"
                                        placeholder="Nhập Số điện thoại hoặc Tên bệnh nhân..." />
                                </div>
                                <div v-if="searchQuery.length > 1" class="search-results">
                                    <div v-if="searchResults.length === 0" class="no-result">Không tìm thấy hồ sơ nào
                                        phù hợp.</div>
                                    <div v-for="p in searchResults" :key="p.id" class="result-item"
                                        @click="selectPatient(p)">
                                        <div class="avatar">{{ p.fullName.charAt(0) }}</div>
                                        <div class="info">
                                            <strong>{{ p.fullName }}</strong>
                                            <span>SĐT: {{ p.phoneNumber }} | {{ getGenderName(p.gender) }} - {{
                                                p.dateOfBirth?.substring(0, 4) }}</span>
                                        </div>
                                        <button type="button" class="btn-select">Chọn</button>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="selected-patient-card">
                                <div class="patient-details">
                                    <div class="avatar bg-primary">{{ selectedPatient.fullName.charAt(0) }}</div>
                                    <div>
                                        <strong>{{ selectedPatient.fullName }}</strong>
                                        <p>SĐT: {{ selectedPatient.phoneNumber }} | {{
                                            getGenderName(selectedPatient.gender) }} - {{ selectedPatient.dateOfBirth.substring(0, 4) }}
                                        </p>
                                    </div>
                                </div>
                                <button type="button" class="btn-text-sm text-red" @click="clearSelectedPatient">Hủy
                                    chọn</button>
                            </div>
                        </div>

                        <div v-if="activeTab === 'new'" class="section-new form-grid">
                            <div class="form-row">
                                <div class="form-group flex-1">
                                    <label>Họ và tên <span class="text-red">*</span></label>
                                    <input type="text" v-model="newPatient.fullName" class="form-control"
                                        placeholder="Nhập họ và tên..." />
                                </div>
                                <div class="form-group flex-1">
                                    <label>Số điện thoại <span class="text-red">*</span></label>
                                    <input type="text" v-model="newPatient.phoneNumber" class="form-control"
                                        placeholder="09xxxxxxx" />
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group flex-1">
                                    <label>Ngày sinh <span class="text-red">*</span></label>
                                    <input type="date" v-model="newPatient.dob" class="form-control" />
                                </div>
                                <div class="form-group flex-1">
                                    <label>Giới tính <span class="text-red">*</span></label>
                                    <select v-model="newPatient.gender" class="form-control">
                                        <option :value="0">Nam</option>
                                        <option :value="1">Nữ</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Số CCCD / Hộ chiếu <span class="text-red">*</span></label>
                                <input type="text" v-model="newPatient.citizenId" class="form-control"
                                    placeholder="Nhập số căn cước công dân..." />
                            </div>
                        </div>
                    </div>

                    <div v-else-if="step === 2" class="step-content fade-in">
                        <div class="segmented-control">
                            <button type="button"
                                :class="['segment-btn', { active: appointmentData.mode === 'doctor' }]"
                                @click="appointmentData.mode = 'doctor'">
                                Khám theo Bác sĩ
                            </button>
                            <button type="button"
                                :class="['segment-btn', { active: appointmentData.mode === 'service' }]"
                                @click="appointmentData.mode = 'service'">
                                Khám theo Dịch vụ
                            </button>
                        </div>

                        <div class="form-grid">
                            <div v-if="appointmentData.mode === 'doctor'" class="form-group slide-down">
                                <label>Chọn Bác sĩ <span class="text-red">*</span></label>
                                <select v-model="appointmentData.doctorId" class="form-control"
                                    @change="fetchAvailableSlots">
                                    <option value="" disabled>-- Vui lòng chọn ca làm việc của bác sĩ --</option>
                                    <option v-for="doc in doctors" :key="doc.id" :value="doc.doctorId">
                                        {{ getPositionName(doc.position) }} {{ doc.doctorName }} - {{ doc.specialtyName
                                        }}
                                    </option>
                                </select>
                            </div>

                            <template v-if="appointmentData.mode === 'service'">
                                <div class="form-group slide-down">
                                    <label>Chọn Dịch vụ <span class="text-red">*</span></label>
                                    <select v-model="appointmentData.serviceId" class="form-control"
                                        @change="fetchAvailableSlots">
                                        <option value="" disabled>-- Vui lòng chọn dịch vụ --</option>
                                        <option v-for="svc in services" :key="svc.id" :value="svc.id">
                                            {{ svc.name }} - {{ formatPrice(svc.price) }}
                                        </option>
                                    </select>
                                </div>

                                <div v-if="appointmentData.serviceId" class="form-group slide-down mt-2">
                                    <label>Chọn Bác sĩ thực hiện <span class="text-red">*</span></label>
                                    <select v-model="appointmentData.doctorId" class="form-control"
                                        @change="resetSlotSelection">
                                        <option value="" disabled>-- Vui lòng chọn bác sĩ --</option>
                                        <option v-for="doc in serviceDoctors" :key="doc.id" :value="doc.id">
                                            {{ getPositionName(doc.position) }} {{ doc.doctorName }}
                                        </option>
                                    </select>
                                    <span v-if="isFetchingSlots" class="text-sm text-primary mt-1">Đang tìm bác sĩ phù
                                        hợp...</span>
                                    <span v-else-if="serviceDoctors.length === 0" class="text-sm text-red mt-1">Không có
                                        bác sĩ nào trống lịch cho dịch vụ này trong hôm nay.</span>
                                </div>
                            </template>

                            <div v-if="appointmentData.doctorId" class="slots-container slide-down mt-4">
                                <label>Khung giờ trống hiện tại <span class="text-red">*</span></label>
                                <div class="time-slots">
                                    <button type="button" v-for="slot in displaySlots" :key="slot.id"
                                        :class="['slot-btn', { selected: appointmentData.slotId === slot.id, past: slot.isPast }]"
                                        :disabled="slot.isPast"
                                        @click="appointmentData.slotId = slot.id; appointmentData.timeString = slot.time">
                                        <span class="time">{{ slot.time }}</span>
                                    </button>
                                </div>
                                <p v-if="displaySlots.length === 0 && !isFetchingSlots" class="text-sm text-gray mt-2">
                                    Không còn ca trống, vui lòng chọn bác sĩ/dịch vụ khác.
                                </p>
                            </div>

                            <div class="form-group mt-4">
                                <label>Lý do khám / Triệu chứng</label>
                                <textarea v-model="appointmentData.reason" class="form-control" rows="2"
                                    placeholder="Nhập triệu chứng của bệnh nhân..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="step === 3" class="step-content fade-in">
                        <div class="summary-box">
                            <div class="summary-row">
                                <span class="label">Bệnh nhân:</span>
                                <span class="value font-bold">{{ activeTab === 'existing' ? selectedPatient?.fullName :
                                    newPatient.fullName
                                    }}</span>
                            </div>
                            <div class="summary-row">
                                <span class="label">Bác sĩ phụ trách:</span>
                                <span class="value font-bold">BS. {{ selectedDoctorName }}</span>
                            </div>
                            <div class="summary-row">
                                <span class="label">Giờ khám:</span>
                                <span class="value text-primary font-bold">{{ appointmentData.timeString }} (Hôm
                                    nay)</span>
                            </div>
                            <div class="summary-row total-row">
                                <span class="label">Tổng phí dự kiến:</span>
                                <span class="value total-price">{{ formatPrice(calculatedPrice) }}</span>
                            </div>
                        </div>

                        <h3 class="section-title mt-24">Phương thức thanh toán</h3>
                        <div class="payment-methods">
                            <div :class="['payment-card', { active: paymentMethod === 'cash' }]"
                                @click="paymentMethod = 'cash'">
                                <div class="radio-circle"></div>
                                <div class="payment-info">
                                    <strong>Tiền mặt</strong>
                                    <span>Thanh toán trực tiếp tại quầy</span>
                                </div>
                            </div>
                            <div :class="['payment-card', { active: paymentMethod === 'qr' }]"
                                @click="paymentMethod = 'qr'">
                                <div class="radio-circle"></div>
                                <div class="payment-info">
                                    <strong>Chuyển khoản QR</strong>
                                    <span>Quét mã VietQR</span>
                                </div>
                            </div>
                        </div>

                        <div v-if="paymentMethod === 'qr'" class="qr-container slide-down">
                            <div class="qr-box">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                                    alt="QR Code" class="qr-img" />
                            </div>
                            <p class="text-sm text-gray mt-2 text-center">Vui lòng yêu cầu bệnh nhân quét mã để thanh
                                toán.</p>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button v-if="step === 1" type="button" class="btn-outline" @click="$emit('close')">Hủy bỏ</button>
                    <button v-if="step > 1" type="button" class="btn-outline" @click="step--">Quay lại</button>

                    <button v-if="step < 3" type="button" class="btn-primary" @click="handleNextStep"
                        :disabled="!canProceed || isSubmittingProfile">
                        <span v-if="isSubmittingProfile">Đang xử lý...</span>
                        <span v-else>Tiếp tục</span>
                    </button>

                    <button v-if="step === 3" type="button" class="btn-primary" @click="submit"
                        :disabled="!canSubmit">Xác nhận &
                        Check-in</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { getPositionName, getGenderName } from '../../../constants/enum'
import { useServiceStore } from '@/stores/serviceStore'
import { useWorkSessionStore } from '@/stores/workSessionStore'
import { useProfileStore } from '@/stores/profileStore'
import { notifyError, notifySuccess } from '@/utils/notify'

const serviceStore = useServiceStore();
const workSessionStore = useWorkSessionStore();
const profileStore = useProfileStore();

const props = defineProps({
    isOpen: Boolean,
    defaultDoctorId: [String, Number]
})
const emit = defineEmits(['close', 'submit'])

const doctors = ref([]);
const services = ref([]);
const isFetchingData = ref(false);
const isFetchingSlots = ref(false);
const isSubmittingProfile = ref(false); // Thêm dòng này dưới các biến ref()

const step = ref(1);
const activeTab = ref('existing');
const searchQuery = ref('');
const selectedPatient = ref(null);
const searchResults = ref([]);
const newPatient = ref({ fullName: '', phoneNumber: '', gender: 0, dob: '', citizenId: '' });

// Cập nhật state quản lý form
const appointmentData = ref({ mode: 'doctor', doctorId: '', serviceId: '', slotId: '', timeString: '', reason: '' });
const rawAvailableSlots = ref([]); // Chứa toàn bộ slot gọi từ API
const paymentMethod = ref('cash');

// Lọc ra danh sách Bác sĩ từ các Slot của Dịch vụ
const serviceDoctors = computed(() => {
    if (appointmentData.value.mode !== 'service') return [];

    // Dùng Map để lọc các bác sĩ trùng lặp
    const map = new Map();
    rawAvailableSlots.value.forEach(slot => {
        if (slot.doctorId && !map.has(slot.doctorId)) {
            map.set(slot.doctorId, {
                id: slot.doctorId,
                doctorName: slot.doctorName
            });
        }
    });
    return Array.from(map.values());
});

// Lọc ra các Slot để hiển thị (dựa trên bác sĩ đã chọn)
const displaySlots = computed(() => {
    if (!appointmentData.value.doctorId) return [];
    return rawAvailableSlots.value.filter(s => s.doctorId === appointmentData.value.doctorId);
});

// Tính toán tên Bác sĩ cho phần Tóm tắt
const selectedDoctorName = computed(() => {
    if (!appointmentData.value.doctorId) return '';
    if (appointmentData.value.mode === 'doctor') {
        const doc = doctors.value.find(d => d.doctorId === appointmentData.value.doctorId);
        return doc ? doc.doctorName : '';
    } else {
        const doc = serviceDoctors.value.find(d => d.id === appointmentData.value.doctorId);
        return doc ? doc.name : '';
    }
});


const fetchInitialData = async () => {
    isFetchingData.value = true;
    try {
        const today = new Date('2026-04-11').toISOString().split('T')[0];
        const [servicesRes, sessionsRes] = await Promise.all([
            serviceStore.getServices(),
            workSessionStore.getDoctorWorkSessions(today)
        ]);
        services.value = servicesRes || [];
        if (sessionsRes) {
            // SỬA Ở ĐÂY: Dùng Map để lọc bỏ các bác sĩ bị trùng ID (Do có nhiều ca trong ngày)
            const uniqueDoctorsMap = new Map();
            
            sessionsRes.forEach(session => {
                if (!uniqueDoctorsMap.has(session.doctorId)) {
                    uniqueDoctorsMap.set(session.doctorId, {
                        doctorId: session.doctorId,
                        doctorName: session.doctorName,
                        specialtyName: session.specialtyName,
                        position: session.position,
                        durationInMinutes: session.durationInMinutes,
                        doctorPrice: session.doctorPrice
                    });
                }
            });
            
            // Chuyển Map trở lại thành Array để hiển thị lên UI
            doctors.value = Array.from(uniqueDoctorsMap.values());
        }
    } catch (error) {
        console.error("Lỗi khởi tạo dữ liệu modal:", error);
    } finally {
        isFetchingData.value = false;
    }
}

let searchTimeout;
watch(searchQuery, (keyword) => {
    clearTimeout(searchTimeout);
    if (keyword.length < 2) {
        searchResults.value = [];
        return;
    }
    searchTimeout = setTimeout(async () => {
        try {
            const response = await profileStore.searchPatientProfiles(keyword);
            searchResults.value = response || [];
        } catch (error) {
            console.error("Lỗi tìm kiếm bệnh nhân", error);
            searchResults.value = [];
        }
    }, 500);
});

const fetchAvailableSlots = async () => {
    // Reset lại lựa chọn khi fetch data mới
    appointmentData.value.slotId = '';
    appointmentData.value.timeString = '';
    rawAvailableSlots.value = [];

    // Nếu đang ở mode Service, khi đổi dịch vụ phải bắt chọn lại Bác sĩ
    if (appointmentData.value.mode === 'service') {
        appointmentData.value.doctorId = '';
    }

    const today = new Date('2026-04-11').toISOString().split('T')[0];
    const payload = { date: today };

    if (appointmentData.value.mode === 'doctor') {
        if (!appointmentData.value.doctorId) return;
        payload.doctorId = appointmentData.value.doctorId;
        payload.durationInMinutes = doctors.value.find(d => d.doctorId === appointmentData.value.doctorId)?.durationInMinutes;
    } else {
        if (!appointmentData.value.serviceId) return;
        payload.serviceId = appointmentData.value.serviceId;
        payload.durationInMinutes = services.value.find(s => s.id === appointmentData.value.serviceId)?.durationInMinutes;
    }

    isFetchingSlots.value = true;
    try {
        const res = await workSessionStore.getAvailableTimeSlots(payload);

        if (res && res.length > 0) {
            const dayData = res.find(d => d.date.split('T')[0] === today);
            if (dayData && dayData.availableTimeSlots) {
                const now = new Date();
                const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

                rawAvailableSlots.value = dayData.availableTimeSlots
                    .filter(slot => !slot.isFull)
                    .map(slot => {
                        const startTime = slot.timeString.substring(0, 5);
                        const isPast = startTime < currentTime;

                        return {
                            id: `${slot.startTime}_${slot.doctorId}`,
                            time: slot.timeString,
                            doctorId: slot.doctorId,
                            doctorName: slot.doctorName,
                            isPast: isPast
                        };
                    });
            }
        }
    } catch (error) {
        console.error("Lỗi lấy khung giờ trống:", error);
    } finally {
        isFetchingSlots.value = false;
    }
}

const handleNextStep = async () => {
    if (step.value === 1 && activeTab.value === 'new') {
        isSubmittingProfile.value = true;
        try {
            const response = await profileStore.createPatientProfileByReceptionist(newPatient.value);
            selectedPatient.value = {
                id: response.id, // Thay bằng trường ID trả về từ API của bạn
                fullName: newPatient.value.fullName,
                phoneNumber: newPatient.value.phoneNumber,
                gender: newPatient.value.gender,
                dateOfBirth: newPatient.value.dateOfBirth,
                citizenId: newPatient.value.citizenId
            };
            activeTab.value = 'existing';
            notifySuccess("Tạo hồ sơ bệnh nhân thành công!");
            step.value++;

        } catch (error) {
            console.error("Lỗi khi tạo hồ sơ:", error);
            notifyError(error.message || "Có lỗi xảy ra khi tạo hồ sơ bệnh nhân. Vui lòng kiểm tra lại!");
        } finally {
            isSubmittingProfile.value = false;
        }
    } else {
        step.value++;
    }
}


// Theo dõi khi đổi Mode khám -> Reset sạch dữ liệu ở Bước 2
watch(() => appointmentData.value.mode, () => {
    appointmentData.value.doctorId = '';
    appointmentData.value.serviceId = '';
    appointmentData.value.slotId = '';
    appointmentData.value.timeString = '';
    rawAvailableSlots.value = [];
});

const resetSlotSelection = () => {
    appointmentData.value.slotId = '';
    appointmentData.value.timeString = '';
}

const selectPatient = (patient) => { selectedPatient.value = patient; searchQuery.value = ''; searchResults.value = []; }
const clearSelectedPatient = () => { selectedPatient.value = null; }
const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

const calculatedPrice = computed(() => {
    if (appointmentData.value.mode === 'service' && appointmentData.value.serviceId) {
        const svc = services.value.find(s => s.id === appointmentData.value.serviceId);
        return svc ? svc.price : 0;
    }
    if (appointmentData.value.mode === 'doctor' && appointmentData.value.doctorId) {
        const doc = doctors.value.find(d => d.doctorId === appointmentData.value.doctorId);
        return doc ? doc.doctorPrice : 0;
    }
});

const canProceed = computed(() => {
    if (step.value === 1) {
        return activeTab.value === 'existing' ? !!selectedPatient.value : (newPatient.value.fullName.trim() !== '' && newPatient.value.phoneNumber.trim() !== '' && newPatient.value.dob !== '');
    }
    if (step.value === 2) {
        return !!appointmentData.value.doctorId && !!appointmentData.value.slotId;
    }
    return true;
});

const canSubmit = computed(() => true);

const submit = () => {
    const payload = {
        patient: { ...selectedPatient.value, isNew: false }, // Luôn là false vì đã tạo ở Bước 1
        appointment: { ...appointmentData.value },
        payment: { method: paymentMethod.value, amount: calculatedPrice.value }
    };
    emit('submit', payload);
}

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        step.value = 1;
        activeTab.value = 'existing';
        searchQuery.value = '';
        selectedPatient.value = null;
        searchResults.value = [];
        newPatient.value = { fullName: '', phoneNumber: '', gender: 0, dob: '', citizenId: '' };
        appointmentData.value = { mode: 'doctor', doctorId: props.defaultDoctorId || '', serviceId: '', slotId: '', timeString: '', reason: '' };
        paymentMethod.value = 'cash';
        rawAvailableSlots.value = [];
        fetchInitialData();
    }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Đảm bảo Font Inter áp dụng triệt để */
.modal-overlay,
.modal-content,
input,
select,
textarea,
button,
span,
p,
h2,
h3,
strong,
div {
    font-family: 'Inter', -apple-system, sans-serif !important;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(17, 24, 39, 0.6);
    backdrop-filter: blur(3px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    background: #fff;
    border-radius: 12px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-xl {
    max-width: 680px;
}

/* Header */
.modal-header {
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 4px 0;
}

.modal-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    color: #9ca3af;
    cursor: pointer;
    transition: 0.2s;
    line-height: 1;
    margin-top: -4px;
}

.close-btn:hover {
    color: #111827;
}

/* Stepper */
.stepper-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 40px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 2;
    width: 80px;
}

.step-circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #e5e7eb;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 13px;
    transition: 0.3s;
}

.step-label {
    font-size: 13px;
    font-weight: 500;
    color: #9ca3af;
    white-space: nowrap;
    transition: 0.3s;
}

.step.active .step-circle {
    border-color: #45C3D2;
    background: #45C3D2;
    color: #fff;
    box-shadow: 0 0 0 4px rgba(69, 195, 210, 0.15);
}

.step.active .step-label {
    color: #45C3D2;
    font-weight: 600;
}

.step.completed .step-circle {
    border-color: #45C3D2;
    color: #45C3D2;
}

.step-line {
    flex: 1;
    height: 2px;
    background: #e5e7eb;
    margin: -20px 0 0;
    transition: 0.3s;
}

.step-line.completed {
    background: #45C3D2;
}

/* Body */
.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
}

.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    background: #fff;
}

/* Common Elements */
.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 16px 0;
}

.segmented-control {
    display: flex;
    background-color: #f3f4f6;
    padding: 4px;
    border-radius: 8px;
    margin-bottom: 24px;
    border: 1px solid #e5e7eb;
}

.segment-btn {
    flex: 1;
    padding: 10px;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
}

.segment-btn.active {
    background-color: #ffffff;
    color: #111827;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-row {
    display: flex;
    gap: 16px;
}

.flex-1 {
    flex: 1;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-weight: 500;
    font-size: 14px;
    color: #374151;
}

.form-group span {
    font-size: 13px;
    color: #dc2626;
}

.form-control {
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    color: #111827;
    transition: 0.2s;
    outline: none;
}

.form-control:focus {
    border-color: #45C3D2;
    box-shadow: 0 0 0 3px rgba(69, 195, 210, 0.15);
}

/* Step 1: Patient Search */
.no-result {
    padding: 16px;
    text-align: center;
    font-size: 14px;
    color: #6b7280;
}

.search-box {
    margin-bottom: 8px;
}

.search-box input {
    width: 100%;
}

.search-results {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    max-height: 350px;
    overflow-y: auto;
    background: #fff;
    margin-top: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.result-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 16px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: 0.2s;
}

.result-item:hover {
    background: #f9fafb;
}

.result-item .info strong {
    display: block;
    font-size: 14px;
    color: #111827;
    margin-bottom: 2px;
}

.result-item .info span {
    font-size: 14px;
    color: #6b7280;
}

.btn-select {
    margin-left: auto;
    background: #fff;
    color: #45C3D2;
    border: 1px solid #45C3D2;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}

.selected-patient-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #f0fbf9;
    border: 1px solid #a0d8df;
    border-radius: 8px;
}

.patient-details {
    display: flex;
    align-items: center;
    gap: 16px;
}

.patient-details strong {
    font-size: 16px;
    color: #111827;
}

.patient-details p {
    margin: 4px 0 0 0;
    font-size: 13px;
    color: #4b5563;
}

.avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 18px;
    background: #e5e7eb;
    color: #374151;
}

.bg-primary {
    background: #45C3D2;
    color: #fff;
}

/* Step 2: Time Slots */
.slots-container label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 12px;
}

.time-slots {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
}

.slot-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 10px;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
}

.slot-btn .time {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
}

.slot-btn:hover:not(.past) {
    border-color: #45C3D2;
    background: #f0fbf9;
}

.slot-btn:hover:not(.past) .time {
    color: #45C3D2;
}

.slot-btn.selected {
    background: #45C3D2;
    border-color: #45C3D2;
}

.slot-btn.selected .time {
    color: #fff;
}

/* Slot đã qua */
.slot-btn.past {
    background-color: #f9fafb;
    border-color: #e5e7eb;
    cursor: not-allowed;
    opacity: 0.6;
}

.slot-btn.past .time {
    color: #9ca3af;
}

/* Step 3: Payment */
.summary-box {
    background: #f9fafb;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    margin-bottom: 24px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    color: #4b5563;
}

.summary-row:last-child {
    margin-bottom: 0;
}

.font-bold {
    font-weight: 600;
    color: #111827;
}

.text-primary {
    color: #45C3D2;
}

.total-row {
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
    margin-top: 12px;
    align-items: center;
}

.total-price {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
}

.payment-methods {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
}

.payment-card {
    flex: 1;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: 0.2s;
    background: #fff;
}

.payment-card:hover {
    border-color: #9ca3af;
}

.payment-card.active {
    border-color: #45C3D2;
    background: #f0fbf9;
    box-shadow: 0 0 0 1px #45C3D2;
}

.radio-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
}

.payment-card.active .radio-circle {
    border-color: #45C3D2;
    background: #45C3D2;
}

.payment-card.active .radio-circle::after {
    content: '';
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
}

.payment-info strong {
    display: block;
    font-size: 14px;
    color: #111827;
    margin-bottom: 2px;
}

.payment-info span {
    font-size: 12px;
    color: #6b7280;
}

.qr-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    background: #f9fafb;
    border-radius: 10px;
    border: 1px dashed #d1d5db;
}

.qr-box {
    padding: 16px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.qr-img {
    width: 160px;
    height: 160px;
    object-fit: contain;
}

.text-center {
    text-align: center;
}

/* Utils & Animations */
.btn-primary {
    background: #45C3D2;
    color: #fff;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
    font-size: 14px;
}

.btn-primary:hover:not(:disabled) {
    background: #3ba3b0;
}

.btn-primary:disabled {
    background: #d1d5db;
    cursor: not-allowed;
}

.btn-outline {
    background: #fff;
    border: 1px solid #d1d5db;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    font-size: 14px;
    transition: 0.2s;
}

.btn-outline:hover {
    background: #f9fafb;
}

.btn-text-sm {
    background: none;
    border: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
}

.btn-text-sm:hover {
    text-decoration: underline;
}

.text-red {
    color: #dc2626;
}

.text-primary {
    color: #45C3D2;
}

.text-gray {
    color: #6b7280;
}

.mt-2 {
    margin-top: 8px;
}

.mt-4 {
    margin-top: 16px;
}

.mt-24 {
    margin-top: 24px;
}

.fade-in {
    animation: fadeIn 0.3s ease forwards;
}

.slide-down {
    animation: slideDown 0.3s ease forwards;
}

@keyframes fadeIn {
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