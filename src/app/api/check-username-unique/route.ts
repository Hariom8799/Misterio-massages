import userModel from "@/models/User";
import {z} from "zod";
import {usernameValidation} from "@/schemas/signUpSchema";
import dbConnect from "@/lib/dbConnect";

const usernameQuerySchema = z.object({
    username : usernameValidation,
})

export async function GET (request : Request){
    try {

        await dbConnect();
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username : searchParams.get("username")
        }

        const result = usernameQuerySchema.safeParse(queryParam);

        if(!result.success){
            const usernameError = result.error.format().username?._errors || [];

            return Response.json({
                success : false,
                message : usernameError?.length > 0 ? usernameError.join(", ") : "Invalid username"
            },{status : 400})
        }

        const {username } = result.data;
        const existingVerifiedUser = await userModel.findOne({username, isVerified:true});

        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message : "Username is already taken"
            },{status : 400})
        
        }

        return Response.json({
            success : true,
            message : "Username is unique"
        })
        
    } catch (error: any) {
        console.log(error.message);

        return Response.json({
            success : false,
            message : "error in checking username uniqueness"
        })
    }
}