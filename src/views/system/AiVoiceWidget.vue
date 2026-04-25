<template>
  <div v-if="aiStore.isConnected" class="ai-widget-wrapper">
    <div class="ai-widget-box">

      <div class="widget-header">
        <div class="header-status-group">
          <div class="header-avatar">
            <img src="https://storage.googleapis.com/bookingcare-resources/static/BookingCare_AI.jpg" alt="AI Avatar" />
          </div>

          <div class="header-info">
            <div class="header-title">BookingCare AI</div>
            <div class="header-status" :class="statusClass">
              <span class="status-dot"></span>
              <span class="status-text">{{ statusText }}</span>
            </div>
          </div>
        </div>
        <button class="close-btn" @click="aiStore.toggleAssistant">
          <i class="fas fa-times">✖</i>
        </button>
      </div>

      <div class="chat-container" ref="chatContainerRef">
        <div v-if="!aiStore.isSetupComplete" class="initializing">
          <i class="fas fa-circle-notch fa-spin"></i>
          Đang khởi tạo kết nối...
        </div>

        <div v-for="(msg, index) in aiStore.chatHistory" :key="index"
          :class="['chat-row', msg.role === 'user' ? 'row-user' : 'row-ai']">
          <div :class="['chat-bubble', msg.role === 'user' ? 'bubble-user' : 'bubble-ai']">
            {{ msg.text }}
          </div>
        </div>

        <div v-if="aiStore.isSpeaking" class="chat-row row-ai typing-indicator">
          <div class="chat-bubble bubble-ai bubble-typing">
            <span class="bounce-dot"></span>
            <span class="bounce-dot"></span>
            <span class="bounce-dot"></span>
          </div>
        </div>
      </div>

      <div class="action-area" v-if="aiStore.isSetupComplete">
        <div class="input-wrapper">
          <input type="text" v-model="textInput" @keyup.enter="handleSend" placeholder="Nhập tin nhắn..."
            :disabled="aiStore.isRecording || aiStore.isSpeaking" class="chat-input" />
        </div>

        <div class="button-group">
          <button v-if="textInput.trim()" class="circle-btn send-btn" @click="handleSend">
            <i class="fas fa-arrow-right send-icon">➤</i>
          </button>

          <button v-else class="pill-btn mic-btn"
            :class="{ 'recording-active': aiStore.isRecording, 'speaking-disabled': aiStore.isSpeaking }"
            :disabled="aiStore.isSpeaking" @mousedown="aiStore.startSpeaking" @mouseup="aiStore.stopSpeaking"
            @mouseleave="aiStore.isRecording && aiStore.stopSpeaking()" @touchstart.prevent="aiStore.startSpeaking"
            @touchend.prevent="aiStore.stopSpeaking">
            <i v-if="aiStore.isRecording" class="fas fa-microphone-lines icon-pulse"></i>
            <i v-else class="fas fa-microphone">🎤</i>
            <span class="btn-text">{{ aiStore.isRecording ? 'Đang nghe...' : 'Giữ để nói' }}</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import { useAiStore } from '@/stores/aiStore';

const aiStore = useAiStore();
const textInput = ref('');
const chatContainerRef = ref(null);

const handleSend = () => {
  if (textInput.value.trim()) {
    aiStore.sendTextMessage(textInput.value);
    textInput.value = '';
  }
};

watch(() => aiStore.chatHistory, async () => {
  await nextTick();
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTo({
      top: chatContainerRef.value.scrollHeight,
      behavior: 'smooth'
    });
  }
}, { deep: true });

const statusText = computed(() => {
  if (aiStore.isRecording) return 'Đang nghe bạn...';
  if (aiStore.isSpeaking) return 'AI đang trả lời...';
  return 'Đang trực tuyến';
});

const statusClass = computed(() => {
  if (aiStore.isRecording) return 'status-recording';
  if (aiStore.isSpeaking) return 'status-speaking';
  return 'status-online';
});
</script>

<style scoped>
.ai-widget-wrapper,
.ai-widget-wrapper * {
  font-family: inherit;
  box-sizing: border-box;
}

