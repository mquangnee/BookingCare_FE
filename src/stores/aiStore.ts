// import { defineStore } from 'pinia';
// import { ref } from 'vue';
// import { GenAILiveClient } from '../services/ai/genai-live-client';
// import { AudioRecorder } from '../services/ai/audio-recorder';
// import { AudioStreamer } from '../services/ai/audio-streamer';
// import { useWorkSessionStore } from './workSessionStore';
// import { useAppointmentStore } from './appointmentStore';
// import { useProfileStore } from './profileStore';
// import { GEMINI_LIVE_MODEL, getToolDeclarations, getSystemPrompt } from '../services/ai/ai-config';

// export const useAiStore = defineStore('ai', () => {

//     // ==========================================
//     // 1. STATE
//     // ==========================================
//     const isConnected = ref(false);
//     const isSpeaking = ref(false);
//     const isRecording = ref(false);
//     const isSetupComplete = ref(false);
//     const aiMessage = ref('Xin chào! Tôi có thể giúp gì cho bạn?');
//     const aiTextResponse = ref('');         // Text transcript từ AI
//     let isDisconnecting = false;

//     // ==========================================
//     // 2. STORES & SERVICES
//     // ==========================================
//     const workSessionStore = useWorkSessionStore();
//     const appointmentStore = useAppointmentStore();
//     const profileStore = useProfileStore();

//     const client = new GenAILiveClient({
//         apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY,
//         apiVersion: 'v1alpha'
//     });
//     const audioRecorder = new AudioRecorder();
//     const audioStreamer = new AudioStreamer(new AudioContext());

//     // ==========================================
//     // 3. CLEANUP
//     // ==========================================
//     const cleanupConnection = async () => {
//         isDisconnecting = true;
//         isConnected.value = false;
//         isSpeaking.value = false;
//         isRecording.value = false;
//         isSetupComplete.value = false;

//         try { audioRecorder.stop(); } catch (_) { }
//         try { audioStreamer.stop(); } catch (_) { }
//         try { client.disconnect(); } catch (_) { }

//         await new Promise(resolve => setTimeout(resolve, 150));
//         isDisconnecting = false;
//     };

//     // ==========================================
//     // 4. KẾT NỐI
//     // ==========================================
//     const connectToAI = async () => {
//         await audioStreamer.resume();

//         const success = await client.connect(GEMINI_LIVE_MODEL, {
//             tools: [getToolDeclarations() as any],

//             responseModalities: ['AUDIO'],

//             systemInstruction: {
//                 role: 'user',
//                 parts: [{ text: getSystemPrompt() }]
//             },
//             speechConfig: {
//                 voiceConfig: {
//                     prebuiltVoiceConfig: { voiceName: 'Aoede' }
//                 }
//             }
//         });

//         if (!success) throw new Error("Kết nối thất bại");

//         isConnected.value = true;
//         isSetupComplete.value = false;
//         isDisconnecting = false;
//         aiMessage.value = "Đang khởi tạo...";
//     };

//     // ==========================================
//     // 5. EVENTS TỪ AI
//     // ==========================================

//     // Setup xong → trigger AI chào hỏi ngay
//     client.on('setupcomplete', async () => {
//         console.log('✅ setupcomplete');
//         isSetupComplete.value = true;
//         aiMessage.value = "Nhấn 🎤 để nói";

//         // ✅ Gửi lệnh trigger để AI tự chào và sinh text ngay từ đầu
//         setTimeout(() => {
//             client.send([{
//                 text: 'Vậy hãy lấy danh sách hồ sơ người thân của tài khoản tôi đang có'
//             }], true);
//         }, 500);
//     });

//     // Nhận text transcript từ AI
//     client.on('content', (content) => {
//         if (content.modelTurn?.parts && content.modelTurn.parts.length > 0) {
//             const textPart = content.modelTurn.parts.find((p: any) => p.text);
//             if (textPart?.text) {
//                 aiTextResponse.value += textPart.text;
//             }
//         }
//     });

//     // Nhận audio từ AI
//     client.on('audio', (data) => {
//         isSpeaking.value = true;
//         audioStreamer.addPCM16(new Uint8Array(data as ArrayBuffer));
//     });

//     // AI nói xong
//     client.on('turncomplete', () => {
//         console.log('✅ turncomplete');
//         isSpeaking.value = false;
//         isRecording.value = false;
//         audioStreamer.complete();
//         aiMessage.value = "Nhấn 🎤 để nói";
//     });

//     // AI bị ngắt giữa chừng
//     client.on('interrupted', () => {
//         audioStreamer.stop();
//         isSpeaking.value = false;
//     });

//     // Tool calling
//     client.on('toolcall', async (toolCall) => {
//         const responses: any[] = [];

//         for (const call of toolCall.functionCalls || []) {

