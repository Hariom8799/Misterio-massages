import mongoose , {Schema,Document} from "mongoose";

export interface Message extends Document{
    message : string;
    createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema({
    message :{
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
})

export interface User extends Document{
    username : string;
    email : string;
    password : string;
    messages : Message[];
    isVerified : boolean;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isAcceptingMessages : boolean;
}

const UserSchema : Schema<User> = new Schema({
    username:{
        type : String,
        required : [true,"Please provide a username"],
        trim : true,
        unique : true,
    },
    email : {
        type : String,
        required : [true,"Please provide an email"],
        unique : true,
        match : [/.+\@.+\..+/,"Please provide a valid email"]
    },
    password :{
        type : String,
        required : [true,"Please provide a password"],
    },
    verifyCode :{
        type : String,
        required : true
    },
    verifyCodeExpiry : {
        type : Date,
        required : true
    },
    isVerified : {
        type : Boolean,
        required : true,
        default : false
    },
    isAcceptingMessages : {
        type : Boolean,
        required : true,
        default : true
    },
    messages : [MessageSchema]   
    
})

const userModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema);

export default userModel;