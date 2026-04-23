<template>
  <div v-if="aiStore.isConnected" class="ai-widget-container">
    <div class="ai-widget-box">
      <button class="close-btn" @click="aiStore.toggleAssistant">
        <i class="fas fa-times"></i>
      </button>

      <div class="visualizer-area">
        <div class="avatar-pulse" :class="{ speaking: aiStore.isSpeaking, recording: aiStore.isRecording }">
          <div class="ring ring-1"></div>
          <div class="ring ring-2"></div>
          <div class="ring ring-3"></div>
          <div class="ai-icon">
            <i class="fas fa-robot"></i>
          </div>
        </div>
      </div>

      <div class="ai-status">
        <h4 :class="{
          'text-primary': !aiStore.isSpeaking && !aiStore.isRecording,
          'text-success': aiStore.isSpeaking,
          'text-danger': aiStore.isRecording
        }">
          {{ aiStore.isRecording ? '🔴 Đang nghe bạn...' : aiStore.isSpeaking ? '🔊 AI đang nói' : aiStore.aiMessage }}
        </h4>
      </div>

      <div v-if="aiStore.aiTextResponse" class="ai-text-box">
        <p>{{ aiStore.aiTextResponse }}</p>
      </div>

      <button v-if="aiStore.isSetupComplete" class="ptt-btn" :class="{
        'ptt-recording': aiStore.isRecording,
        'ptt-speaking': aiStore.isSpeaking,
        'ptt-idle': !aiStore.isRecording && !aiStore.isSpeaking
      }" :disabled="aiStore.isSpeaking" @mousedown="aiStore.startSpeaking" @mouseup="aiStore.stopSpeaking"
        @mouseleave="aiStore.isRecording && aiStore.stopSpeaking()" @touchstart.prevent="aiStore.startSpeaking"
        @touchend.prevent="aiStore.stopSpeaking">
        <i :class="aiStore.isRecording ? 'fas fa-stop' : 'fas fa-microphone'"></i>
        <span>{{ aiStore.isRecording ? 'Thả để gửi' : aiStore.isSpeaking ? 'AI đang nói...' : 'Nhấn giữ để nói'
        }}</span>
      </button>

      <div v-else class="initializing">
        <i class="fas fa-spinner fa-spin"></i> Đang khởi tạo...
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAiStore } from '@/stores/aiStore';
const aiStore = useAiStore();
</script>

<style scoped>
.ai-widget-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  animation: slideUp 0.3s ease-out;
}

.ai-widget-box {
  background: white;
  width: 320px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 24px;
  position: relative;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* ── Nút đóng ── */
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
}

.close-btn:hover {
  color: #ef4444;
}

/* ── Avatar ── */
.visualizer-area {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-pulse {
  position: relative;
  width: 70px;
  height: 70px;
}

.ai-icon {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #45C3D2, #2b828d);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 30px;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(69, 195, 210, 0.4);
  transition: background 0.3s, box-shadow 0.3s;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid #45C3D2;
  opacity: 0;
}

.ring-1 {
  width: 90px;
  height: 90px;
  animation: pulse 2s infinite 0.0s;
}

.ring-2 {
  width: 110px;
  height: 110px;
  animation: pulse 2s infinite 0.4s;
}

.ring-3 {
  width: 130px;
  height: 130px;
}

/* Speaking — tím */
.avatar-pulse.speaking .ai-icon {
  background: linear-gradient(135deg, #a855f7, #7e22ce);
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
}

.avatar-pulse.speaking .ring {
  border-color: #a855f7;
}

.avatar-pulse.speaking .ring-1 {
  animation: pulse 1s infinite 0.0s;
}

.avatar-pulse.speaking .ring-2 {
  animation: pulse 1s infinite 0.2s;
}

.avatar-pulse.speaking .ring-3 {
  animation: pulse 1s infinite 0.4s;
}

/* Recording — đỏ */
.avatar-pulse.recording .ai-icon {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.avatar-pulse.recording .ring {
  border-color: #ef4444;
}

.avatar-pulse.recording .ring-1 {
  animation: pulse 0.8s infinite 0.0s;
}

.avatar-pulse.recording .ring-2 {
  animation: pulse 0.8s infinite 0.2s;
}

.avatar-pulse.recording .ring-3 {
  animation: pulse 0.8s infinite 0.4s;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.7;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0;
  }
}

/* ── Trạng thái ── */
.ai-status h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
}

.text-primary {
  color: #45C3D2;
}

.text-success {
  color: #a855f7;
}

.text-danger {
  color: #ef4444;
}

/* ── Text transcript ── */
.ai-text-box {
  width: 100%;
  background: #f8faff;
  border: 1px solid #e0e7ff;
  border-radius: 12px;
  padding: 10px 14px;
  max-height: 120px;
  overflow-y: auto;
}

.ai-text-box p {
  margin: 0;
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
}

/* ── Push-to-talk ── */
.ptt-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  user-select: none;
}

.ptt-idle {
  background: linear-gradient(135deg, #45C3D2, #2b828d);
  color: white;
  box-shadow: 0 4px 12px rgba(69, 195, 210, 0.35);
}

.ptt-idle:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(69, 195, 210, 0.45);
}

.ptt-recording {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: white;
  animation: recordPulse 1s infinite;
}

.ptt-speaking {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

@keyframes recordPulse {

  0%,
  100% {
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  50% {
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.7);
  }
}

/* ── Initializing ── */
.initializing {
  font-size: 13px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 6px;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>