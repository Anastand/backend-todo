import express from 'express'
import {createError} from "../utils/createError.js"
import {createTodoSchema} from "../validator/todoValidator.js"
import {updateTodoSchema} from "../validator/todoValidator.js"
const router = express.Router()

router.get("/test", (req, res) => { // check for the route
  res.json({msg:"works from todo router"})
})

router.post("/", (req, res, next) => { // add a todo
  const parseResult = createTodoSchema.safeParse(req.body)
  if (!parseResult.success) {
    return next(createError(400, parseResult.error.message))
  }
  const todos = req.app.locals.todo || [];
  const { title , completed } = parseResult.data;

  // read & increment the shared counter on app.locals
  const nextId = req.app.locals.Idcount !== undefined ? req.app.locals.Idcount++ : 0;

  const todoToAdd = { id: nextId, title, completed: false };
  todos.push(todoToAdd);

  // make sure the shared array reflects the change (it already does because todos references the same array)
  // respond with the created resource and 201 status
  return res.status(201).json(todoToAdd);
});

router.get("/", (req, res) => { // get all todo
  const todo = req.app.locals.todo || [];
  res.json(todo)
})

router.get("/:id", (req, res) => { // get todo by id 
  const todo = req.app.locals.todo || [];
  const { id } = req.params
  const searchedTodo = todo.find(t => t.id == Number(id))
  if (!searchedTodo) { return res.status(404).json({ msg: "coudn't find the id" }) }
  console.log(`found the value: ${searchedTodo}`)
  res.json(searchedTodo)
})

router.put("/:id", (req, res, next) => { // put => allows us to update a todo
  const validateUpdateData = updateTodoSchema.safeParse(req.body)
  if(!validateUpdateData.success){return next(createError(400,validateUpdateData.error.message)) }
  const todo = req.app.locals.todo || [];
  const { id } = req.params
  const {title,completed} = validateUpdateData.data
  const searchedTodo = todo.find(t => t.id === Number(id))
  if (!searchedTodo) { return res.status(404).json({ msg: "todo not found" }) }
  if (title != undefined) searchedTodo.title = title
  if (completed != undefined) searchedTodo.completed = completed
  res.json(searchedTodo)
})

router.delete("/:id", (req, res) => {
  const todos = req.app.locals.todo || [];
  const { id } = req.params;
  const idx = todos.findIndex(t => t.id === Number(id));
  if (idx === -1) return res.status(404).json({ msg: "todo not found" });
  const [deleted] = todos.splice(idx, 1);
  return res.json({ msg: "todo deleted", deleted });
});

export default router