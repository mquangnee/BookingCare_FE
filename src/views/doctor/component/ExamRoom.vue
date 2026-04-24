<template>
    <div class="exam-room slide-up">
        <div class="exam-layout">
            <div class="queue-panel card">
                <div class="panel-header">
                    <h2>Danh sách chờ khám</h2>
                    <span class="badge badge-primary">{{ pendingPatients.length }} chờ</span>
                </div>
                <div class="patient-list">
                    <div v-for="patient in sortedPatientQueue" :key="patient.id" class="patient-item"
                        :class="[patient.status, { active: currentPatient?.id === patient.id }]">
                        <div class="patient-info-basic">
                            <div class="p-time">{{ patient.time }}</div>
                            <div class="p-details">
                                <span class="p-code">{{ patient.appointmentCode }}</span>
                                <strong>{{ patient.name }}</strong>
                                <span>{{ patient.gender === 0 ? 'Nam' : 'Nữ' }} - {{ patient.age }} tuổi</span>
                            </div>
                        </div>
                        <div class="patient-actions">
                            <span v-if="patient.status === 'completed'" class="status-text text-green">Đã khám</span>
                            <span v-else-if="patient.status === 'skipped'" class="status-text text-gray">Bỏ qua</span>
                            <template v-else>
                                <button v-if="currentPatient?.id !== patient.id" class="btn-sm"
                                    @click="callPatient(patient)">Gọi vào</button>
                                <span v-else class="status-text text-blue">Đang khám...</span>
                            </template>
                        </div>
                    </div>

                    <div v-if="sortedPatientQueue.length === 0 && !isLoading" class="empty-state py-8">
                        <p>Không có lịch hẹn nào hôm nay.</p>
                    </div>
                </div>
            </div>

            <div class="exam-panel card">
                <template v-if="currentPatient">
                    <div class="exam-header">
                        <div class="exam-patient-profile">
                            <div class="avatar-circle">{{ currentPatient.name.charAt(0) }}</div>
                            <div>
                                <h2>{{ currentPatient.name }}</h2>
                                <p>Mã đặt lịch: <strong>{{ currentPatient.appointmentCode }}</strong> | {{
                                    currentPatient.gender === 0 ? 'Nam' : 'Nữ' }} - {{ currentPatient.age }} tuổi</p>
                            </div>
                        </div>
                        <div class="exam-header-actions">
                            <button class="btn-outline" @click="openHistoryModal">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                </svg>
                                Xem bệnh án cũ
                            </button>
                        </div>
                    </div>

                    <div class="exam-body form-grid">
                        <div class="form-group">
                            <label>Chẩn đoán bệnh <span class="text-red">*</span></label>
                            <textarea v-model="examForm.diagnosis" class="form-control" rows="3"
                                placeholder="Nhập kết luận chẩn đoán..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Lời dặn của Bác sĩ</label>
                            <textarea v-model="examForm.instructions" class="form-control" rows="2"
                                placeholder="Chế độ ăn uống, sinh hoạt..."></textarea>
                        </div>

                        <div class="form-group prescription-group">
                            <label>Đơn thuốc (Kê toa)</label>
                            <div class="prescription-search">
                                <input type="text" v-model="drugSearch" @input="searchDrug"
                                    placeholder="Nhập tên thuốc để tìm kiếm (VD: Para, Amo...)" class="form-control" />

                                <ul v-if="suggestedDrugs.length > 0" class="autocomplete-list">
                                    <li v-for="drug in suggestedDrugs" :key="drug.id" @click="addDrug(drug)">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" style="flex-shrink: 0;">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        <span class="drug-name-text">{{ drug.name }}</span>
                                        <span v-if="drug.function" class="drug-func-text">- {{ drug.function }}</span>
                                    </li>
                                </ul>
                            </div>

                            <div class="table-responsive" v-if="examForm.prescriptions.length > 0">
                                <table class="prescription-table">
                                    <thead>
                                        <tr>
                                            <th>Tên thuốc</th>
                                            <th style="width: 120px">Số lượng</th>
                                            <th>Cách dùng</th>
                                            <th style="width: 40px; text-align: center;"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in examForm.prescriptions" :key="index">
                                            <td class="drug-name-cell">{{ item.name }}</td>
                                            <td><input type="text" v-model="item.dosage" class="form-control"
                                                    placeholder="10 viên" /></td>
                                            <td><input type="text" v-model="item.usage" class="form-control"
                                                    placeholder="Sáng 1, Tối 1 sau ăn" /></td>
                                            <td style="text-align: center;">
                                                <button class="btn-delete" @click="removeDrug(index)"
                                                    title="Xóa thuốc">&times;</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="exam-footer">
                        <button class="btn-outline-danger" @click="skipCurrentPatient" :disabled="isSubmitting">Bệnh
                            nhân không đến</button>

                        <button class="btn-primary btn-auto-width" @click="finishExam" :disabled="isSubmitting">
                            <template v-if="isSubmitting">
                                Đang lưu kết quả...
                            </template>
                            <template v-else>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" style="flex-shrink: 0;">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                Hoàn thành & Trả kết quả
                            </template>
                        </button>
                    </div>
                </template>
                <div v-else class="empty-state fill-height">
                    <p>Chưa có bệnh nhân nào đang khám.</p>
                    <span class="text-sm">Hãy chọn "Gọi vào" từ danh sách chờ bên trái.</span>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div v-if="isHistoryModalOpen" class="modal-overlay" @click.self="closeHistoryModal">
                <div class="modal-content modal-lg slide-down">
                    <div class="modal-header">
                        <h2>Lịch sử khám bệnh - {{ currentPatient?.name }}</h2>
                        <button class="close-btn" @click="closeHistoryModal">&times;</button>
                    </div>
                    <div class="modal-body bg-gray-50">
                        <div v-if="patientHistory.length === 0" class="empty-state py-8">
                            <p>Bệnh nhân chưa có lịch sử khám bệnh trước đây.</p>
                        </div>

                        <div v-else class="history-timeline">
                            <div v-for="(record, index) in patientHistory" :key="index" class="history-card mb-4">
                                <div class="history-card-header">
                                    <div class="date-badge">
                                        <span class="day">{{ record.date.split('/')[0] }}</span>
                                        <span class="month">Th{{ record.date.split('/')[1] }}</span>
                                    </div>
                                    <div class="history-meta">
                                        <h4>Chẩn đoán: {{ record.diagnosis }}</h4>
                                        <p>BS. {{ record.doctor }} - {{ record.specialty }}</p>
                                    </div>
                                </div>
                                <div class="history-card-body">
                                    <div class="info-block">
                                        <strong>Lời dặn:</strong> {{ record.instructions || 'Không có' }}
                                    </div>
                                    <div v-if="record.prescriptions.length > 0" class="info-block mt-2">
                                        <strong>Đơn thuốc:</strong>
                                        <ul class="drug-list-simple">
                                            <li v-for="drug in record.prescriptions" :key="drug.name">
                                                - {{ drug.name }} ({{ drug.quantity }}): {{ drug.usage }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppointmentStore } from '../../../stores/appointmentStore'
