import {
  Content,
  GoogleGenAI,
  GoogleGenAIOptions,
  LiveCallbacks,
  LiveClientToolResponse,
  LiveConnectConfig,
  LiveServerContent,
  LiveServerMessage,
  LiveServerToolCall,
  LiveServerToolCallCancellation,
  Part,
  Session,
} from "@google/genai";

import { EventEmitter } from "eventemitter3";
import { base64ToArrayBuffer } from "./utils";

export type LiveClientOptions = GoogleGenAIOptions & { apiKey: string };

export type ClientContentLog = {
  turns: Part[];
  turnComplete: boolean;
};

export type StreamingLog = {
  date: Date;
  type: string;
  count?: number;
  message:
  | string
  | ClientContentLog
  | Omit<LiveServerMessage, "text" | "data">
  | LiveClientToolResponse;
};

export interface LiveClientEventTypes {
  audio: (data: ArrayBuffer) => void;
  close: (event: CloseEvent) => void;
  content: (data: LiveServerContent) => void;
  error: (error: ErrorEvent) => void;
  interrupted: () => void;
  log: (log: StreamingLog) => void;
  open: () => void;
  setupcomplete: () => void;
  toolcall: (toolCall: LiveServerToolCall) => void;
  toolcallcancellation: (
    toolcallCancellation: LiveServerToolCallCancellation
  ) => void;
  turncomplete: () => void;
  transcript: (text: string) => void;
}

export class GenAILiveClient extends EventEmitter<LiveClientEventTypes> {
  protected client: GoogleGenAI;

  private _status: "connected" | "disconnected" | "connecting" = "disconnected";
  public get status() { return this._status; }

  private _session: Session | null = null;
  public get session() { return this._session; }

  private _model: string | null = null;
  public get model() { return this._model; }

  protected config: LiveConnectConfig | null = null;
  public getConfig() { return { ...this.config }; }

  constructor(options: LiveClientOptions) {
    super();
    this.client = new GoogleGenAI(options);
    this.send = this.send.bind(this);
    this.onopen = this.onopen.bind(this);
    this.onerror = this.onerror.bind(this);
    this.onclose = this.onclose.bind(this);
    this.onmessage = this.onmessage.bind(this);
  }

  protected log(type: string, message: StreamingLog["message"]) {
    this.emit("log", { date: new Date(), type, message });
  }

  async connect(model: string, config: LiveConnectConfig): Promise<boolean> {
    if (this._status === "connected" || this._status === "connecting") {
      return false;
    }

    this._status = "connecting";
    this.config = config;
    this._model = model;

    const callbacks: LiveCallbacks = {
      onopen: this.onopen,
      onmessage: this.onmessage,
      onerror: this.onerror,
      onclose: this.onclose,
    };

    try {
      this._session = await this.client.live.connect({ model, config, callbacks });
    } catch (e) {
      console.error("Error connecting to GenAI Live:", e);
      this._status = "disconnected";
      return false;
    }

    this._status = "connected";
    return true;
  }

  public disconnect() {
    if (!this.session) return false;
    try { this.session.close(); } catch (_) { }
    this._session = null;
    this._status = "disconnected";
    this.log("client.close", "Disconnected");
    return true;
  }

  public sendEndOfTurn() {
    try {
      this.session?.sendClientContent({
        turns: [{ role: 'user', parts: [{ text: ' ' }] }],
        turnComplete: true
      });
      this.log('client.endOfTurn', 'sent turnComplete with empty text');
    } catch (e) {
      console.error('[GenAILiveClient] sendEndOfTurn failed:', e);
    }
  }

  protected onopen() {
    this.log("client.open", "Connected");
    this.emit("open");
  }

  protected onerror(e: ErrorEvent) {
    this.log("server.error", e.message);
    this.emit("error", e);
  }

  protected onclose(e: CloseEvent) {
    this._status = "disconnected";
    this._session = null;
    this.log(`server.close`, `disconnected ${e.reason ? `with reason: ${e.reason}` : ''}`);
    this.emit("close", e);
  }

  protected async onmessage(message: LiveServerMessage) {
    if (message.setupComplete) {
      this.log("server.send", "setupComplete");
      this.emit("setupcomplete");
      return;
    }
    if (message.toolCall) {
      this.log("server.toolCall", message);
      this.emit("toolcall", message.toolCall);
      return;
    }
    if (message.toolCallCancellation) {
      this.log("server.toolCallCancellation", message);
      this.emit("toolcallcancellation", message.toolCallCancellation);
      return;
    }

    if (message.serverContent) {
      const { serverContent } = message;

      if ("interrupted" in serverContent) {
        this.log("server.content", "interrupted");
        this.emit("interrupted");
        return;
      }
      if ("turnComplete" in serverContent) {
        this.log("server.content", "turnComplete");
        this.emit("turncomplete");
      }

      const outputTranscription = (serverContent as any).outputTranscription;
      if (outputTranscription?.text) {
        this.log("server.transcript", outputTranscription.text);
        this.emit("transcript", outputTranscription.text);
      }

      if ("modelTurn" in serverContent) {
        let parts: Part[] = serverContent.modelTurn?.parts || [];

        const audioParts = parts.filter(
          (p) => p.inlineData && p.inlineData.mimeType?.startsWith("audio/pcm")
        );
        const base64s = audioParts.map((p) => p.inlineData?.data);
        const otherParts = parts.filter((p) => !audioParts.includes(p));

        base64s.forEach((b64) => {
          if (b64) {
            const data = base64ToArrayBuffer(b64);
            this.emit("audio", data);
            this.log(`server.audio`, `buffer (${data.byteLength})`);
          }
        });

        if (!otherParts.length) return;

        const content: { modelTurn: Content } = { modelTurn: { parts: otherParts } };
        this.emit("content", content);
        this.log(`server.content`, message);
      }
    } else {
      console.log("received unmatched message", message);
    }
  }

  sendRealtimeInput(chunks: Array<{ mimeType: string; data: string }>) {
    let hasAudio = false;
    let hasVideo = false;

    for (const ch of chunks) {
      if (ch.mimeType.includes("audio")) {
        this.session?.sendRealtimeInput({ audio: ch });
        hasAudio = true;
      } else if (ch.mimeType.includes("image")) {
        this.session?.sendRealtimeInput({ video: ch });
        hasVideo = true;
      }
    }

    const message = hasAudio && hasVideo ? "audio + video"
      : hasAudio ? "audio"
        : hasVideo ? "video" : "unknown";
    this.log(`client.realtimeInput`, message);
  }

  sendToolResponse(toolResponse: LiveClientToolResponse) {
    if (toolResponse.functionResponses?.length) {
      this.session?.sendToolResponse({ functionResponses: toolResponse.functionResponses });
      this.log(`client.toolResponse`, toolResponse);
    }
  }

  send(parts: Part | Part[], turnComplete: boolean = true) {
    const partsArray = Array.isArray(parts) ? parts : [parts];

    this.session?.sendClientContent({
      turns: [{ role: "user", parts: partsArray }],
      turnComplete
    });

    this.log(`client.send`, {
      turns: partsArray,
      turnComplete,
    });
  }
}