//             if (call.name === 'get_doctor_schedules') {
//                 try {
//                     const data = await workSessionStore.getAvailableTimeSlots({
//                         doctorId: call.args?.doctorId as string,
//                         date: call.args?.date as string,
//                         durationInMinutes: 30
//                     });
//                     responses.push({ id: call.id, name: call.name, response: { content: data } });
//                 } catch {
//                     responses.push({ id: call.id, name: call.name, response: { error: "Không lấy được lịch bác sĩ." } });
//                 }
//             }

//             else if (call.name === 'get_patient_profiles') {
//                 try {
//                     const data = await profileStore.getUserProfileForBooking({
//                         date: call.args?.date as string,
//                         startTime: call.args?.startTime as string,
//                         endTime: call.args?.endTime as string,
//                     });
//                     responses.push({ id: call.id, name: call.name, response: { content: data } });
//                 } catch {
//                     responses.push({ id: call.id, name: call.name, response: { error: "Không lấy được hồ sơ bệnh nhân." } });
//                 }
//             }

//             else if (call.name === 'book_appointment') {
//                 try {
//                     const result = await appointmentStore.createAppointment({
//                         doctorId: call.args?.doctorId as string,
//                         patientProfileId: call.args?.patientProfileId as string,
//                         date: call.args?.date as string,
//                         startTime: call.args?.startTime as string,
//                         endTime: call.args?.endTime as string,
//                     });
//                     responses.push({ id: call.id, name: call.name, response: { content: result } });
//                 } catch {
//                     responses.push({ id: call.id, name: call.name, response: { error: "Đặt lịch thất bại." } });
//                 }
//             }
//         }

//         client.sendToolResponse({ functionResponses: responses });
//     });

//     client.on('close', async (e) => {
//         console.error(`[WS Close] code=${e?.code}, reason="${e?.reason}", wasClean=${e?.wasClean}`);
//         const wasUserActive = isConnected.value && !isDisconnecting;
//         await cleanupConnection();

//         if (wasUserActive) {
//             aiMessage.value = "Mất kết nối. Đang kết nối lại...";
//             setTimeout(async () => {
//                 if (!isDisconnecting) {
//                     try {
//                         await connectToAI();
//                     } catch (error) {
//                         console.error("[aiStore] Kết nối lại thất bại:", error);
//                         aiMessage.value = "Không thể kết nối lại. Vui lòng thử lại.";
//                     }
//                 }
//             }, 2000);
//         } else {
//             aiMessage.value = 'Xin chào! Tôi có thể giúp gì cho bạn?';
//         }
//     });

//     audioRecorder.on('data', (base64: string) => {
//         if (!isConnected.value || isDisconnecting || !isSetupComplete.value || !isRecording.value) return;
//         try {
//             client.sendRealtimeInput([{ mimeType: 'audio/pcm;rate=16000', data: base64 }]);
//         } catch (e: any) {
//             console.warn("[aiStore] Lỗi send audio:", e.message);
//         }
//     });

//     const startSpeaking = async () => {
//         if (!isConnected.value || !isSetupComplete.value || isRecording.value) return;

//         if (isSpeaking.value) {
//             audioStreamer.stop();
//             isSpeaking.value = false;
//         }

//         aiTextResponse.value = '';
//         isRecording.value = true;
//         aiMessage.value = "Đang nghe bạn... 🎤";

//         await audioRecorder.start();
//     };

//     const stopSpeaking = async () => {
//         if (!isRecording.value) return;

//         audioRecorder.stop();
//         isRecording.value = false;
//         aiMessage.value = "AI đang xử lý...";

//         await new Promise(resolve => setTimeout(resolve, 300));

//         client.sendEndOfTurn();
//     };

//     const toggleAssistant = async () => {
//         if (isConnected.value) {
//             isDisconnecting = true;
//             await cleanupConnection();
//             aiTextResponse.value = '';
//             aiMessage.value = 'Xin chào! Tôi có thể giúp gì cho bạn?';
//         } else {
//             try {
//                 await connectToAI();
//             } catch (error) {
//                 console.error("[aiStore] Lỗi kết nối AI:", error);
//                 isConnected.value = false;
//                 isDisconnecting = false;
//                 alert("Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra API Key.");
//             }
//         }
//     };

//     return {
//         isConnected, isSpeaking, isRecording,
//         isSetupComplete, aiMessage, aiTextResponse,
//         toggleAssistant, startSpeaking, stopSpeaking
//     };
// });

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { GenAILiveClient } from '../services/ai/genai-live-client';
import { AudioRecorder } from '../services/ai/audio-recorder';
import { AudioStreamer } from '../services/ai/audio-streamer';
import { useWorkSessionStore } from './workSessionStore';
import { useAppointmentStore } from './appointmentStore';
import { useProfileStore } from './profileStore';
import { GEMINI_LIVE_MODEL, getToolDeclarations, getSystemPrompt } from '../services/ai/ai-config';

// Định nghĩa kiểu dữ liệu cho tin nhắn
export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    type?: 'text' | 'audio';
}

