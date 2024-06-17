import {z} from 'zod';

export  const signInSchema = z.object({
    Identifier: z.string(),
    password: z.string().min(8,{message:"Password must be at least 8 characters"}),
}); 