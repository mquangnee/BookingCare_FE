<template>
    <div class="manage-page slide-up">
        <div class="page-header">
            <div>
                <h1>Quản lý Bác sĩ</h1>
                <p>Xem, thêm, sửa, xóa danh sách bác sĩ trên hệ thống</p>
            </div>
            <button class="btn-primary">
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
                    <select class="filter-select">
                        <option value="">Tất cả chuyên khoa</option>
                        <option value="1">Cơ xương khớp</option>
                        <option value="2">Tiêu hóa</option>
                    </select>
                    <select class="filter-select">
                        <option value="">Trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Đã khóa</option>
                    </select>
                </div>
                <div class="search-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" placeholder="Tìm theo tên, mã BS..." />
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
                            <th class="text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="doctor in doctors" :key="doctor.id">
                            <td>
                                <div class="user-cell">
                                    <img :src="doctor.avatar" :alt="doctor.name" class="avatar" />
                                    <div>
                                        <div class="user-name">{{ doctor.name }}</div>
                                        <div class="user-code">{{ doctor.code }}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{{ doctor.specialty }}</td>
                            <td>{{ doctor.position }}</td>
                            <td>
                                <span class="status-badge" :class="doctor.isActive ? 'st-active' : 'st-inactive'">
                                    {{ doctor.isActive ? 'Hoạt động' : 'Đã khóa' }}
                                </span>
                            </td>
                            <td class="text-right">
                                <button class="action-btn text-blue" title="Chỉnh sửa">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button class="action-btn text-red" title="Khóa/Xóa">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path
                                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                        </path>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="pagination">
                <span class="page-info">Hiển thị 1-4 trên 86 bác sĩ</span>
                <div class="page-controls">
                    <button class="page-btn disabled">Trước</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">Sau</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const doctors = ref([
    { id: 1, code: 'BS-001', name: 'Nguyễn Trọng Hưng', avatar: 'https://ui-avatars.com/api/?name=Hung&background=e0f2fe&color=0284c7', specialty: 'Cơ xương khớp', position: 'Phó Giáo sư', isActive: true },
    { id: 2, code: 'BS-002', name: 'Đỗ Thị Tường Vân', avatar: 'https://ui-avatars.com/api/?name=Van&background=fce7f3&color=be185d', specialty: 'Tiêu hóa', position: 'Thạc sĩ', isActive: true },
    { id: 3, code: 'BS-003', name: 'Lê Ngọc Thành', avatar: 'https://ui-avatars.com/api/?name=Thanh&background=dcfce7&color=16a34a', specialty: 'Tim mạch', position: 'Tiến sĩ', isActive: true },
    { id: 4, code: 'BS-004', name: 'Trần Thị Dung', avatar: 'https://ui-avatars.com/api/?name=Dung&background=fef9c3&color=ca8a04', specialty: 'Sản Phụ khoa', position: 'Bác sĩ', isActive: false },
])
</script>

<style scoped>
.manage-page {
    color: #111827;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.page-header h1 {
    font-size: 24px;
    margin: 0 0 5px 0;
}

.page-header p {
    color: #6b7280;
    margin: 0;
    font-size: 14.5px;
}

.btn-primary {
    background-color: #45C3D2;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;
}

.btn-primary svg {
    width: 18px;
    height: 18px;
}

.btn-primary:hover {
    background-color: #3ba3b0;
}

.card-container {
    background: #ffffff;
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
    color: #374151;
    outline: none;
    background: #fff;
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
    height: 16px;
    color: #9ca3af;
    margin-right: 8px;
}

.search-box input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 14px;
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
}

.user-name {
    font-weight: 600;
    color: #111827;
}

.user-code {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
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

.text-right {
    text-align: right;
}

.action-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: background 0.2s;
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
    color: #374151;
}

.page-btn:hover:not(.disabled):not(.active) {
    background: #f3f4f6;
}

.page-btn.active {
    background: #45C3D2;
    color: #fff;
    border-color: #45C3D2;
    font-weight: 600;
}

.page-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
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