import { useMedicineStore } from '../../../stores/medicineStore'
import { notifyError, notifySuccess } from '@/utils/notify'
import { useAuthStore } from '../../../stores/authStore'

import { signalRService } from '@/services/signalrService'

const appointmentStore = useAppointmentStore()
const medicineStore = useMedicineStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const isSubmitting = ref(false)
const currentPatient = ref(null)
const examForm = ref({ diagnosis: '', instructions: '', prescriptions: [] })

const patientQueue = ref([])
const allMedicines = ref([])

const pendingPatients = computed(() => patientQueue.value.filter(p => p.status === 'waiting' || p.status === 'examining'))

const sortedPatientQueue = computed(() => {
    return [...patientQueue.value].sort((a, b) => {
        const isADone = a.status === 'completed' || a.status === 'skipped';
        const isBDone = b.status === 'completed' || b.status === 'skipped';

        if (isADone && !isBDone) return 1;
        if (!isADone && isBDone) return -1;

        if (!a.time || !b.time) return 0;
        return a.time.localeCompare(b.time);
    });
})

const mapApiStatusToUI = (status) => {
    if (status === null || status === undefined) return 'waiting';
    const safeStatus = status.toString();
    switch (safeStatus) {
        case '3': return 'completed';
        case '4': return 'skipped';
        case '2': return 'examining';
        case '0':
        case 'pending':
        case '1':
        case 'approved':
        default: return 'waiting';
    }
}