export const useAiStore = defineStore('ai', () => {

    // ==========================================
    // 1. STATE
    // ==========================================
    const isConnected = ref(false);
    const isSpeaking = ref(false);
    const isRecording = ref(false);
    const isSetupComplete = ref(false);
    const aiMessage = ref('Xin chào! Tôi có thể giúp gì cho bạn?');
    const aiTextResponse = ref('');

    // Thêm state lưu lịch sử chat
    const chatHistory = ref<ChatMessage[]>([]);

    let isDisconnecting = false;

    // ... (Giữ nguyên phần 2. STORES & SERVICES) ...
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
        // Xóa lịch sử khi ngắt kết nối
        chatHistory.value = [];

        try { audioRecorder.stop(); } catch (_) { }
        try { audioStreamer.stop(); } catch (_) { }
        try { client.disconnect(); } catch (_) { }

        await new Promise(resolve => setTimeout(resolve, 150));
        isDisconnecting = false;
    };

    // ... (Giữ nguyên phần 4. KẾT NỐI connectToAI) ...
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
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } }
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

    client.on('setupcomplete', async () => {
        isSetupComplete.value = true;
        aiMessage.value = "Sẵn sàng trò chuyện";

        // Push tin nhắn giả định ban đầu vào chat
        const initText = 'Vậy hãy lấy danh sách hồ sơ người thân của tài khoản tôi đang có';
        chatHistory.value.push({ role: 'user', text: initText, type: 'text' });

        setTimeout(() => {
            client.send([{ text: initText }], true);
        }, 500);
    });

    // NHẬN TEXT TỪ AI VÀ CẬP NHẬT CHAT HISTORY THEO LUỒNG (STREAMING)
    client.on('content', (content) => {
        if (content.modelTurn?.parts && content.modelTurn.parts.length > 0) {

            const textParts = content.modelTurn.parts.filter((p: any) => p.text && p.thought !== true);

            for (const part of textParts) {
                let cleanedText = part.text?.replace(/^(?:thought|suy nghĩ|thinking):[\s\S]*?(?=\n\n|$)/gim, '').trimStart();
                if (!cleanedText) continue;
                const lastMsg = chatHistory.value[chatHistory.value.length - 1];

                if (lastMsg && lastMsg.role === 'model') {
                    lastMsg.text += cleanedText;
                } else {
                    chatHistory.value.push({ role: 'model', text: cleanedText });
                }
                aiTextResponse.value += cleanedText;
            }
        }
    });

    // ... (Giữ nguyên các sự kiện audio, turncomplete, interrupted, toolcall, close) ...
    client.on('audio', (data) => {
        isSpeaking.value = true;
        audioStreamer.addPCM16(new Uint8Array(data as ArrayBuffer));
    });

    client.on('turncomplete', () => {
        isSpeaking.value = false;
        isRecording.value = false;
        audioStreamer.complete();
    });

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

    // ... (Giữ nguyên audioRecorder on data)
    audioRecorder.on('data', (base64: string) => {
        if (!isConnected.value || isDisconnecting || !isSetupComplete.value || !isRecording.value) return;
        try {
            client.sendRealtimeInput([{ mimeType: 'audio/pcm;rate=16000', data: base64 }]);
        } catch (e: any) {
            console.warn("[aiStore] Lỗi send audio:", e.message);
        }
    });

    // ==========================================
    // 6. ACTION USER
    // ==========================================

    const startSpeaking = async () => {
        if (!isConnected.value || !isSetupComplete.value || isRecording.value) return;
        if (isSpeaking.value) {
            audioStreamer.stop();
            isSpeaking.value = false;
        }
        aiTextResponse.value = '';
        isRecording.value = true;

        await audioRecorder.start();
    };

    const stopSpeaking = async () => {
        if (!isRecording.value) return;
        audioRecorder.stop();
        isRecording.value = false;

        // Thêm thông báo vào khung chat cho biết user vừa thu âm xong
        chatHistory.value.push({ role: 'user', text: '🎤 [Đã gửi tin nhắn thoại]', type: 'audio' });

        await new Promise(resolve => setTimeout(resolve, 300));
        client.sendEndOfTurn();
    };

    // HÀM MỚI: GỬI TIN NHẮN TEXT
    const sendTextMessage = (text: string) => {
        if (!text.trim() || !isConnected.value || !isSetupComplete.value) return;

        // 1. Thêm vào giao diện chat
        chatHistory.value.push({ role: 'user', text: text, type: 'text' });

        // 2. Gửi qua Gemini Live Client
        client.send([{ text: text }], true);
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
                alert("Không thể kết nối đến máy chủ AI.");
            }
        }
    };

    return {
        isConnected, isSpeaking, isRecording,
        isSetupComplete, aiMessage, aiTextResponse,
        chatHistory, // Export ra để UI dùng
        toggleAssistant, startSpeaking, stopSpeaking, sendTextMessage // Export hàm gửi text
    };
});