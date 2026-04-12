<template>
    <aside class="doctor-panel card">
        <div class="panel-header">
            <h2>Danh sách Bác sĩ</h2>
        </div>

        <div v-if="isLoading" class="loading-state flex-center">
            <p class="text-gray">Đang tải danh sách bác sĩ...</p>
        </div>

        <div v-else class="doctor-list">
            <div class="shift-group">
                <h3 class="shift-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    Ca Sáng
                </h3>
                <div v-if="morningDoctorWorkSessions.length === 0" class="empty-shift text-sm text-gray">Không có bác sĩ ca sáng
                </div>
                <div v-for="workSession in morningDoctorWorkSessions" :key="workSession.id" class="doctor-card"
                    :class="{ active: selectedWorkSessionId === workSession.id }" @click="$emit('select', workSession)">
                    <img :src="workSession.avatarUrl" class="doc-avatar" style="object-fit: cover;" alt="Avatar" />
                    <div class="doc-info">
                        <strong>{{ getPositionName(workSession.position) }} {{ workSession.doctorName }}</strong>
                        <span>{{ workSession.specialtyName }}</span>
                    </div>
                </div>
            </div>

            <div class="shift-group">
                <h3 class="shift-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    Ca Chiều
                </h3>
                <div v-if="afternoonDoctorWorkSessions.length === 0" class="empty-shift text-sm text-gray">Không có bác sĩ ca chiều
                </div>
                <div v-for="workSession in afternoonDoctorWorkSessions" :key="workSession.id" class="doctor-card"
                    :class="{ active: selectedWorkSessionId === workSession.id }" @click="$emit('select', workSession)">
                    <img :src="workSession.avatarUrl" class="doc-avatar" style="object-fit: cover;" alt="Avatar" />
                    <div class="doc-info">
                        <strong>{{ getPositionName(workSession.position) }} {{ workSession.doctorName }}</strong>
                        <span>{{ workSession.specialtyName }}</span>
                    </div>
                </div>
            </div>

            <div class="shift-group">
                <h3 class="shift-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.8" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#eef2ff" />
                        <line x1="19" y1="3" x2="19" y2="5" />
                        <line x1="18" y1="4" x2="20" y2="4" />
                        <line x1="22" y1="7" x2="22" y2="8" />
                        <line x1="21.5" y1="7.5" x2="22.5" y2="7.5" />
                    </svg>
                    Ca Tối
                </h3>
                <div v-if="eveningDoctorWorkSessions.length === 0" class="empty-shift text-sm text-gray">Không có bác sĩ ca tối
                </div>
                <div v-for="workSession in eveningDoctorWorkSessions" :key="workSession.id" class="doctor-card"
                    :class="{ active: selectedWorkSessionId === workSession.id }" @click="$emit('select', workSession)">
                    <img :src="workSession.avatarUrl" class="doc-avatar" style="object-fit: cover;" alt="Avatar" />
                    <div class="doc-info">
                        <strong>{{ getPositionName(workSession.position) }} {{ workSession.doctorName }}</strong>
                        <span>{{ workSession.specialtyName }}</span>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useWorkSessionStore } from '../../../stores/workSessionStore'
import { getPositionName } from '../../../constants/enum'

const workSessionStore = useWorkSessionStore()

const props = defineProps({
    date: { type: String, required: true },
    selectedWorkSessionId: { type: String, default: null }
})

const emit = defineEmits(['select', 'doctors-loaded'])

const workSessions = ref([])
const isLoading = ref(false)

const fetchDoctorWorkSessions = async (currentDate) => {
    if (!currentDate) return;
    isLoading.value = true;
    try {
        const response = await workSessionStore.getDoctorWorkSessions(currentDate);
        workSessions.value = response;
        emit('doctors-loaded', response);
    } catch (error) {
        console.error("Lỗi khi tải danh sách bác sĩ:", error);
        workSessions.value = [];
    } finally {
        isLoading.value = false;
    }
}

watch(() => props.date, (newDate) => {
    fetchDoctorWorkSessions(newDate);
}, { immediate: true })

const morningDoctorWorkSessions = computed(() => {
    return workSessions.value.filter(ws => {
        if (ws.startTime) {
            const hour = new Date(ws.startTime).getHours();
            return hour < 12;
        }
        return false;
    });
})

const afternoonDoctorWorkSessions = computed(() => {
    return workSessions.value.filter(ws => {
        if (ws.startTime) {
            const hour = new Date(ws.startTime).getHours();
            return hour >= 12 && hour < 18;
        }
        return false;
    });
})

const eveningDoctorWorkSessions = computed(() => {
    return workSessions.value.filter(ws => {
        if (ws.startTime) {
            const hour = new Date(ws.startTime).getHours();
            return hour >= 18;
        }
        return false;
    });
})
</script>

<style scoped>
.card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.panel-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.panel-header h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: #111827;
}

.doctor-list {
    overflow-y: auto;
    flex: 1;
    padding: 16px;
}

.loading-state {
    padding: 40px 0;
    text-align: center;
    flex: 1;
}

.empty-shift {
    padding-bottom: 12px;
    font-style: italic;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.text-gray {
    color: #6b7280;
}

.text-sm {
    font-size: 13px;
}

.shift-group {
    margin-bottom: 24px;
}

.shift-title {
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.shift-title svg {
    width: 16px;
    height: 16px;
}

.doctor-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: #fff;
}

.doctor-card:hover {
    border-color: #45C3D2;
    background: #f0fbfc;
}

.doctor-card.active {
    border-color: #45C3D2;
    background: #e0f7fa;
}

.doc-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #45C3D2;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
    text-transform: uppercase;
}

.doc-info strong {
    display: block;
    font-size: 14px;
    color: #111827;
}

.doc-info span {
    font-size: 12px;
    color: #6b7280;
}
</style>