const fetchTodayAppointments = async () => {
    isLoading.value = true;
    try {
        const response = await appointmentStore.getAppointmentsToday();

        if (!response || response.length === 0) {
            patientQueue.value = [];
            return;
        }

        const appointments = response.map(appt => ({
            id: appt.id,
            appointmentCode: appt.appointmentCode,
            name: appt.patientName,
            age: appt.age,
            gender: appt.gender,
            time: appt.startTime ? appt.startTime.substring(0, 5) : '--:--',
            status: mapApiStatusToUI(appt.status)
        }));

        patientQueue.value = appointments;
    } catch (error) {
        console.error("Lỗi khi tải danh sách lịch khám:", error);
        notifyError('Không thể tải danh sách bệnh nhân hôm nay.');
        patientQueue.value = [];
    } finally {
        isLoading.value = false;
    }
}

const fetchMedicines = async () => {
    try {
        allMedicines.value = await medicineStore.getMedicines();
    } catch (error) {
        console.error("Lỗi khi tải danh sách thuốc:", error);
        notifyError('Không thể tải danh sách thuốc.');
    }
}

onMounted(async () => {
    await fetchTodayAppointments();
    await fetchMedicines();

    const claims = authStore.getClaimsModel()
    if (claims) {
        signalRService.initConnection();

        signalRService.onAppointmentStatusChanged((newAppt) => {
            const formattedAppt = {
                id: newAppt.id,
                appointmentCode: newAppt.appointmentCode,
                name: newAppt.patientName,
                age: newAppt.age,
                gender: newAppt.gender,
                time: newAppt.startTime ? newAppt.startTime.substring(0, 5) : '--:--',
                status: mapApiStatusToUI(newAppt.status)
            };
            const existingIndex = patientQueue.value.findIndex(p => p.id === formattedAppt.id);

            if (existingIndex > -1) {
                patientQueue.value[existingIndex] = { ...patientQueue.value[existingIndex], ...formattedAppt };
            } else {
                patientQueue.value.push(formattedAppt);
            }

            if (formattedAppt.status === 'waiting') {
                notifySuccess(`Lễ tân vừa check-in: Bệnh nhân ${formattedAppt.name}`);
            }
        });

        await signalRService.startConnection(claims.sub);
    }
    else {
        notifyError('Không xác định được thông tin bác sĩ. Vui lòng đăng nhập lại.');
    }

})

onUnmounted(() => {
    signalRService.offAppointmentStatusChanged();
})

const callPatient = (patient) => {
    if (currentPatient.value && currentPatient.value.id !== patient.id) {
        const oldIdx = patientQueue.value.findIndex(p => p.id === currentPatient.value.id)
        if (oldIdx > -1) patientQueue.value[oldIdx].status = 'waiting'
    }
    currentPatient.value = patient
    const idx = patientQueue.value.findIndex(p => p.id === patient.id)
    if (idx > -1) patientQueue.value[idx].status = 'examining'
    examForm.value = { diagnosis: '', instructions: '', prescriptions: [] }
    drugSearch.value = ''; suggestedDrugs.value = []
}

const skipCurrentPatient = () => {
    if (!currentPatient.value) return
    const idx = patientQueue.value.findIndex(p => p.id === currentPatient.value.id)

    if (idx > -1) {
        patientQueue.value[idx].status = 'skipped'
    }

    currentPatient.value = null
}

const finishExam = async () => {
    if (!examForm.value.diagnosis) {
        notifyError("Vui lòng nhập chẩn đoán bệnh!")
        return
    }
    if (!currentPatient.value) return;

    isSubmitting.value = true;

    try {
        const payload = {
            appointmentId: currentPatient.value.id,
            diagnosis: examForm.value.diagnosis,
            instructions: examForm.value.instructions,
            prescriptionDetails: examForm.value.prescriptions.map(drug => ({
                medicineId: drug.medicineId,
                dosage: drug.dosage,
                usage: drug.usage
            }))
        };
        await appointmentStore.completeAppointment(payload);
        notifySuccess("Lưu kết quả khám thành công!");

        const idx = patientQueue.value.findIndex(p => p.id === currentPatient.value.id)
        if (idx > -1) {
            patientQueue.value[idx].status = 'completed'
        }
        currentPatient.value = null
    } catch (error) {
        console.error(error);
        notifyError("Đã xảy ra lỗi khi lưu kết quả.");
    } finally {
        isSubmitting.value = false;
    }
}

