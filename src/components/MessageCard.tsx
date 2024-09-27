import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import dayjs from 'dayjs';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/models/User'
import { useToast } from './ui/use-toast'
import axios from 'axios'
  
type MessageProps = {
    message : Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({message , onMessageDelete}: MessageProps) => {

    const {toast} = useToast();
    // console.log(message);

    const handleDeleteMessage = async ()=>{

        try{
            const response  = await axios.delete(`/api/delete-message/${message._id}`);
            toast({
                title : "Message Deleted",
                description : response.data.message,
            })
            onMessageDelete(message._id as string);
        }
        catch ( error : any){
            toast({
                title : "Error",
                description : error.response.data.message,
                variant : "destructive"
            })
        }

    }
  return (
    <Card>
        <CardHeader>
            <div className='flex justify-between items-center'>

            
            <CardTitle>{message.message}</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive"><X /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* <CardDescription>Card Description</CardDescription> */}
            </div>
            <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
        </CardHeader>
        <CardContent>
        </CardContent>
        
    </Card>

  )
}

export default MessageCard