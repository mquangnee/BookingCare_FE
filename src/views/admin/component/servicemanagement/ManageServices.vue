<template>
    <div class="manage-services-container">
        <div class="header-actions">
            <div>
                <h2>Quản lý Dịch vụ Khám</h2>
                <p class="subtitle">Danh sách các dịch vụ khám bệnh và bác sĩ phụ trách</p>
            </div>
            <button class="btn btn-primary" @click="openAddServiceModal">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Thêm dịch vụ mới
            </button>
        </div>

        <div class="table-responsive">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Mã DV</th>
                        <th>Tên Dịch Vụ</th>
                        <th>Giá (VNĐ)</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th class="text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="service in services" :key="service.id">
                        <td><span class="code-badge">{{ service.serviceCode }}</span></td>
                        <td class="font-medium">{{ service.name }}</td>
                        <td class="price-cell">{{ formatCurrency(service.price) }}</td>
                        <td>{{ service.durationInMinutes }} phút</td>
                        <td>
                            <span :class="['status-badge', service.isActive ? 'active' : 'inactive']">
                                <span class="dot"></span>
                                {{ service.isActive ? 'Hoạt động' : 'Tạm ngưng' }}
                            </span>
                        </td>
                        <td class="action-buttons text-center">
                            <div class="flex-center gap-2">
                                <button class="btn-icon icon-info" @click="viewDoctors(service)"
                                    title="Xem Bác sĩ phụ trách">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </button>

                                <button class="btn-icon icon-warning" @click="openEditModal(service)"
                                    title="Chỉnh sửa dịch vụ">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>

                                <button v-if="service.isActive" class="btn-icon icon-danger"
                                    @click="toggleStatus(service)" title="Khóa dịch vụ">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </button>
                                <button v-else class="btn-icon icon-success" @click="toggleStatus(service)"
                                    title="Mở khóa dịch vụ">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="services.length === 0">
                        <td colspan="6" class="empty-state-row">
                            <div class="empty-state-content">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                </svg>
                                <p>Không có dữ liệu dịch vụ.</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <transition name="modal-fade">
            <div v-if="isDoctorModalOpen" class="modal-overlay" @click.self="closeDoctorModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <div>
                            <h3>Danh sách Bác sĩ phụ trách</h3>
                            <p class="service-name-subtitle">{{ selectedService?.name }}</p>
                        </div>
                        <button class="close-btn" @click="closeDoctorModal">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div v-if="isLoadingDoctors" class="loading-state">
                            <div class="spinner"></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>

                        <div v-else>
                            <div v-if="serviceDoctors.length > 0" class="doctor-list">
                                <div v-for="doctor in serviceDoctors" :key="doctor.id" class="doctor-card">
                                    <div class="avatar-wrapper">
                                        <img :src="doctor.avatarUrl" :alt="doctor.fullName" class="doctor-avatar" />
                                    </div>
                                    <div class="doctor-info flex-1">
                                        <h4>{{ doctor.fullName }}</h4>
                                        <div class="doctor-meta">
                                            <span class="meta-item">Mã: {{ doctor.doctorCode }}</span>
                                        </div>
                                        <p class="working-history">{{ doctor.workingHistory }}</p>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="empty-state-modal">
                                <p>Chưa có bác sĩ nào được phân công cho dịch vụ này.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="modal-fade">
            <div v-if="isAddModalOpen" class="modal-overlay" @click.self="closeAddModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Thêm Dịch Vụ Mới</h3>
                        <button class="close-btn" @click="closeAddModal">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="modal-body form-wrapper">
                        <form @submit.prevent="submitAddService">
                            <div class="form-group">
                                <label>Tên dịch vụ <span class="required">*</span></label>
                                <input type="text" class="form-control" v-model="addFormData.name" required
                                    placeholder="Nhập tên dịch vụ" />
                            </div>
                            <div class="form-group">
                                <label>Chuyên khoa <span class="required">*</span></label>
                                <select class="form-control" v-model="addFormData.specialtyId" required>
                                    <option value="" disabled>Chọn chuyên khoa</option>
                                    <option v-for="specialty in specialties" :key="specialty.id" :value="specialty.id">
                                        {{ specialty.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-row">
                                <div class="form-group flex-1">
                                    <label>Giá (VNĐ) <span class="required">*</span></label>
                                    <input type="number" class="form-control" v-model="addFormData.price" required
                                        min="0" />
                                </div>
                                <div class="form-group flex-1">
                                    <label>Thời gian (phút) <span class="required">*</span></label>
                                    <input type="number" class="form-control" v-model="addFormData.durationInMinutes"
                                        required min="1" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Mô tả dịch vụ</label>
                                <textarea class="form-control" rows="3" v-model="addFormData.description"
                                    placeholder="Nhập mô tả chi tiết..."></textarea>
                            </div>

                            <div class="form-actions">
                                <button type="button" class="btn btn-outline" @click="closeAddModal">Hủy</button>
                                <button type="submit" class="btn btn-primary">Thêm dịch vụ</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="modal-fade">
            <div v-if="isEditModalOpen" class="modal-overlay" @click.self="closeEditModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Sửa Thông Tin Dịch Vụ</h3>
                        <button class="close-btn" @click="closeEditModal">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="modal-body form-wrapper">
                        <form @submit.prevent="submitEditService">
                            <div class="form-group">
                                <label>Tên dịch vụ <span class="required">*</span></label>
                                <input type="text" class="form-control" v-model="editFormData.name" required />
                            </div>
                            <div class="form-group">
                                <label>Chuyên khoa <span class="required">*</span></label>
                                <select class="form-control" v-model="editFormData.specialtyId" required>
                                    <option value="" disabled>Chọn chuyên khoa</option>
                                    <option v-for="specialty in specialties" :key="specialty.id" :value="specialty.id">
                                        {{ specialty.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-row">
                                <div class="form-group flex-1">
                                    <label>Giá (VNĐ) <span class="required">*</span></label>
                                    <input type="number" class="form-control" v-model="editFormData.price" required
                                        min="0" />
                                </div>
                                <div class="form-group flex-1">
                                    <label>Thời gian (phút) <span class="required">*</span></label>
                                    <input type="number" class="form-control" v-model="editFormData.durationInMinutes"
                                        required min="1" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Mô tả dịch vụ</label>
                                <textarea class="form-control" rows="3" v-model="editFormData.description"></textarea>
                            </div>

                            <div class="form-actions">
                                <button type="button" class="btn btn-outline" @click="closeEditModal">Hủy</button>
                                <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </transition>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useServiceStore } from '../../../../stores/serviceStore'
import { useDoctorStore } from '../../../../stores/doctorStore'
import { useSpecialtyStore } from '../../../../stores/specialtyStore'
import { notifySuccess, notifyError, messageFromCaught } from '../../../../utils/notify';

const serviceStore = useServiceStore();
const doctorStore = useDoctorStore();
const specialtyStore = useSpecialtyStore();

const services = ref<any[]>([]);
const specialties = ref<any[]>([]);

const isDoctorModalOpen = ref(false);
const isLoadingDoctors = ref(false);
const selectedService = ref<any>(null);
const serviceDoctors = ref<any[]>([]);

const isAddModalOpen = ref(false);
const addFormData = ref<any>({
    name: '',
    price: 0,
    durationInMinutes: 30,
    description: '',
    isActive: true,
    specialtyId: ''
});

const isEditModalOpen = ref(false);
const editFormData = ref<any>({});

const fetchServices = async () => {
    try {
        const response = await serviceStore.getServicesAdmin();
        if (Array.isArray(response)) {
            services.value = response.map((service: any) => ({ ...service }));
        }
    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    }
};

const fetchSpecialties = async () => {
    try {
        const response = await specialtyStore.getSpecialties();
        if (Array.isArray(response)) {
            specialties.value = response;
        }
    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    }
};

const toggleStatus = async (service: any) => {
    service.isActive = !service.isActive;
    try {
        await serviceStore.changeServiceStatus(service.id);
        notifySuccess(`Đã ${service.isActive ? 'mở khóa' : 'khóa'} dịch vụ ${service.name}`);
    } catch (error) {
        service.isActive = !service.isActive;
        console.error(error);
        notifyError(messageFromCaught(error));
    }
};

const viewDoctors = async (service: any) => {
    selectedService.value = service;
    isDoctorModalOpen.value = true;
    isLoadingDoctors.value = true;
    serviceDoctors.value = [];

    try {
        const response = await doctorStore.getDoctorsByService(service.id);
        const rawDoctors = response.doctors

        if (Array.isArray(rawDoctors)) {
            serviceDoctors.value = rawDoctors.map((doctor: any) => ({
                ...doctor,
                avatarUrl: doctor.avatarUrl || 'https://via.placeholder.com/80?text=No+Image'
            }));
        }
    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    } finally {
        isLoadingDoctors.value = false;
    }
};

const closeDoctorModal = () => {
    isDoctorModalOpen.value = false;
    setTimeout(() => { serviceDoctors.value = []; }, 200);
};

const openAddServiceModal = () => {
    addFormData.value = { name: '', price: 0, durationInMinutes: 30, description: '', isActive: true, specialtyId: '' };
    isAddModalOpen.value = true;
};

const closeAddModal = () => {
    isAddModalOpen.value = false;
};

const submitAddService = async () => {
    try {
        const payload = {
            name: addFormData.value.name,
            price: addFormData.value.price,
            durationInMinutes: addFormData.value.durationInMinutes,
            description: addFormData.value.description,
            isActive: addFormData.value.isActive,
            specialtyId: addFormData.value.specialtyId
        }
        await serviceStore.createService(payload);
        notifySuccess('Thêm dịch vụ mới thành công!');

        closeAddModal();
        fetchServices();
    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    }
}

const openEditModal = (service: any) => {
    editFormData.value = JSON.parse(JSON.stringify(service));
    isEditModalOpen.value = true;
};

const closeEditModal = () => {
    isEditModalOpen.value = false;
    editFormData.value = {};
};

const submitEditService = async () => {
    try {
        const payload = {
            id: editFormData.value.id,
            specialtyId: editFormData.value.specialtyId,
            name: editFormData.value.name,
            price: editFormData.value.price,
            description: editFormData.value.description,
            durationInMinutes: editFormData.value.durationInMinutes
        };
        await serviceStore.updateService(payload);

        const index = services.value.findIndex(s => s.id === editFormData.value.id);
        if (index !== -1) {
            services.value[index] = { ...editFormData.value };
        }

        notifySuccess('Chỉnh sửa thông tin dịch vụ thành công!');
        closeEditModal();
    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    }
};

const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

onMounted(() => {
    fetchServices();
    fetchSpecialties();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.manage-services-container {
    font-family: 'Inter', sans-serif;
    padding: 24px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    color: #111827;
}

.flex-center {
    display: flex;
    align-items: center;
}

.gap-2 {
    gap: 8px;
}

.flex-1 {
    flex: 1;
}

.required {
    color: #ef4444;
    margin-left: 2px;
}

.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f3f4f6;
}

h2 {
    margin: 0 0 4px 0;
    font-size: 1.25rem;
    font-weight: 700;
}

.subtitle {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: #45c3d2;
    color: white;
    width: max-content;
}

.btn-primary:hover {
    background-color: #38a5b2;
}

.btn-outline {
    background: transparent;
    border: 1px solid #d1d5db;
    color: #374151;
}

.btn-outline:hover {
    background: #f3f4f6;
}

.btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    color: #6b7280;
}

.btn-icon svg {
    width: 18px;
    height: 18px;
}

.btn-icon.icon-info:hover {
    color: #45c3d2;
    background: rgba(69, 195, 210, 0.1);
}

.btn-icon.icon-warning:hover {
    color: #d97706;
    background: #fef3c7;
}

.btn-icon.icon-danger:hover {
    color: #ef4444;
    background: #fee2e2;
}

.btn-icon.icon-success:hover {
    color: #10b981;
    background: #d1fae5;
}

.table-responsive {
    overflow-x: auto;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
}

.admin-table th {
    background-color: #f9fafb;
    color: #6b7280;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
}

.admin-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 0.875rem;
    vertical-align: middle;
}

.admin-table tbody tr:hover {
    background-color: #f9fafb;
}

.text-center {
    text-align: center;
}

.code-badge {
    background-color: #f3f4f6;
    padding: 4px 8px;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.75rem;
}

.font-medium {
    font-weight: 500;
}

.price-cell {
    font-weight: 600;
    color: #ef4444;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.status-badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
}

.status-badge.active {
    background-color: #def7ec;
    color: #03543f;
}

.status-badge.active .dot {
    background-color: #057a55;
}

.status-badge.inactive {
    background-color: #fde8e8;
    color: #9b1c1c;
}

.status-badge.inactive .dot {
    background-color: #c81e1e;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(17, 24, 39, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #ffffff;
    width: 600px;
    max-width: 90%;
    max-height: 85vh;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
}

.service-name-subtitle {
    margin: 4px 0 0 0;
    color: #45c3d2;
    font-size: 0.875rem;
    font-weight: 500;
}

.close-btn {
    background: #f3f4f6;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #6b7280;
}

.close-btn:hover {
    background: #e5e7eb;
    color: #111827;
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
}

.doctor-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.doctor-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
}

.doctor-avatar {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    object-fit: cover;
}

.doctor-info h4 {
    margin: 0 0 4px 0;
    font-size: 0.95rem;
    font-weight: 600;
}

.doctor-meta .meta-item {
    font-size: 0.8125rem;
    color: #6b7280;
}

.working-history {
    margin: 4px 0 0 0;
    font-size: 0.8125rem;
    color: #6b7280;
}

.form-wrapper {
    padding: 24px;
}

.form-group {
    margin-bottom: 16px;
}

.form-row {
    display: flex;
    gap: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
}

.form-control {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    transition: border-color 0.2s;
    outline: none;
    box-sizing: border-box;
}

.form-control:focus {
    border-color: #45c3d2;
    box-shadow: 0 0 0 3px rgba(69, 195, 210, 0.1);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}

.loading-state,
.empty-state-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
    color: #6b7280;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f4f6;
    border-top-color: #45c3d2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>