"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import axios , {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {toast} = useToast();
  const router = useRouter();

  // importing zod 
  const form = useForm({
    resolver : zodResolver(signInSchema),
    defaultValues : {
      Identifier : "",
      password : ""
    }
  })
  
  const onSubmit = async (data : z.infer<typeof signInSchema>) =>{
    const result = await signIn('credentials',{
      identifier: data.Identifier, // should match the identifier field expected in authorize function
      password: data.password,
      redirect: false
    })

    if(result?.error){
        toast({
            title : "Login Failed",
            description : "Invalid login credentials",
            variant : 'destructive'
        })
    }

    if(result?.url){
        router.replace("/dashboard")
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            
            <FormField
              name="Identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email | Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email | Username" {...field}/>
                    
                  </FormControl>
                  
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin"/> : "Sign In"}
            </Button>
          

          </form>

        </Form>

        <div className="text-center" >
          <p>
            Dont have an account?{' '}
            <Link href="/signup">
              <p className="text-blue-500">Sign Up</p>
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Page