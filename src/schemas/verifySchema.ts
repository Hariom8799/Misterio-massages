import {z} from 'zod';

export const verifySchema = z.object({
    token: z.string(),
});