const drugSearch = ref('')
const suggestedDrugs = ref([])

const searchDrug = () => {
    if (!drugSearch.value.trim()) { suggestedDrugs.value = []; return }
    const keyword = drugSearch.value.toLowerCase()
    suggestedDrugs.value = allMedicines.value.filter(d => d.name.toLowerCase().includes(keyword))
}

const addDrug = (drug) => {
    if (!examForm.value.prescriptions.some(p => p.medicineId === drug.id)) {
        examForm.value.prescriptions.push({
            medicineId: drug.id,
            name: drug.name,
            dosage: '',
            usage: ''
        })
    }
    drugSearch.value = ''; suggestedDrugs.value = []
}

const removeDrug = (index) => examForm.value.prescriptions.splice(index, 1)

const isHistoryModalOpen = ref(false)
const patientHistory = ref([])

const openHistoryModal = () => {
    if (!currentPatient.value) return;
    patientHistory.value = [
        {
            date: '15/03/2026',
            doctor: 'Phạm Như Hải',
            specialty: 'Cơ Xương Khớp',
            diagnosis: 'Đau mỏi vai gáy do thoái hóa đốt sống cổ nhẹ',
            instructions: 'Tập vật lý trị liệu, hạn chế ngồi máy tính quá 2h liên tục.',
            prescriptions: [
                { name: 'Paracetamol 500mg', quantity: '10 viên', usage: 'Ngày 2 viên sáng/tối' },
                { name: 'Myonal 50mg', quantity: '10 viên', usage: 'Ngày 2 viên sáng/tối sau ăn' }
            ]
        }
    ]
    isHistoryModalOpen.value = true
}

const closeHistoryModal = () => {
    isHistoryModalOpen.value = false
}
</script>

<style scoped>
.exam-room {
    height: calc(100vh - 120px);
}

.exam-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 24px;
    height: 100%;
}

