import express from 'express'
import prisma from '../lib/prisma.js'
import {createError} from "../utils/createError.js"
import {createTodoSchema} from "../validator/todoValidator.js"
import {updateTodoSchema} from "../validator/todoValidator.js"
import { number } from 'zod'
const router = express.Router()

router.get("/", async (req, res, next) => { // check for the route
  try {
    const allTodo = await prisma.todo.findMany()
    res.json(allTodo)
  } catch (error) {
    next(error)
  }
})  

router.post("/", async(req, res, next) => { // add a todo
  const parseResult = createTodoSchema.safeParse(req.body)
  if (!parseResult.success) { return next(createError(400, parseResult.error.message)) }
  const { title, completed } = parseResult.data;
  
  try {
    const newTodo = await prisma.todo.create({
      data:{
      title, completed: completed ?? false
    }})
    return res.status(201).json(newTodo);
  } catch (error) {
    next(error)
  }
})

router.get("/:id",async (req, res,next) => { // get todo by id 
  
  try {
    const { id } = req.params
    const searchedTodo = await prisma.todo.findUnique({
      where: { id: Number(id) }
    })
    if(!searchedTodo){return res.status(404).json({msg:"todo not found"})}
    res.json(searchedTodo)
  } catch (error) {
    next(error)
  }
})

router.put("/:id", async (req, res, next) => { // put => allows us to update a todo
  const validateUpdateData = updateTodoSchema.safeParse(req.body)
  if(!validateUpdateData.success){return next(createError(400,validateUpdateData.error.message)) }
  const { id } = req.params
  const { title, completed } = validateUpdateData.data
  try {   
    const updateTodo = await prisma.todo.update({
      where: { id: Number(id) },
      data: { title, completed }
    })
    if (!id) { return res.status(404).json({ msg: "todo not found" }) }
    res.json(updateTodo)
  } catch (error) {
    next(error)
  }
})

router.delete("/:id",async (req, res,next) => {
  const { id } = req.params;
try {
  const deletedTodo = await prisma.todo.delete({
    where:{id:Number(id)}
  })
  // const [deleted] = todos.splice(idx, 1);
  res.json({ msg: "todo deleted", deletedTodo });
} catch (error) {
  next(error)
}
});

export default router