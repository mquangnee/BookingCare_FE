import * as signalR from "@microsoft/signalr";

class SignalRService {
    private connection: signalR.HubConnection | null;
    private readonly hubUrl: string;

    constructor() {
        this.connection = null;
        this.hubUrl = "https://localhost:7243/appointment"; 
    }

    public initConnection(): void {
        if (!this.connection) {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(this.hubUrl, {
                    accessTokenFactory: () => {
                        const token = localStorage.getItem("accessToken");
                        return token ? token : "";
                    }
                })
                .withAutomaticReconnect()
                .build();
        }
    }

    public async startConnection(doctorId: string): Promise<void> {
        if (!this.connection) {
            this.initConnection();
        }

        try {
            if (this.connection?.state === signalR.HubConnectionState.Disconnected) {
                await this.connection.start();
                console.log("SignalR Connected!");
            }
            await this.connection?.invoke("JoinDoctorGroup", doctorId);
            console.log(`Joined group for doctor: ${doctorId}`);

        } catch (err) {
            console.error("SignalR Connection Error: ", err);
        }
    }

    public stopConnection(): void {
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            this.connection.stop();
        }
    }

    public onAppointmentStatusChanged(callback: (data: any) => void): void {
        if (this.connection) {
            this.connection.on("AppointmentStatusChanged", (data: any) => {
                callback(data);
            });
        }
    }
    
    public offAppointmentStatusChanged(): void {
        if (this.connection) {
             this.connection.off("AppointmentStatusChanged");
        }
    }
}

export const signalRService = new SignalRService();