.card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.panel-header {
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header h2 {
    font-size: 16px;
    margin: 0;
}

.badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.badge-primary {
    background: #e0f7fa;
    color: #00838f;
}

.queue-panel {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.patient-list {
    overflow-y: auto;
    flex: 1;
    padding: 12px;
}

.patient-item {
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: 0.3s ease;
}

.patient-item.waiting {
    background: #fff;
}

.patient-item.examining {
    border-color: #45C3D2;
    background: #f0fbFC;
}

.patient-item.completed {
    background: #f9fafb;
    opacity: 0.6;
}

.patient-item.skipped {
    background: #fef2f2;
    opacity: 0.6;
    border-color: #fecaca;
}

.patient-item.active {
    border-left: 4px solid #45C3D2;
    opacity: 1;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.patient-info-basic {
    display: flex;
    gap: 12px;
}

.p-time {
    font-weight: 700;
    color: #374151;
    font-size: 14px;
    width: 45px;
}

.p-details strong {
    display: block;
    font-size: 15px;
    color: #111827;
}

.p-code {
    font-size: 12px;
    color: #00838f;
    background: #e0f7fa;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 4px;
    margin-right: 4px;
    font-weight: 600;
}

.p-details span {
    font-size: 13px;
    color: #6b7280;
}

.patient-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px dashed #e5e7eb;
    padding-top: 12px;
}

.status-text {
    font-size: 13px;
    font-weight: 600;
}

.text-blue {
    color: #0284c7;
}

.text-red {
    color: #dc2626;
}

.text-green {
    color: #16a34a;
}

.text-gray {
    color: #6b7280;
}

.exam-panel {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.exam-header {
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9fafb;
    flex-shrink: 0;
}

.exam-patient-profile {
    display: flex;
    align-items: center;
    gap: 16px;
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

.exam-patient-profile h2 {
    margin: 0 0 4px 0;
    font-size: 18px;
}

.exam-patient-profile p {
    margin: 0;
    color: #4b5563;
    font-size: 14px;
}

.exam-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 600;
    font-size: 14px;
    color: #374151;
}

.form-control {
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    outline: none;
}

.form-control:focus {
    border-color: #45C3D2;
    box-shadow: 0 0 0 3px rgba(69, 195, 210, 0.1);
}

.exam-footer {
    padding: 20px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    background: #fff;
    flex-shrink: 0;
    margin-top: auto;
}

.btn-primary,
.btn-outline,
.btn-outline-danger,
.btn-sm {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: 0.2s;
    width: fit-content;
    white-space: nowrap;
}

.btn-primary {
    background-color: #45C3D2;
    color: #fff;
    border: none;
    padding: 10px 20px;
}

.btn-primary:hover {
    background-color: #3ba3b0;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-outline {
    background-color: transparent;
    border: 1px solid #d1d5db;
    padding: 8px 16px;
    color: #374151;
}

.btn-outline:hover {
    background-color: #f3f4f6;
}

.btn-outline-danger {
    background-color: transparent;
    border: 1px solid #fecaca;
    padding: 10px 20px;
    color: #dc2626;
}

.btn-outline-danger:hover {
    background-color: #fee2e2;
}

.btn-outline-danger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-sm {
    padding: 6px 12px;
    font-size: 13px;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #45C3D2;
    border-color: #45C3D2;
}

svg {
    flex-shrink: 0;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    text-align: center;
}

.empty-state.fill-height {
    height: 100%;
}

.prescription-group {
    background: #f9fafb;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.prescription-search {
    position: relative;
}

.autocomplete-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    max-height: 250px;
    overflow-y: auto;
    z-index: 50;
    padding: 0;
    margin: 4px 0 0 0;
    list-style: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.autocomplete-list li {
    padding: 10px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.autocomplete-list li:hover {
    background: #f0fbFC;
    color: #00838f;
}

.drug-name-text {
    font-weight: 500;
    color: #111827;
}

.drug-func-text {
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.table-responsive {
    overflow-x: auto;
    margin-top: 16px;
    background: white;
    border-radius: 8px;
}

.prescription-table {
    width: 100%;
    border-collapse: collapse;
}

.prescription-table th,
.prescription-table td {
    padding: 12px;
    border: 1px solid #e5e7eb;
    font-size: 13px;
    vertical-align: middle;
}

.prescription-table th {
    background: #f3f4f6;
    font-weight: 600;
    text-align: left;
    color: #374151;
}

.drug-name-cell {
    font-weight: 600;
    color: #111827;
}

.btn-delete {
    color: #dc2626;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 4px;
}

.slide-up {
    animation: fadeInUp 0.4s ease forwards;
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
    align-items: center;
    background: #fff;
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
    line-height: 1;
}

.close-btn:hover {
    color: #111827;
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
}

.bg-gray-50 {
    background-color: #f9fafb;
}

.history-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.history-card-header {
    padding: 16px;
    background: #f0fbfc;
    display: flex;
    gap: 16px;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
}

.date-badge {
    background: #45C3D2;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    flex-shrink: 0;
}

.date-badge .day {
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
}

.date-badge .month {
    font-size: 11px;
    text-transform: uppercase;
    margin-top: 2px;
}

.history-meta h4 {
    margin: 0 0 4px 0;
    color: #111827;
    font-size: 15px;
}

.history-meta p {
    margin: 0;
    color: #6b7280;
    font-size: 13px;
}

.history-card-body {
    padding: 16px;
    font-size: 14px;
    color: #374151;
}

.info-block {
    margin-bottom: 8px;
}

.info-block strong {
    color: #111827;
}

.drug-list-simple {
    list-style: none;
    padding: 0;
    margin: 4px 0 0 0;
    color: #4b5563;
}

.drug-list-simple li {
    margin-bottom: 4px;
    padding-left: 8px;
}

.mt-2 {
    margin-top: 8px;
}

.mb-4 {
    margin-bottom: 16px;
}

.py-8 {
    padding-top: 32px;
    padding-bottom: 32px;
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