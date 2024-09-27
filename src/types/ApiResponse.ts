import { Message } from "@/models/User";
export interface ApiResponse {
    message : string;
    success : boolean;
    isAcceptingMessages? : boolean;
    messages? : Array<Message>;
}