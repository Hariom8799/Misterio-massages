import { resend } from "@/lib/resend";
import verificationEmail from '../../emails/verificationemail'
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string
): Promise<ApiResponse>{
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Misterio message || Verification code",
            react: verificationEmail({username, otp: verifyCode}),
        });

        return {success: true, message: "Verification email sent"}
        
    } catch (emailerror) {
        console.error("Error sending verification email: ", emailerror);

        return {success:false , message: "Error sending verification email" }
    }
}