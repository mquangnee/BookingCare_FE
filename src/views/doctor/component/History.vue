<template>
    <div class="history-page slide-up">
        <div class="card history-layout">
            <div class="panel-header">
                <h2>Tra cứu Lịch sử Khám bệnh</h2>
            </div>

            <div class="filter-toolbar">
                <div class="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" v-model="searchQuery" placeholder="Nhập tên bệnh nhân hoặc mã BN..." />
                </div>
                <div class="filter-group">
                    <input type="date" class="form-control" title="Từ ngày" />
                    <input type="date" class="form-control" title="Đến ngày" />
                    <button class="btn-primary">Lọc kết quả</button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Mã BN</th>
                            <th>Tên bệnh nhân</th>
                            <th>Ngày khám</th>
                            <th>Chẩn đoán</th>
                            <th>Chuyên khoa</th>
                            <th class="text-center" style="width: 120px">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="record in records" :key="record.id">
                            <td class="text-gray">{{ record.patientId }}</td>
                            <td class="font-semibold">{{ record.patientName }}</td>
                            <td>{{ record.date }}</td>
                            <td>{{ record.diagnosis }}</td>
                            <td>{{ record.specialty }}</td>
                            <td class="text-center">
                                <button class="btn-sm btn-outline-primary" @click="openDetailModal(record)">
                                    Xem chi tiết
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Teleport to="body">
            <div v-if="isDetailModalOpen" class="modal-overlay" @click.self="closeDetailModal">
                <div class="modal-content modal-lg slide-down">
                    <div class="modal-header bg-primary-light">
                        <div>
                            <h2 class="text-primary-dark">Chi tiết Bệnh án</h2>
                            <p class="mb-0 text-sm mt-1">Ngày khám: {{ selectedRecord?.date }} | BS. {{
                                selectedRecord?.doctorName || 'Phạm Như Hải' }}</p>
                        </div>
                        <button class="close-btn" @click="closeDetailModal">&times;</button>
                    </div>

                    <div class="modal-body">
                        <div class="patient-summary-card">
                            <div class="avatar-circle">{{ selectedRecord?.patientName.charAt(0) }}</div>
                            <div class="ps-info">
                                <h3>{{ selectedRecord?.patientName }}</h3>
                                <p>Mã BN: {{ selectedRecord?.patientId }} | Giới tính: {{ selectedRecord?.gender ||
                                    'Nam' }}</p>
                            </div>
                        </div>

                        <div class="detail-section mt-4">
                            <h4 class="section-title">1. Chẩn đoán lâm sàng</h4>
                            <div class="info-box">
                                {{ selectedRecord?.diagnosis }}
                            </div>
                        </div>

                        <div class="detail-section mt-4">
                            <h4 class="section-title">2. Lời khuyên & Chỉ định</h4>
                            <div class="info-box bg-yellow-50 text-yellow-900">
                                {{ selectedRecord?.instructions || 'Không có chỉ định đặc biệt. Theo dõi thêm tại nhà.'
                                }}
                            </div>
                        </div>

                        <div class="detail-section mt-4">
                            <h4 class="section-title">3. Đơn thuốc (Kê toa)</h4>
                            <div v-if="selectedRecord?.prescriptions?.length > 0" class="prescription-wrapper">
                                <table class="prescription-table">
                                    <thead>
                                        <tr>
                                            <th>Tên thuốc</th>
                                            <th style="width: 100px; text-align: center;">Số lượng</th>
                                            <th>Cách dùng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(drug, idx) in selectedRecord.prescriptions" :key="idx">
                                            <td class="font-medium">{{ drug.name }}</td>
                                            <td class="text-center">{{ drug.quantity }}</td>
                                            <td class="text-gray">{{ drug.usage }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="info-box text-gray text-center italic">
                                Không có kê đơn thuốc.
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer justify-end">
                        <button class="btn-cancel" @click="closeDetailModal">Đóng</button>
                        <button class="btn-primary" @click="printPrescription">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                class="w-4 h-4 mr-2 inline">
                                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2">
                                </path>
                                <rect x="6" y="14" width="12" height="8"></rect>
                            </svg>
                            In Đơn thuốc
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const isDetailModalOpen = ref(false)
const selectedRecord = ref(null)

const records = ref([
    {
        id: 1,
        patientId: 'BN-10023',
        patientName: 'Nguyễn Văn Anh',
        gender: 'Nam',
        date: '05/04/2026',
        diagnosis: 'Đau dạ dày cấp',
        specialty: 'Tiêu hóa',
        doctorName: 'Trần B',
        instructions: 'Tránh ăn đồ chua cay, thức khuya. Ăn uống đúng giờ.',
        prescriptions: [
            { name: 'Omeprazole 20mg', quantity: '14 viên', usage: 'Ngày 1 viên trước ăn sáng 30p' },
            { name: 'Phosphalugel 20% 20g', quantity: '14 gói', usage: 'Ngày 2 gói sau ăn trưa/tối 1h' }
        ]
    },
    {
        id: 2,
        patientId: 'BN-10045',
        patientName: 'Trần Thị Bé',
        gender: 'Nữ',
        date: '08/04/2026',
        diagnosis: 'Viêm khớp dạng thấp',
        specialty: 'Cơ Xương Khớp',
        doctorName: 'Phạm Như Hải',
        instructions: 'Hạn chế vận động mạnh. Chườm ấm vùng khớp đau mỗi tối 15 phút.',
        prescriptions: [
            { name: 'Ibuprofen 400mg', quantity: '20 viên', usage: 'Ngày 2 viên sáng/tối sau ăn no' },
            { name: 'Glucosamine Sulfate 1500mg', quantity: '30 viên', usage: 'Ngày 1 viên sau ăn sáng' }
        ]
    },
])

const openDetailModal = (record) => {
    selectedRecord.value = record
    isDetailModalOpen.value = true
}

const closeDetailModal = () => {
    isDetailModalOpen.value = false
    selectedRecord.value = null
}

const printPrescription = () => {
    alert("Chức năng in đơn thuốc đang được phát triển.");
}
</script>

<style scoped>
/* Base Styles for History List */
.history-page {
    height: calc(100vh - 120px);
}

.card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.panel-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
}

