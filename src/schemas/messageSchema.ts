import {z} from 'zod';

export const messageSchema = z.object({
    message: z
        .string()
        .min(1,"Message must be at least 1 character")
        .max(300,"Message must be at most 300 characters")
});