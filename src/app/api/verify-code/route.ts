import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";

export async function POST (request : Request){

    try {   
        await dbConnect();
        const {username , code} = await request.json();
        const decodedUsername = decodeURIComponent(username)
        const user = await userModel.findOne({username : decodedUsername});

        if(!user){
            return Response.json({
                success : false,
                message : "User not found"
            },{status : 404})
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success : true,
                message : "User verified successfully"
            })
        } else if(!isCodeValid){
            return Response.json({
                success : false,
                message : "Invalid code"
            },{status : 400})
        } else {
            return Response.json({
                success : false,
                message : "Code expired"
            },{status : 400})
        }
        
    } catch (error: any) {
        console.log("error in verifying code" , error.message);
        return Response.json({
            success : false,
            message : "error in verifying code"
        },{status : 500}) 
    }
}