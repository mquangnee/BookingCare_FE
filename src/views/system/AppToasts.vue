<script setup>
import { toastState, dismissNotify } from '../../utils/notify'
</script>

<template>
  <Teleport to="body">
    <div class="app-toasts" aria-live="polite" aria-relevant="additions text">
      <TransitionGroup name="toast-slide">
        <button v-for="t in toastState.items" :key="t.id" type="button" class="toast" :class="t.type"
          @click="dismissNotify(t.id)">
          {{ t.message }}
        </button>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.app-toasts {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  max-width: min(420px, calc(100vw - 32px));
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  margin: 0;
  padding: 14px 18px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.toast:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14), 0 4px 10px rgba(0, 0, 0, 0.08);
}

.toast.success {
  background: #ecfdf5;
  color: #064e3b;
  border-left: 4px solid #34d399;
}

.toast.error {
  background: #fff1f2;
  color: #881337;
  border-left: 4px solid #f43f5e;
}

.toast.info {
  background: #eef2ff;
  color: #312e81;
  border-left: 4px solid #818cf8;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 1s cubic-bezier(0.2, 1, 0.4, 1);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(28px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(24px) scale(0.98);
}

.toast-slide-move {
  transition: transform 1s cubic-bezier(0.2, 1, 0.4, 1);
}
</style>
