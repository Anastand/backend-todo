import { z } from 'zod'
export const createTodoSchema = z.object({
  title: z.string().min(1, 'title must be non-empty string'),
  completed: z.boolean().optional()
})