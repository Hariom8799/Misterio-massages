import userModel from "@/models/User";
import { sendVerificationEmail } from "@/helpers/sendverificatioemail";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(request : Request){
    try {
        await dbConnect();
        const {username,email,password}= await request.json()
        
        const existingUserByUsernameAndVerified = await userModel.findOne({
            username,
            isVerified : true
        })

        if(existingUserByUsernameAndVerified){
            return Response.json({
                success :false,
                message : "Username already existed"
            },{
                status : 400
            })
        }

        const existingUserByEmail = await userModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success : false,
                    message : "Email already existed"
                },{status : 400})
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserByEmail.save();

            }

        }
        else{
            const hashedPassword = await bcrypt.hash(password,10);
            const codeExpiry = new Date();
            codeExpiry.setHours(codeExpiry.getHours()+1)

            const newUser = new userModel({
                username,
                email,
                password : hashedPassword,
                messages : [],
                isVerified : false,
                verifyCode : verifyCode,
                verifyCodeExpiry : codeExpiry,
                isAcceptingMessages : true
            })

            await newUser.save();

            const emailResponse = await sendVerificationEmail(email,username,verifyCode);

            if(!emailResponse.success){
                return Response.json({
                    success :false,
                    message : emailResponse.message
                },{status : 500} )
            }

            return Response.json({
                success : true,
                message : "User created successfully"
            },{status : 200})
        }


    } catch (error) {
        console.error("Error signing up: ", error);
        return Response.json({
            success : false,
            message : "error in signing up"
        },{
            status : 500
        })
    }
}