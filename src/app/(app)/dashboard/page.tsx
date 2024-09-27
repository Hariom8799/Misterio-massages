'use client'
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/models/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import axios, { Axios, AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from '@/components/MessageCard';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';


const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const {toast} = useToast();

  const handleDeleteMessage = (messageId : string )=>{
    setMessages(messages.filter((message)=>{
      message._id !== messageId;
    }))
  }

  const {data : session , status} = useSession();

  console.log("Session:", session);

  const form = useForm({
    resolver : zodResolver(acceptMessageSchema)
  })

  const {register , watch, setValue} = form
  const acceptMessages = watch('acceptMessages');
  
  const fetchAcceptMessage = useCallback(async()=>{
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages' , response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title : "Error",
        description : axiosError.response?.data.message || axiosError.message,
        variant : "destructive"
      })
    }
    finally{
      setIsSwitchLoading(false);
    }
  },[setValue,toast])

  const fetchMessages = useCallback(async (refresh : boolean = false)=>{
    setLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      // console.log("Messages:", response.data.message);
      setMessages(response.data.messages || []);
      console.log("Messages:", messages);
      if(refresh){
        toast({
          title : "Messages refreshed",
          description : "Messages have been refreshed successfully",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title : "Error",
        description : axiosError.response?.data.message || axiosError.message,
        variant : "destructive"
      })
    }
    finally{
      setLoading(false);
      setIsSwitchLoading(false);
    }
  },[setMessages , setLoading,toast])

  useEffect(()=>{
    if(!session || !session.user) return 
    fetchAcceptMessage();
    fetchMessages();
  },[fetchAcceptMessage,fetchMessages,status,setValue])

  const handleAcceptMessages = async ()=>{
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages' , {acceptMessages : !acceptMessages})
      setValue('acceptMessages' , !acceptMessages);
      toast({
        title : "Success",
        description : response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title : "Error",
        description : axiosError.response?.data.message || axiosError.message,
        variant : "destructive"
      }) 
    }
  }

  if(!session || !session.user) return <div>Unauthenticated!, please login</div>

  const {username} = session?.user;

  const profileUrl = `${window.location.protocol}//${window.location.host}/u/${username}`;
  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl);
    toast({
      title : "Copied to clipboard",
      description : "Profile URL copied to clipboard",
    })
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleAcceptMessages}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Page