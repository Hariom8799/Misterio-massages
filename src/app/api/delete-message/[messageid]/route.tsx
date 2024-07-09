import userModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import {User } from 'next-auth';
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(request : Request , {params} : {params : {messageid : string}}){
    const messageId = params.messageid;
    dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User

    if(!session || !user){
        return Response.json({
            success : false,
            message : "user is unauthenticated"
        },{status : 401})
    }

    try {
        const updatedResult = await userModel.updateOne(
            {_id : user.id},
            {$pull : {messages : {_id : messageId}}}
        )

        if(updatedResult.modifiedCount === 0){
            return Response.json({
                success : false,
                message : "message not found"
            },{status : 404})
        }
        
        return Response.json({
            success : true,
            message : "message deleted successfully"
        },{status : 200})

    } catch (error) {
        console.log(error);
        return Response.json({
            success : false,
            message : "error in deleting message"
        },{status : 500})
    }
}