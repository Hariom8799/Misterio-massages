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
import { signUpSchema } from "@/schemas/signUpSchema"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const Page = () => {
  const [username, setUsername] = useState('')  
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300)
  const {toast} = useToast();
  const router = useRouter();

  // importing zod 
  const form = useForm({
    resolver : zodResolver(signUpSchema),
    defaultValues : {
      username : "",
      email : "",
      password : ""
    }
  })

  useEffect(()=>{
    const checkusernameUniqueness = async ()=>{
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {

          const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message);
          
        } catch (error) {
          const axioserror = error as AxiosError<ApiResponse>
          setUsernameMessage(axioserror.response?.data.message ?? "error in checking username")
        }
        finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkusernameUniqueness();
  },[username])
  
  const onSubmit = async (data : z.infer<typeof signUpSchema>) =>{
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/signup',data)
      toast({
        title : "Singn Up Successfuly",
        description : response.data.message,
      })
      router.replace(`/verify/${username}`)
    } catch (error) {
      const axioserror = error as AxiosError<ApiResponse>
      toast({
        title : "Error",
        description : axioserror.response?.data.message ?? "Error in signing up",
        variant : "destructive"
      }) 
    }
    finally{
      setIsSubmitting(false)
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field}
                      onChange={(e)=>{
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                    
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin"/>}
                    {!isCheckingUsername && usernameMessage && (
                      <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>
                        {usernameMessage}
                      </p>
                    )}
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field}/>
                    
                  </FormControl>
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
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
              {isSubmitting ? <Loader2 className="animate-spin"/> : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="text-center" >
          <p>
            Already have an account? 
            <Link href="/signin">
              <p className="text-blue-500">Login</p>
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Page