.panel-header h2 {
    font-size: 18px;
    margin: 0;
    color: #111827;
}

.filter-toolbar {
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
}

.search-box {
    display: flex;
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 8px 12px;
    width: 320px;
    background: white;
}

.search-box svg {
    width: 16px;
    color: #9ca3af;
    margin-right: 8px;
}

.search-box input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 14px;
    font-family: inherit;
}

.filter-group {
    display: flex;
    gap: 12px;
}

.form-control {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    outline: none;
}

.btn-primary {
    background: #45C3D2;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    display: inline-flex;
    align-items: center;
}

.btn-primary:hover {
    background: #3ba3b0;
}

.table-responsive {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
}

.history-table {
    width: 100%;
    border-collapse: collapse;
}

.history-table th,
.history-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 14px;
    text-align: left;
    vertical-align: middle;
}

.history-table th {
    background: #f3f4f6;
    color: #374151;
    font-weight: 600;
    position: sticky;
    top: 0;
}

.text-gray {
    color: #6b7280;
}

.font-semibold {
    font-weight: 600;
    color: #111827;
}

.text-center {
    text-align: center !important;
}

/* CSS Mới cho Nút Xem chi tiết */
.btn-sm {
    padding: 6px 12px;
    font-size: 13px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.2s;
    font-family: inherit;
}

.btn-outline-primary {
    border: 1px solid #45C3D2;
    color: #45C3D2;
    background: transparent;
}

.btn-outline-primary:hover {
    background: #e0f7fa;
    color: #00838f;
    border-color: #00838f;
}

/* CSS CHO MODAL CHI TIẾT BỆNH ÁN */
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
    color: #00838f;
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
}

.prescription-table th {
    background: #f9fafb;
    text-align: left;
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

.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 12px;
    background: #fff;
}

.justify-end {
    justify-content: flex-end;
}

.btn-cancel {
    background: #fff;
    border: 1px solid #d1d5db;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    color: #374151;
    font-family: inherit;
}

.btn-cancel:hover {
    background: #f3f4f6;
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

.w-4 {
    width: 16px;
}

.h-4 {
    height: 16px;
}

.mr-2 {
    margin-right: 8px;
}

.inline {
    display: inline;
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