import CredentialsProvider from "next-auth/providers/credentials";
import userModel from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";

export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id : "credentials",
            name : "Credentials",

            credentials:{
                email : {label : "Email", type : "email"},
                password : {label : "Password", type : "password"}
            },
            
            async authorize(credentials:any) : Promise<any>{
                await dbConnect();
                console.log("Credentials:", credentials);
                try {
                    
                    const user = await userModel.findOne({
                        $or : [
                            {email : credentials.email},
                            {username : credentials.identifier}
                        ]
                    })

                    console.log("User found:", user);

                    if(!user){
                        throw new Error("No user found");
                    }

                    if(!user.isVerified){
                        throw new Error("User not verified");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password);

                    console.log("Is password correct:", isPasswordCorrect);

                    if(isPasswordCorrect){
                        return user;
                    }

                    else{
                        throw new Error("Password incorrect");
                    }

                } catch (err :any) {
                    throw new Error("Error in authorize function");
                }
            }
        })
    ],

    callbacks : {
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            
            return token
        },
        async session({ session, token }) {
            if (token) {
              session.user._id = token._id;
              session.user.isVerified = token.isVerified;
              session.user.isAcceptingMessages = token.isAcceptingMessages;
              session.user.username = token.username;
            }
            return session;
          },
          
    },

    session : {
        strategy : "jwt",
    },

    secret : process.env.NEXTAUTH_SECRET,

    pages:{
        signIn : "/signin",
    }
}