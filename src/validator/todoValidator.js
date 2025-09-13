import { z } from 'zod'
export const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'title must be non-empty string'),
  completed: z.boolean().optional()
})

export const updateTodoSchema = z.object({
  title: z.string().trim().min(1, "title must be a non-empty string").optional(),
  completed: z.boolean().optional()
});