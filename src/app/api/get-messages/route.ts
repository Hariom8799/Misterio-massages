import userModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import {User } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request : Request){
    dbConnect();
    const session = await getServerSession(authOptions);
    // console.log("Session in route:", session);
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
            {$match : {_id : userId}},
            { 
                $addFields: { // Add a field to ensure the messages array is at least an empty array
                    messages: { $ifNull: ["$messages", []] } 
                }
            },
            { $unwind: { // Unwind messages, but preserve users with empty message arrays
                path: "$messages",
                preserveNullAndEmptyArrays: true
            }},
            { $sort: { "messages.createdAt": -1 } }, // Sort messages if they exist
            { 
                $group: { // Group messages back together
                    _id: "$_id", 
                    messages: { $push: "$messages" } 
                } 
            }
        ])

        if(!NewUser || NewUser.length === 0){
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