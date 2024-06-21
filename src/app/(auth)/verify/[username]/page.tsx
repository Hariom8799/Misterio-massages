'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const page = () => {
    const router = useRouter();
    const params = useParams();
    const {toast} = useToast();

    const form = useForm({
        resolver : zodResolver(verifySchema),
    })

    const onSubmit = async (data :any)=>{
        try {
           const response = await axios.post('/api/verify-code', {
                username : params.username,
                code : data.code
           }) 

           toast({
                title : "Success",
                description : response.data.message
           })

           router.replace('/signin');

        } catch (error) {
            const axioserror = error as AxiosError<ApiResponse>
            toast({
              title : "Error",
              description : axioserror.response?.data.message ?? "Error in verifying code",
              variant : "destructive"
            })   
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Acoount
          </h1>
          
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                        <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                        </InputOTP>
                    </FormControl>
                    <FormDescription>
                        Please enter the one-time password sent to your phone.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
        
                <Button type="submit">Submit</Button>
            </form>
            </Form>



        </div>
    </div>
  )
}

export default page