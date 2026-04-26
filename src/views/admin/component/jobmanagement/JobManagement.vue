<template>
    <div class="job-management-page slide-up">
        <div class="page-header">
            <div>
                <h1>Quản lý Job</h1>
                <p>Xem và kích hoạt các tác vụ nền</p>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
            <div class="spinner"></div>
            <p>Đang tải dữ liệu...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
            <p>{{ error }}</p>
            <button @click="fetchJobs" class="btn btn-primary">Thử lại</button>
        </div>

        <!-- Jobs Grid -->
        <div v-else class="jobs-grid">
            <div v-for="job in jobs" :key="job.id" class="job-card">
                <div class="job-header">
                    <div class="job-status-indicator" :class="job.isEnabled ? 'enabled' : 'disabled'"></div>
                    <h3 class="job-name">{{ job.jobName }}</h3>
                </div>

                <p class="job-description">{{ job.description || 'Không có mô tả' }}</p>

                <div class="job-details">
                    <div class="detail-item">
                        <span class="detail-label">Cron Expression:</span>
                        <span class="detail-value">{{ job.cronExpression }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Trạng thái:</span>
                        <span class="status-badge" :class="job.isEnabled ? 'badge-enabled' : 'badge-disabled'">
                            {{ job.isEnabled ? 'Đang bật' : 'Đã tắt' }}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Endpoint:</span>
                        <span class="detail-value endpoint-value">{{ job.endpoint || 'N/A' }}</span>
                    </div>
                </div>

                <div class="job-actions">
                    <button @click="triggerJob(job)" class="btn btn-primary">
                        Chạy ngay
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="jobs.length === 0" class="empty-state">
                <p>Chưa có job nào được cấu hình</p>
            </div>
        </div>

        <!-- Toast Notification -->
        <transition name="toast-slide">
            <div v-if="toast.show" :class="['toast', toast.type]" :key="toast.message">
                {{ toast.message }}
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useJobStore } from '@/stores/jobStore'
import { notifyError, notifySuccess } from '@/utils/notify'

const jobStore = useJobStore()

const jobs = ref([])
const isLoading = ref(false)
const error = ref(null)

const toast = ref({
    show: false,
    message: '',
    type: 'success'
})

const showToast = (message, type = 'success') => {
    toast.value = { show: true, message, type }
    setTimeout(() => {
        toast.value.show = false
    }, 3000)
}

const fetchJobs = async () => {
    isLoading.value = true
    error.value = null
    try {
        jobs.value = await jobStore.GetJobConfigs()
    } catch (err) {
        error.value = err.message || 'Không thể tải danh sách job'
        notifyError(error.value)
    } finally {
        isLoading.value = false
    }
}

const triggerJob = async (job) => {
    try {
        await jobStore.TriggerJob({ jobName: job.jobName })
        notifySuccess('Job đã được kích hoạt thành công')
    } catch (err) {
        notifyError(err.message || 'Không thể kích hoạt job')
    }
}

onMounted(() => {
    fetchJobs()
})
</script>

<style scoped>
.job-management-page {
    --primary-color: #45C3D2;
    --primary-light: rgba(69, 195, 210, 0.1);
    --bg-white: #ffffff;
    --text-dark: #111827;
    --text-gray: #6b7280;
    --border-color: #e5e7eb;
    --success-color: #10b981;
    --danger-color: #ef4444;
    --warning-color: #f59e0b;
}

.page-header {
    margin-bottom: 30px;
}

.page-header h1 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 8px 0;
}

.page-header p {
    color: var(--text-gray);
    margin: 0;
    font-size: 14px;
}

.loading-container,
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    background: var(--bg-white);
    border-radius: 12px;
    border: 1px solid var(--border-color);
}

.error-container {
    color: var(--danger-color);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.jobs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 24px;
}

.job-card {
    background: var(--bg-white);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 24px;
    transition: box-shadow 0.2s;
}

.job-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.job-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.job-status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.job-status-indicator.enabled {
    background: var(--success-color);
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.job-status-indicator.disabled {
    background: var(--text-gray);
}

.job-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0;
}

.job-description {
    color: var(--text-gray);
    font-size: 14px;
    margin: 0 0 16px 0;
    line-height: 1.5;
}

.job-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-gray);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.detail-value {
    font-size: 14px;
    color: var(--text-dark);
}

.endpoint-value {
    font-size: 12px;
    word-break: break-all;
    color: var(--text-gray);
}

.status-badge {
    display: inline-flex;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    width: fit-content;
}

.badge-enabled {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success-color);
}

.badge-disabled {
    background: rgba(107, 114, 128, 0.1);
    color: var(--text-gray);
}

.job-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: #3ab5c4;
}

.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    background: var(--bg-white);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    color: var(--text-gray);
}

/* Toast animations */
.toast-slide-enter-active {
    transition: all 0.3s ease;
}

.toast-slide-leave-active {
    transition: all 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.toast {
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
}

.toast.success {
    background: var(--success-color);
}

.toast.error {
    background: var(--danger-color);
}
</style>