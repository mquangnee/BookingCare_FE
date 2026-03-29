<template>
    <div class="booking-page-container">
        <AppHeader />

        <main class="main-content">
            <div class="wizard-wrapper">
                <BookingWizard />
            </div>
        </main>
    </div>
</template>

<script setup>
import AppHeader from '@/component/AppHeader.vue'
import BookingWizard from '@/component/BookingWizard.vue'
</script>

<style scoped>
.booking-page-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f8fafc;
    background-image: radial-gradient(at top right, #eaf9f7 0%, #f8fafc 50%);
}

.main-content {
    flex: 1;
    padding: 48px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.wizard-wrapper {
    width: 100%;
}

@media (max-width: 1024px) {
    .main-content {
        padding: 40px 20px;
    }
}

@media (max-width: 768px) {
    .main-content {
        padding: 32px 16px;
    }
}

@media (max-width: 480px) {
    .main-content {
        padding: 24px 12px;
    }
}
</style>