<template>
    <div class="dashboard-header slide-down">
        <div class="header-left">
            <h1>Tiếp đón & Điều phối</h1>
            <div class="date-picker-group">
                <label>Chọn ngày làm việc:</label>
                <input type="date" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                    @change="$emit('date-changed')" class="date-input" />
            </div>
        </div>
        <div class="header-right">
            <button class="btn-primary" @click="$emit('open-walk-in')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Tiếp nhận Bệnh nhân
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue', 'date-changed', 'open-walk-in'])
</script>

<style scoped>
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
}

.dashboard-header h1 {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 12px 0;
}

.date-picker-group {
    display: flex;
    align-items: center;
    gap: 12px;
}

.date-picker-group label {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
}

.date-input {
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-family: inherit;
    color: #111827;
    outline: none;
}

.date-input:focus {
    border-color: #45C3D2;
    box-shadow: 0 0 0 2px rgba(69, 195, 210, 0.2);
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #45C3D2;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
}

.btn-primary:hover {
    background: #3ba3b0;
}

.btn-primary svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

.slide-down {
    animation: slideDown 0.4s ease forwards;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>