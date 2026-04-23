import { defineStore } from 'pinia';
import { ref } from 'vue';
import { GenAILiveClient } from '../services/ai/genai-live-client';
import { AudioRecorder } from '../services/ai/audio-recorder';
import { AudioStreamer } from '../services/ai/audio-streamer';
import { useWorkSessionStore } from './workSessionStore';
import { useAppointmentStore } from './appointmentStore';
import { useProfileStore } from './profileStore';
import { GEMINI_LIVE_MODEL, getToolDeclarations, getSystemPrompt } from '../services/ai/ai-config';

export const useAiStore = defineStore('ai', () => {

    // ==========================================
    // 1. STATE
    // ==========================================
    const isConnected = ref(false);
    const isSpeaking = ref(false);
    const isRecording = ref(false);
    const isSetupComplete = ref(false);
    const aiMessage = ref('Xin chào! Tôi có thể giúp gì cho bạn?');
    const aiTextResponse = ref('');         // Text transcript từ AI
    let isDisconnecting = false;

    // ==========================================
    // 2. STORES & SERVICES
    // ==========================================
    const workSessionStore = useWorkSessionStore();
    const appointmentStore = useAppointmentStore();
    const profileStore = useProfileStore();

    const client = new GenAILiveClient({
        apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY,
        apiVersion: 'v1alpha'
    });
    const audioRecorder = new AudioRecorder();
    const audioStreamer = new AudioStreamer(new AudioContext());

    // ==========================================
    // 3. CLEANUP
    // ==========================================
    const cleanupConnection = async () => {
        isDisconnecting = true;
        isConnected.value = false;
        isSpeaking.value = false;
        isRecording.value = false;
        isSetupComplete.value = false;

        try { audioRecorder.stop(); } catch (_) { }
        try { audioStreamer.stop(); } catch (_) { }
        try { client.disconnect(); } catch (_) { }

        await new Promise(resolve => setTimeout(resolve, 150));
        isDisconnecting = false;
    };

    // ==========================================
    // 4. KẾT NỐI
    // ==========================================
    const connectToAI = async () => {
        await audioStreamer.resume();

        const success = await client.connect(GEMINI_LIVE_MODEL, {
            tools: [getToolDeclarations() as any],

            responseModalities: ['AUDIO'],

            systemInstruction: {
                role: 'user',
                parts: [{ text: getSystemPrompt() }]
            },
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Aoede' }
                }
            }
        });

        if (!success) throw new Error("Kết nối thất bại");

        isConnected.value = true;
        isSetupComplete.value = false;
        isDisconnecting = false;
        aiMessage.value = "Đang khởi tạo...";
    };

    // ==========================================
    // 5. EVENTS TỪ AI
    // ==========================================

    // Setup xong → trigger AI chào hỏi ngay
    client.on('setupcomplete', async () => {
        console.log('✅ setupcomplete');
        isSetupComplete.value = true;
        aiMessage.value = "Nhấn 🎤 để nói";

        // ✅ Gửi lệnh trigger để AI tự chào và sinh text ngay từ đầu
        setTimeout(() => {
            client.send([{
                text: 'Vậy hãy lấy danh sách hồ sơ người thân của tài khoản tôi đang có'
            }], true);
        }, 500);
    });

    // Nhận text transcript từ AI
    client.on('content', (content) => {
        if (content.modelTurn?.parts && content.modelTurn.parts.length > 0) {
            const textPart = content.modelTurn.parts.find((p: any) => p.text);
            if (textPart?.text) {
                aiTextResponse.value += textPart.text;
            }
        }
    });

    // Nhận audio từ AI
    client.on('audio', (data) => {
        isSpeaking.value = true;
        audioStreamer.addPCM16(new Uint8Array(data as ArrayBuffer));
    });

    // AI nói xong
    client.on('turncomplete', () => {
        console.log('✅ turncomplete');
        isSpeaking.value = false;
        isRecording.value = false;
        audioStreamer.complete();
        aiMessage.value = "Nhấn 🎤 để nói";
    });

    // AI bị ngắt giữa chừng
    client.on('interrupted', () => {
        audioStreamer.stop();
        isSpeaking.value = false;
    });

    // Tool calling
    client.on('toolcall', async (toolCall) => {
        const responses: any[] = [];

        for (const call of toolCall.functionCalls || []) {

            if (call.name === 'get_doctor_schedules') {
                try {
                    const data = await workSessionStore.getAvailableTimeSlots({
                        doctorId: call.args?.doctorId as string,
                        date: call.args?.date as string,
                        durationInMinutes: 30
                    });
                    responses.push({ id: call.id, name: call.name, response: { content: data } });
                } catch {
                    responses.push({ id: call.id, name: call.name, response: { error: "Không lấy được lịch bác sĩ." } });
                }
            }

            else if (call.name === 'get_patient_profiles') {
                try {
                    const data = await profileStore.getUserProfileForBooking({
                        date: call.args?.date as string,
                        startTime: call.args?.startTime as string,
                        endTime: call.args?.endTime as string,
                    });
                    responses.push({ id: call.id, name: call.name, response: { content: data } });
                } catch {
                    responses.push({ id: call.id, name: call.name, response: { error: "Không lấy được hồ sơ bệnh nhân." } });
                }
            }

            else if (call.name === 'book_appointment') {
                try {
                    const result = await appointmentStore.createAppointment({
                        doctorId: call.args?.doctorId as string,
                        patientProfileId: call.args?.patientProfileId as string,
                        date: call.args?.date as string,
                        startTime: call.args?.startTime as string,
                        endTime: call.args?.endTime as string,
                    });
                    responses.push({ id: call.id, name: call.name, response: { content: result } });
                } catch {
                    responses.push({ id: call.id, name: call.name, response: { error: "Đặt lịch thất bại." } });
                }
            }
        }

        client.sendToolResponse({ functionResponses: responses });
    });

    client.on('close', async (e) => {
        console.error(`[WS Close] code=${e?.code}, reason="${e?.reason}", wasClean=${e?.wasClean}`);
        const wasUserActive = isConnected.value && !isDisconnecting;
        await cleanupConnection();

        if (wasUserActive) {
            aiMessage.value = "Mất kết nối. Đang kết nối lại...";
            setTimeout(async () => {
                if (!isDisconnecting) {
                    try {
                        await connectToAI();
                    } catch (error) {
                        console.error("[aiStore] Kết nối lại thất bại:", error);
                        aiMessage.value = "Không thể kết nối lại. Vui lòng thử lại.";
                    }
                }
            }, 2000);
        } else {
            aiMessage.value = 'Xin chào! Tôi có thể giúp gì cho bạn?';
        }
    });

    audioRecorder.on('data', (base64: string) => {
        if (!isConnected.value || isDisconnecting || !isSetupComplete.value || !isRecording.value) return;
        try {
            client.sendRealtimeInput([{ mimeType: 'audio/pcm;rate=16000', data: base64 }]);
        } catch (e: any) {
            console.warn("[aiStore] Lỗi send audio:", e.message);
        }
    });

    const startSpeaking = async () => {
        if (!isConnected.value || !isSetupComplete.value || isRecording.value) return;

        if (isSpeaking.value) {
            audioStreamer.stop();
            isSpeaking.value = false;
        }

        aiTextResponse.value = '';
        isRecording.value = true;
        aiMessage.value = "Đang nghe bạn... 🎤";

        await audioRecorder.start();
    };

    const stopSpeaking = async () => {
        if (!isRecording.value) return;

        audioRecorder.stop();
        isRecording.value = false;
        aiMessage.value = "AI đang xử lý...";

        await new Promise(resolve => setTimeout(resolve, 300));

        client.sendEndOfTurn();
    };

    const toggleAssistant = async () => {
        if (isConnected.value) {
            isDisconnecting = true;
            await cleanupConnection();
            aiTextResponse.value = '';
            aiMessage.value = 'Xin chào! Tôi có thể giúp gì cho bạn?';
        } else {
            try {
                await connectToAI();
            } catch (error) {
                console.error("[aiStore] Lỗi kết nối AI:", error);
                isConnected.value = false;
                isDisconnecting = false;
                alert("Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra API Key.");
            }
        }
    };

    return {
        isConnected, isSpeaking, isRecording,
        isSetupComplete, aiMessage, aiTextResponse,
        toggleAssistant, startSpeaking, stopSpeaking
    };
});