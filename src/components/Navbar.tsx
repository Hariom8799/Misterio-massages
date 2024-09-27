'use client';
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button";

const Page = () => {

    const {data : session} = useSession();

    const user : User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a href="/" className="text-xl font-bold mb-4 md:mb-0">Misterio Messages</a>
            {
                session ? (
                    <>  
                        <span className="mr-4">Welcome, {user.username || user.email}</span>
                        <Button onClick={()=>{signOut()}}>Log Out</Button>
                    </>
                ) : (
                    <Link href='/signin'>
                        <Button className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>LogIn</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Page