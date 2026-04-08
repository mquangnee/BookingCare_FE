<template>
    <div class="manage-page slide-up">
        <div class="page-header">
            <div>
                <h1>Quản lý Bác sĩ</h1>
                <p>Xem, thêm, sửa, xóa danh sách bác sĩ trên hệ thống</p>
            </div>
            <button class="btn-primary" @click="openAddModal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Thêm bác sĩ mới
            </button>
        </div>

        <div class="card-container">
            <div class="table-toolbar">
                <div class="filter-group">
                    <select class="filter-select" v-model="filterSpecialty">
                        <option value="">Tất cả chuyên khoa</option>
                        <option v-for="specialty in allSpecialties" :key="specialty.id" :value="specialty.id">{{
                            specialty.name }}</option>
                    </select>
                    <select class="filter-select" v-model="filterStatus">
                        <option value="">Trạng thái</option>
                        <option value="0">Đang hoạt động</option>
                        <option value="1">Đã khóa</option>
                    </select>
                </div>
                <div class="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" v-model="searchQuery" placeholder="Tìm theo tên, mã BS..." />
                </div>
            </div>

            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Thông tin Bác sĩ</th>
                            <th>Chuyên khoa</th>
                            <th>Chức danh</th>
                            <th>Trạng thái</th>
                            <th class="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="doctor in paginatedDoctors" :key="doctor.id">
                            <td>
                                <div class="user-cell">
                                    <img :src="doctor.avatarUrl || defaultAvatar" :alt="doctor.fullName"
                                        class="avatar" />
                                    <div>
                                        <div class="user-name">{{ doctor.fullName }}</div>
                                        <div class="user-code">{{ doctor.doctorCode }}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{{ doctor.specialtyName }}</td>
                            <td>{{ getPositionName(doctor.position) }}</td>
                            <td>
                                <span class="status-badge" :class="doctor.status === 0 ? 'st-active' : 'st-inactive'">
                                    {{ doctor.status === 0 ? 'Hoạt động' : 'Đã khóa' }}
                                </span>
                            </td>
                            <td>
                                <div class="action-group">
                                    <button class="action-btn text-blue" title="Chỉnh sửa"
                                        @click="openEditModal(doctor)">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>

                                    <button class="action-btn" :class="doctor.status === 0 ? 'text-red' : 'text-green'"
                                        :title="doctor.status === 0 ? 'Khóa tài khoản' : 'Mở khóa tài khoản'"
                                        @click="openLockModal(doctor)">
                                        <svg v-if="doctor.status === 0" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="isLoading">
                            <td colspan="5" class="empty-table">Đang tải dữ liệu bác sĩ...</td>
                        </tr>
                        <tr v-else-if="paginatedDoctors.length === 0">
                            <td colspan="5" class="empty-table">Không tìm thấy bác sĩ nào phù hợp.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="pagination">
                <span class="page-info">
                    Hiển thị {{ displayRange }} trên {{ filteredDoctors.length }} bác sĩ
                </span>
                <div class="page-controls">
                    <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">Trước</button>
                    <button v-for="page in totalPages" :key="page" class="page-btn"
                        :class="{ active: currentPage === page }" @click="currentPage = page">
                        {{ page }}
                    </button>
                    <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">Sau</button>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div v-if="isEditModalOpen" class="modal-overlay" @click.self="closeEditModal">
                <div class="modal-content modal-lg slide-down">
                    <div class="modal-header">
                        <h2>Chỉnh sửa thông tin Bác sĩ</h2>
                        <button class="close-btn" @click="closeEditModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-grid">
                            <div class="form-section-title">Thông tin cơ bản (Chỉ xem)</div>
                            <div class="form-group">
                                <label>Họ và tên</label>
                                <input type="text" v-model="editForm.fullName" disabled class="input-disabled" />
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" v-model="editForm.email" disabled class="input-disabled" />
                            </div>
                            <div class="form-group">
                                <label>Số CCCD</label>
                                <input type="text" v-model="editForm.citizenId" disabled class="input-disabled" />
                            </div>
                            <div class="form-row-2">
                                <div class="form-group">
                                    <label>Giới tính</label>
                                    <input type="text" :value="editForm.gender === 0 ? 'Nam' : 'Nữ'" disabled
                                        class="input-disabled" />
                                </div>
                                <div class="form-group">
                                    <label>Ngày sinh</label>
                                    <input type="text" :value="formatDate(editForm.dateOfBirth)" disabled
                                        class="input-disabled" />
                                </div>
                            </div>

                            <div class="form-section-title mt-4">Thông tin chuyên môn</div>
                            <div class="form-row-2">
                                <div class="form-group">
                                    <label>Chuyên khoa</label>
                                    <select v-model="editForm.specialtyId" class="form-control">
                                        <option v-for="spec in allSpecialties" :key="spec.id" :value="spec.id">{{
                                            spec.name }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Chức danh</label>
                                    <select v-model="editForm.position" class="form-control">
                                        <option :value="0">Bác sĩ</option>
                                        <option :value="1">Thạc sĩ</option>
                                        <option :value="2">Tiến sĩ</option>
                                        <option :value="3">Phó Giáo sư</option>
                                        <option :value="4">Giáo sư</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row-2">
                                <div class="form-group">
                                    <label>Số điện thoại liên hệ</label>
                                    <input type="text" v-model="editForm.phoneNumber" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label>Số năm kinh nghiệm</label>
                                    <input type="number" v-model="editForm.experienceYears" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Mô tả ngắn</label>
                                <textarea v-model="editForm.description" class="form-control" rows="3"></textarea>
                            </div>

                            <div class="form-section-title mt-4">Lịch sử làm việc</div>
                            <div class="form-group">
                                <label>Lịch sử làm việc / Quá trình công tác</label>
                                <textarea v-model="editForm.workingHistory" class="form-control"
                                    placeholder="Nhập quá trình công tác (VD: Bệnh viện ABC 2018-2022, Bệnh viện XYZ 2022-nay)"
                                    rows="4"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel" @click="closeEditModal">Hủy</button>
                        <button class="btn-submit" @click="handleSaveEdit">Lưu thay đổi</button>
                    </div>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div v-if="isLockModalOpen" class="modal-overlay" @click.self="closeLockModal">
                <div class="modal-content modal-sm slide-down">
                    <div class="modal-header">
                        <h2 :class="selectedDoctor.status === 0 ? 'text-red' : 'text-green'">
                            {{ selectedDoctor.status === 0 ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa' }}
                        </h2>
                        <button class="close-btn" @click="closeLockModal">&times;</button>
                    </div>
                    <div class="modal-body text-center py-4">
                        <p>Bạn có chắc chắn muốn <strong>{{ selectedDoctor.status === 0 ? 'khóa' : 'mở khóa' }}</strong>
                            tài
                            khoản của bác sĩ <strong>{{ selectedDoctor.fullName }}</strong> không?</p>
                        <p v-if="selectedDoctor.status === 0" class="text-sm text-gray mt-2">Bác sĩ này sẽ không thể
                            đăng
                            nhập vào hệ thống nữa.</p>
                    </div>
                    <div class="modal-footer justify-center">
                        <button class="btn-cancel" @click="closeLockModal">Hủy</button>
                        <button class="btn-submit" :class="selectedDoctor.status === 0 ? 'bg-red' : 'bg-green'"
                            @click="handleConfirmLock">
                            {{ selectedDoctor.status === 0 ? 'Khóa tài khoản' : 'Mở khóa' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <Teleport to="body">
            <div v-if="isAddModalOpen" class="modal-overlay" @click.self="closeAddModal">
                <div class="modal-content modal-lg slide-down">
                    <div class="modal-header">
                        <h2>Thêm tài khoản Bác sĩ mới</h2>
                        <button class="close-btn" @click="closeAddModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-grid">
                            <div class="form-section-title">Thông tin tài khoản & Cá nhân</div>
                            <div class="avatar-upload-section">
                                <div class="avatar-edit-wrapper">
                                    <img :src="previewImage || defaultAvatar" class="avatar-big-preview" />
                                    <label for="doctor-avatar-input" class="edit-icon-overlay" title="Tải ảnh lên">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path
                                                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z">
                                            </path>
                                            <circle cx="12" cy="13" r="4"></circle>
                                        </svg>
                                    </label>
                                    <input type="file" id="doctor-avatar-input" ref="fileInputRef" @change="handleFileChange"
                                        accept="image/*" hidden />
                                </div>
                                <div class="upload-hint">Tải lên ảnh chân dung bác sĩ</div>
                            </div>
                            <div class="form-row-2">
                                <div class="form-group">
                                    <label>Họ và tên <span class="text-red">*</span></label>
                                    <input type="text" v-model="addForm.fullName" class="form-control"
                                        placeholder="Nguyễn Văn A" />
                                </div>
                                <div class="form-group">
                                    <label>Email <span class="text-red">*</span></label>
                                    <input type="email" v-model="addForm.email" class="form-control"
                                        placeholder="example@gmail.com" />
                                </div>
                            </div>
                            <div class="form-row-2">
                                <div class="form-group">
                                    <label>Mật khẩu mặc định</label>
                                    <input type="text" v-model="addForm.password" class="input-disabled" disabled />
                                    <small style="color: #6b7280; font-size: 11px; margin-top: 4px;">
                                        * Bác sĩ sẽ dùng mật khẩu này cho lần đăng nhập đầu tiên.
                                    </small>
                                </div>
                                <div class="form-group">
                                    <label>Số CCCD <span class="text-red">*</span></label>
                                    <input type="text" v-model="addForm.citizenId" class="form-control" />
                                </div>
                            </div>
                            <div class="form-row-2">
                                <div class="form-group">
                                    <label>Giới tính</label>
                                    <select v-model="addForm.gender" class="form-control">
                                        <option :value="0">Nam</option>
                                        <option :value="1">Nữ</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Ngày sinh</label>
                                    <input type="date" v-model="addForm.dateOfBirth" class="form-control" />
                                </div>
                            </div>

                            <div class="form-section-title mt-4">Thông tin chuyên môn</div>
                            <div class="form-row-2">
                                <div class="form-group">
                                    <label>Chuyên khoa</label>
                                    <select v-model="addForm.specialtyId" class="form-control">
                                        <option value="">Chọn chuyên khoa</option>
                                        <option v-for="spec in allSpecialties" :key="spec.id" :value="spec.id">
                                            {{ spec.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Chức danh</label>
                                    <select v-model="addForm.position" class="form-control">
                                        <option :value="0">Bác sĩ</option>
                                        <option :value="1">Thạc sĩ</option>
                                        <option :value="2">Tiến sĩ</option>
                                        <option :value="3">Phó Giáo sư</option>
                                        <option :value="4">Giáo sư</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row-2">
                                <div class="form-group">
                                    <label>Số điện thoại liên hệ</label>
                                    <input type="text" v-model="addForm.phoneNumber" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label>Số năm kinh nghiệm</label>
                                    <input type="number" v-model="addForm.experienceYears" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Lịch sử làm việc</label>
                                <textarea v-model="addForm.workingHistory" class="form-control" rows="3"
                                    placeholder="Quá trình công tác..."></textarea>
                            </div>
                            <div class="form-group">
                                <label>Mô tả ngắn</label>
                                <textarea v-model="addForm.description" class="form-control" rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel" @click="closeAddModal" :disabled="isSubmitting">Hủy</button>

                        <button class="btn-submit" @click="handleAddDoctor" :disabled="isSubmitting">
                            <template v-if="isSubmitting">
                                <span class="spinner"></span>
                                Đang xử lý...
                            </template>
                            <template v-else>
                                Tạo tài khoản
                            </template>
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { getPositionName } from '@/constants/enum'
import { useSpecialtyStore } from '@/stores/specialtyStore'
import { notifyError, notifySuccess, messageFromCaught } from '@/utils/notify'

const DEFAULT_PASSWORD = 'BookingCare123@';

const dashboardStore = useDashboardStore()
const specialtyStore = useSpecialtyStore()

const fileInputRef = ref(null);
const allDoctors = ref([])
const allSpecialties = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const filterSpecialty = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(8)
const defaultAvatar = 'https://ui-avatars.com/api/?name=BS&background=e5e7eb&color=6b7280'
const isSubmitting = ref(false);

const isEditModalOpen = ref(false)
const isLockModalOpen = ref(false)
const selectedDoctor = ref(null)
const editForm = ref({})
const isAddModalOpen = ref(false)
const addForm = ref({
    fullName: '',
    email: '',
    password: DEFAULT_PASSWORD,
    citizenId: '',
    gender: 0,
    dateOfBirth: '',
    specialtyId: '',
    position: 0,
    phoneNumber: '',
    experienceYears: 0,
    workingHistory: '',
    description: ''
})
const selectedFile = ref(null);
const previewImage = ref(null);

watch([searchQuery, filterSpecialty, filterStatus], () => {
    currentPage.value = 1
})

const filteredDoctors = computed(() => {
    return allDoctors.value.filter(doc => {
        const nameMatch = doc.fullName?.toLowerCase().includes(searchQuery.value.toLowerCase()) || false
        const codeMatch = doc.doctorCode?.toLowerCase().includes(searchQuery.value.toLowerCase()) || false
        const specialtyMatch = !filterSpecialty.value || doc.specialtyId === filterSpecialty.value
        const statusMatch = filterStatus.value === '' || doc.status === Number(filterStatus.value)
        return (nameMatch || codeMatch) && specialtyMatch && statusMatch
    })
})

const openAddModal = () => {
    addForm.value = {
        fullName: '',
        email: '',
        password: DEFAULT_PASSWORD,
        citizenId: '',
        gender: 0,
        dateOfBirth: '',
        specialtyId: '',
        position: 0,
        phoneNumber: '',
        experienceYears: 0,
        workingHistory: '',
        description: ''
    };
    
    selectedFile.value = null;
    previewImage.value = null;
    
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
    
    isAddModalOpen.value = true;
}

const closeAddModal = () => {
    isAddModalOpen.value = false
}

const totalPages = computed(() => Math.ceil(filteredDoctors.value.length / pageSize.value) || 1)
const paginatedDoctors = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredDoctors.value.slice(start, end)
})

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        previewImage.value = URL.createObjectURL(file);
    }
};

const displayRange = computed(() => {
    const total = filteredDoctors.value.length
    if (total === 0) return '0'
    const start = (currentPage.value - 1) * pageSize.value + 1
    const end = Math.min(currentPage.value * pageSize.value, total)
    return `${start}-${end}`
})

onMounted(async () => {
    try {
        isLoading.value = true
        const [doctorsRes, specialtiesRes] = await Promise.all([
            dashboardStore.GetTotalDoctors(),
            specialtyStore.getSpecialties()
        ])

        if (doctorsRes && doctorsRes.data) allDoctors.value = doctorsRes.data
        if (specialtiesRes) allSpecialties.value = specialtiesRes.data || specialtiesRes
    } catch (error) {
        console.error(error);
        notifyError(messageFromCaught(error));
    } finally {
        isLoading.value = false
    }
})

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
}

const openEditModal = (doctor) => {
    editForm.value = JSON.parse(JSON.stringify(doctor))
    isEditModalOpen.value = true
}

const closeEditModal = () => {
    isEditModalOpen.value = false
    editForm.value = {}
}

const handleSaveEdit = async () => {
    try {
        const payload = {
            doctorId: editForm.value.id,
            specialtyId: editForm.value.specialtyId,
            phoneNumber: editForm.value.phoneNumber,
            experienceYears: editForm.value.experienceYears,
            description: editForm.value.description,
            workingHistory: editForm.value.workingHistory
        }
        await dashboardStore.UpdateDoctorInfor(payload)
        const index = allDoctors.value.findIndex(d => d.id === editForm.value.id)
        if (index !== -1) {
            allDoctors.value[index] = { ...editForm.value }
            const spec = allSpecialties.value.find(s => s.id === editForm.value.specialtyId)
            allDoctors.value[index].specialtyName = spec ? spec.name : allDoctors.value[index].specialtyName
        }

        notifySuccess('Cập nhật thông tin thành công!');
        closeEditModal();
    } catch (error) {
        notifyError(messageFromCaught(error));
    }
}

const handleAddDoctor = async () => {
    try {
        if (!addForm.value.email || !addForm.value.fullName || !selectedFile.value) {
            notifyError("Vui lòng điền đầy đủ thông tin bắt buộc và chọn ảnh đại diện");
            return;
        }
        isSubmitting.value = true;

        const formData = new FormData();
        formData.append('Avatar', selectedFile.value);

        Object.keys(addForm.value).forEach(key => {
            let value = addForm.value[key];
            if (key === 'dateOfBirth' && value) {
                value = new Date(value).toISOString();
            }
            formData.append(key, value !== null ? value : '');
        });
        await dashboardStore.CreateDoctorAccount(formData);

        notifySuccess('Tạo tài khoản bác sĩ thành công!');
        closeAddModal();

        const response = await dashboardStore.GetTotalDoctors();
        if (response && response.data) {
            allDoctors.value = response.data;
        }
    } catch (error) {
        notifyError(messageFromCaught(error));
    } finally {
        isSubmitting.value = false;
    }
};

const openLockModal = (doctor) => {
    selectedDoctor.value = doctor
    isLockModalOpen.value = true
}

const closeLockModal = () => {
    isLockModalOpen.value = false
    selectedDoctor.value = null
}

const handleConfirmLock = async () => {
    try {
        const newStatus = selectedDoctor.value.status === 0 ? 1 : 0
        const payload = {
            userId: selectedDoctor.value.userId,
            newStatus: newStatus
        }
        await dashboardStore.UpdateAccountStatus(payload)
        const index = allDoctors.value.findIndex(d => d.id === selectedDoctor.value.id)
        if (index !== -1) {
            allDoctors.value[index].status = newStatus
        }
        notifySuccess(newStatus === 1 ? 'Đã khóa tài khoản!' : 'Đã mở khóa tài khoản!');
        closeLockModal();
    } catch (error) {
        notifyError(messageFromCaught(error));
    }
}
</script>

<style scoped>
.manage-page {
    color: #111827;
    font-family: 'Inter', sans-serif;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
}

.page-header h1 {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
}

.page-header p {
    color: #6b7280;
    font-size: 14px;
    margin-top: 4px;
}

.btn-primary {
    background-color: #45C3D2;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.2s;
    white-space: nowrap;
    width: fit-content;
    font-family: 'Inter', sans-serif;
}

.btn-primary:hover {
    background-color: #3ba3b0;
}

.btn-primary svg {
    width: 18px;
    height: 18px;
}

.card-container {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
}

.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
}

.filter-group {
    display: flex;
    gap: 12px;
}

.filter-select {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    background: #fff;
    outline: none;
    font-family: 'Inter', sans-serif;
}

.search-box {
    display: flex;
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 6px 12px;
    width: 280px;
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
    font-family: 'Inter', sans-serif;
}

.table-responsive {
    overflow-x: auto;
    margin-bottom: 20px;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
    white-space: nowrap;
}

.admin-table th {
    text-align: left;
    padding: 12px 16px;
    color: #6b7280;
    font-size: 13px;
    font-weight: 600;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.text-center {
    text-align: center !important;
}

.admin-table td {
    padding: 16px;
    font-size: 14px;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: middle;
}

.user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-cell .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.user-name {
    font-weight: 600;
    color: #111827;
}

.user-code {
    font-size: 12px;
    color: #6b7280;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.st-active {
    background: #dcfce7;
    color: #16a34a;
}

.st-inactive {
    background: #f3f4f6;
    color: #4b5563;
}

.action-group {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
}

.action-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.action-btn:hover {
    background: #f3f4f6;
}

.action-btn svg {
    width: 18px;
    height: 18px;
}

.text-blue {
    color: #0284c7;
}

.text-blue:hover {
    background: #e0f2fe;
}

.text-red {
    color: #dc2626;
}

.text-red:hover {
    background: #fee2e2;
}

.text-green {
    color: #16a34a;
}

.text-green:hover {
    background: #dcfce7;
}

.text-gray {
    color: #6b7280;
}

.bg-red {
    background-color: #dc2626 !important;
    color: white !important;
    border: none !important;
}

.bg-red:hover {
    background-color: #b91c1c !important;
}

.bg-green {
    background-color: #16a34a !important;
    color: white !important;
    border: none !important;
}

.bg-green:hover {
    background-color: #15803d !important;
}

.pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e5e7eb;
    padding-top: 20px;
}

.page-info {
    font-size: 14px;
    color: #6b7280;
}

.page-controls {
    display: flex;
    gap: 6px;
}

.page-btn {
    border: 1px solid #d1d5db;
    background: #fff;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
}

.page-btn.active {
    background: #45C3D2;
    color: #fff;
    border-color: #45C3D2;
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.empty-table {
    text-align: center;
    padding: 40px;
    color: #9ca3af;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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

.modal-sm {
    width: 450px;
    max-width: 95%;
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
    line-height: 1;
}

.close-btn:hover {
    color: #111827;
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
}

.py-4 {
    padding-top: 30px;
    padding-bottom: 30px;
}

.mt-4 {
    margin-top: 24px;
}

.mt-2 {
    margin-top: 8px;
}

.text-sm {
    font-size: 13px;
}

.form-section-title {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #e5e7eb;
}

.avatar-upload-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* margin-top: 20px; */
    grid-column: span 2;
}

.avatar-edit-wrapper {
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    padding: 4px;
    border: 2px solid #d1d5db;
    transition: all 0.3s ease;
}

.avatar-edit-wrapper:hover {
    border-color: #45C3D2;
}

.avatar-big-preview {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background: #f3f4f6;
}

.edit-icon-overlay {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 34px;
    height: 34px;
    background: #45C3D2;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease, background 0.2s ease;
}

.edit-icon-overlay:hover {
    transform: scale(1.1);
    background: #3ba3b0;
}

.edit-icon-overlay svg {
    width: 18px;
    height: 18px;
}

.upload-hint {
    margin-top: 10px;
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 13px;
    font-weight: 500;
    color: #4b5563;
}

.form-control,
.input-disabled {
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border 0.2s;
    font-family: 'Inter', sans-serif;
}

.form-control:focus {
    border-color: #45C3D2;
    box-shadow: 0 0 0 3px rgba(69, 195, 210, 0.1);
}

.input-disabled {
    background-color: #f3f4f6;
    color: #6b7280;
    cursor: not-allowed;
}

.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    background: #f9fafb;
}

.justify-center {
    justify-content: center;
}

.btn-cancel,
.btn-submit {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
    font-family: 'Inter', sans-serif;
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

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 0.8s linear infinite;
    display: inline-block;
    margin-right: 8px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.btn-submit:disabled, .btn-cancel:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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