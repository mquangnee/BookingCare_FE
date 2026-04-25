import { defineStore } from 'pinia';
import { ref } from 'vue';
import { GenAILiveClient } from '../services/ai/genai-live-client';
import { AudioStreamer } from '../services/ai/audio-streamer';
import { useWorkSessionStore } from './workSessionStore';
import { useAppointmentStore } from './appointmentStore';
import { useProfileStore } from './profileStore';
import { GEMINI_LIVE_MODEL, getToolDeclarations, getSystemPrompt } from '../services/ai/ai-config';

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    type?: 'text' | 'audio';
}

export const useAiStore = defineStore('ai', () => {

    const isConnected = ref(false);
    const isSpeaking = ref(false);
    const isRecording = ref(false);
    const isSetupComplete = ref(false);
    const aiMessage = ref('Xin chào! Tôi có thể giúp gì cho bạn?');
    const aiTextResponse = ref('');

    const chatHistory = ref<ChatMessage[]>([]);
    const userTranscript = ref('');
    let recognition: any = null;

    let isDisconnecting = false;

    const workSessionStore = useWorkSessionStore();
    const appointmentStore = useAppointmentStore();
    const profileStore = useProfileStore();

    const client = new GenAILiveClient({
        apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY,
        apiVersion: 'v1alpha'
    });

    const audioStreamer = new AudioStreamer(new AudioContext());

    const setupSpeechRecognition = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Trình duyệt không hỗ trợ Web Speech API.");
            return null;
        }

        const speechRec = new SpeechRecognition();
        speechRec.continuous = true;
        speechRec.interimResults = true;
        speechRec.lang = 'vi-VN';

        speechRec.onresult = (event: any) => {
            let interim = '';
            let finalStr = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalStr += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            userTranscript.value += finalStr;

            const displayedText = (userTranscript.value + interim).trim();

            const len = chatHistory.value.length;
            if (len > 0 && chatHistory.value[len - 1].role === 'user' && chatHistory.value[len - 1].type === 'audio') {
                chatHistory.value[len - 1].text = displayedText || '🎤 Đang nghe...';
            }
        };

        speechRec.onerror = (event: any) => {
            console.error("Lỗi nhận diện giọng nói:", event.error);
            isRecording.value = false;
        };

        return speechRec;
    };

    const cleanupConnection = async () => {
        isDisconnecting = true;
        isConnected.value = false;
        isSpeaking.value = false;
        isRecording.value = false;
        isSetupComplete.value = false;
        chatHistory.value = [];

        if (recognition) {
            recognition.stop();
        }
        userTranscript.value = '';

        try { audioStreamer.stop(); } catch (_) { }
        try { client.disconnect(); } catch (_) { }

        await new Promise(resolve => setTimeout(resolve, 150));
        isDisconnecting = false;
    };

    const connectToAI = async () => {
        await audioStreamer.resume();
        const success = await client.connect(GEMINI_LIVE_MODEL, {
            tools: [getToolDeclarations() as any],
            responseModalities: ['AUDIO'],
            outputAudioTranscription: {},
            inputAudioTranscription: {},
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

    client.on('setupcomplete', async () => {
        isSetupComplete.value = true;
        aiMessage.value = "Sẵn sàng trò chuyện";

        const initText = 'Chào tôi và gợi ý lấy hồ sơ bệnh nhân khi cần đặt lịch khám';
        setTimeout(() => {
            client.send([{ text: initText }], true);
        }, 100);
    });

    client.on('content', (content) => {
        if (!content.modelTurn?.parts?.length) return;
        const textParts = content.modelTurn.parts.filter(
            (p: any) => p.text && p.thought !== true
        );
        for (const part of textParts) {
            const cleaned = part.text
                ?.replace(/^(?:thought|suy nghĩ|thinking):[\s\S]*?(?=\n\n|$)/gim, '')
                .trimStart();
            if (!cleaned) continue;
            const last = chatHistory.value.at(-1);
            if (last?.role === 'model') {
                last.text += cleaned;
            } else {
                chatHistory.value.push({ role: 'model', text: cleaned });
            }
            aiTextResponse.value += cleaned;
        }
    });

    client.on('transcript', (text: string) => {
        const last = chatHistory.value.at(-1);
        if (last?.role === 'model') {
            last.text += text;
        } else {
            chatHistory.value.push({ role: 'model', text });
        }
        aiTextResponse.value += text;
    });

    const eventsToWatch = ['transcription', 'outputTranscription', 'transcript', 'message', 'serverContent'];
    eventsToWatch.forEach(name => {
        try {
            client.on(name as any, (data: any) => {
                console.log(`[event: ${name}]`, JSON.stringify(data, null, 2));
            });
        } catch (_) { }
    });

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

    client.on('toolcall', async (toolCall) => {
        const responses: any[] = [];
        for (const call of toolCall.functionCalls || []) {
            if (call.name === 'book_appointment') {
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
                    responses.push({ id: call.id, name: call.name, response: { error: 'Đặt lịch thất bại.' } });
                }
            }
        }
        if (responses.length > 0) {
            client.sendToolResponse({ functionResponses: responses });
        }
    });

    client.on('close', async (e) => {
        console.error(`[WS Close] code=${e?.code}, reason="${e?.reason}"`);
        const wasUserActive = isConnected.value && !isDisconnecting;
        await cleanupConnection();

        if (wasUserActive) {
            aiMessage.value = "Mất kết nối. Đang kết nối lại...";
            setTimeout(async () => {
                if (!isDisconnecting) {
                    try { await connectToAI(); } catch (_) { aiMessage.value = "Lỗi kết nối lại."; }
                }
            }, 2000);
        } else {
            aiMessage.value = 'Xin chào! Tôi có thể giúp gì cho bạn?';
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
        userTranscript.value = '';

        if (!recognition) {
            recognition = setupSpeechRecognition();
        }

        if (recognition) {
            try {
                recognition.start();
                chatHistory.value.push({ role: 'user', text: '🎤 Đang nghe...', type: 'audio' });
            } catch (e) {
                console.error("Không thể start recognition", e);
                isRecording.value = false;
            }
        } else {
            alert("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng gõ phím!");
            isRecording.value = false;
        }
    };

    const stopSpeaking = async () => {
        if (!isRecording.value) return;
        isRecording.value = false;

        if (recognition) {
            recognition.stop();

            await new Promise(resolve => setTimeout(resolve, 500));

            const textToSend = userTranscript.value.trim();
            userTranscript.value = '';

            const len = chatHistory.value.length;
            if (textToSend) {
                if (len > 0 && chatHistory.value[len - 1].type === 'audio') {
                    chatHistory.value[len - 1].text = textToSend;
                    chatHistory.value[len - 1].type = 'text';
                }

                client.send([{ text: textToSend }], true);
            } else {
                if (len > 0 && chatHistory.value[len - 1].type === 'audio') {
                    chatHistory.value.pop();
                }
            }
        }
    };

    const sendTextMessage = (text: string) => {
        if (!text.trim() || !isConnected.value || !isSetupComplete.value) return;
        chatHistory.value.push({ role: 'user', text: text, type: 'text' });
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
                isConnected.value = false;
                isDisconnecting = false;
                alert("Không thể kết nối đến máy chủ AI.");
            }
        }
    };

    return {
        isConnected, isSpeaking, isRecording,
        isSetupComplete, aiMessage, aiTextResponse,
        chatHistory,
        toggleAssistant, startSpeaking, stopSpeaking, sendTextMessage
    };
});