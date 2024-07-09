import userModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import {User } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request :Request){
    dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User

    if(!session || !user){
        return Response.json({
            success : false,
            message : "user is unauthenticated"
        },{status : 401})
    }

    const userId = user._id;

    const {acceptMessages} = await request.json();

    try {
        const updatedUser =  await userModel.findByIdAndUpdate(userId,{isAcceptingMessages : acceptMessages} , {new:true})

        if(!updatedUser){
            return Response.json({
                success : false,
                message : "user not found"
            },{status : 404})
        }

        return Response.json({
            success : true,
            message : "accept messages status changed successfully"
        },{status : 200})

        
    } catch (error) {
        console.log(error);
        return Response.json({
            success : false,
            message : "error in changing the accept messages status"
        },{status : 500})
    }
}

export async function GET(request : Request){
    dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User

    if(!session || !user){
        return Response.json({
            success : false,
            message : "user is unauthenticated"
        },{status : 401})
    }

    const userId = user._id;

    try {
        const foundUser = await userModel.findById(userId);

        if(!foundUser){
            return Response.json({
                success : false,
                message : "user not found"
            },{status : 404})
        }

        return Response.json({
            success : true,
            message : "user found",
            isAcceptingMessages : foundUser.isAcceptingMessages
            
        },{status : 200})
    } catch (error:any) {
        console.log(error);
        return Response.json({ 
            success : false,
            message : "error in finding the user"
        },{status : 500})
    }
}