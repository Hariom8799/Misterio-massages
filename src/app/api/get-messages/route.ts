import userModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import {User } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {

        const NewUser = await userModel.aggregate([
            {$match : {id : userId}},
            {$unwind : "$messages"},
            {$sort : {"messages.createdAt" : -1}},
            {$group : {_id : "$_id", messages : {$push : "$messages"}}}
        ])

        if(!NewUser){
            return Response.json({
                success : false,
                message : "user not found"
            },{status : 404})
        }

        return Response.json({ 
            success : true,
            messages : NewUser[0].messages
        },{status : 200})
        
    } catch (error) {
        console.log(error);
        return Response.json({
            success : false,
            message : "error in getting the messages"
        },{status : 500})
    }
}