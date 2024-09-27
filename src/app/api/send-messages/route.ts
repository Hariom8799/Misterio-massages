import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request :Request){
    await dbConnect();
    try {
        const { message, username } = await request.json();

        const user = await userModel.findOne({username})

        if(!user){
            return Response.json({
                success : false,
                message : "user not found"
            },{status : 404})
        }

        if(!user.isAcceptingMessages){
            return Response.json({
                success : false,
                message : "user is not accepting messages"
            },{status : 400})
        }

        const newMessage = {message, createdAt : new Date()}
        user.messages.push(newMessage as Message)
        await user.save();

        return Response.json({
            success : true,
            message : "message sent successfully"
        },{status : 200})

    } catch (error :any) {
        console.log(error); 
        return Response.json({
            success : false,
            message : error.message || "error in sending the message"
        },{status : 500})
    }
}