:root {
  --bookingcare-blue: #45C3D2;
  --ai-purple: #8b5cf6;
  --text-main: #1f2937;
  --text-sub: #6b7280;
}

.ai-widget-wrapper {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 10000;
  animation: widgetShow 0.3s ease-out;
}

.ai-widget-box {
  background: #f9fafb;
  width: 380px;
  height: 600px;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.widget-header {
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.header-status-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(69, 195, 210, 0.3);
  border: 2px solid #ffffff;
  overflow: hidden;
  flex-shrink: 0;
}

.header-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text-main);
  margin-bottom: 2px;
}

.header-status {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-online {
  color: #10b981;
}

.status-online .status-dot {
  background: #10b981;
}

.status-speaking {
  color: #45C3D2;
}

.status-speaking .status-dot {
  background: #45C3D2;
  animation: dotPulse 1.2s infinite;
}

.status-recording {
  color: #ef4444;
}

.status-recording .status-dot {
  background: #ef4444;
  animation: dotPulse 0.8s infinite;
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.close-btn:hover {
  color: #ef4444;
  transform: scale(1.1);
}

.chat-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scroll-behavior: smooth;
}

.chat-container::-webkit-scrollbar {
  width: 5px;
}

.chat-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}

.chat-row {
  display: flex;
  width: 100%;
  animation: bubbleShow 0.3s ease-out;
}

.row-user {
  justify-content: flex-end;
}

.row-ai {
  justify-content: flex-start;
}

.chat-bubble {
  max-width: 85%;
  padding: 12px 16px;
  font-size: 14.5px;
  line-height: 1.5;
  word-wrap: break-word;
}

.bubble-user {
  background-color: #45C3D2 !important;
  color: #ffffff !important;
  border-radius: 18px 18px 4px 18px;
  box-shadow: 0 2px 8px rgba(69, 195, 210, 0.25);
  font-weight: 500;
}

.bubble-ai {
  background-color: #ffffff !important;
  color: var(--text-main) !important;
  border-radius: 18px 18px 18px 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
}

.bubble-typing {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 44px;
  padding: 0 18px;
  width: max-content;
}

.bounce-dot {
  width: 7px;
  height: 7px;
  background-color: #94a3b8;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.bounce-dot:nth-child(1) {
  animation-delay: -0.32s;
  background-color: var(--bookingcare-blue);
}

.bounce-dot:nth-child(2) {
  animation-delay: -0.16s;
  background-color: #6ed0dc;
}

.bounce-dot:nth-child(3) {
  animation-delay: 0s;
  background-color: #a4e1e8;
}

.action-area {
  padding: 14px 16px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-wrapper {
  flex: 1;
  display: flex;
}

.chat-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db !important;
  border-radius: 24px !important;
  outline: none;
  font-size: 14.5px;
  color: #1f2937 !important;
  background: #f9fafb !important;
  transition: all 0.2s;
}

.chat-input:focus {
  border-color: var(--bookingcare-blue) !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(69, 195, 210, 0.15) !important;
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pill-btn {
  height: 44px;
  border-radius: 22px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  padding: 0 16px;
  color: #ffffff !important;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  background-color: #374151 !important;
  box-shadow: 0 4px 10px rgba(55, 65, 81, 0.2);
  transition: all 0.2s;
}

.pill-btn:hover {
  background-color: #1f2937 !important;
}

.circle-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #45C3D2 !important;
  color: #ffffff !important;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(69, 195, 210, 0.3);
  transition: all 0.2s;
}

.circle-btn:hover {
  transform: translateY(-2px);
}

.recording-active {
  background-color: #ef4444 !important;
  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6);
  animation: pulseRecording 1.2s infinite;
}

@keyframes widgetShow {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bubbleShow {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dotPulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

@keyframes pulseRecording {
  to {
    box-shadow: 0 0 0 12px rgba(239, 68, 68, 0);
  }
}

@keyframes bounce {

  0%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-8px);
  }
}
</style>