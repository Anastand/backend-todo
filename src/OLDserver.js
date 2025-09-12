import express from 'express'
import dotenv from 'dotenv'
import loggermiddleware from './middleware/loggermiddleware.js';
dotenv.config();
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 4000

let todo = []
let Idcount=0

app.post("/api/todo", (req, res) => { // post to used to update the data
  console.log(todo)
  const { title } = req.body
  if (!title) { return res.status(400).json({ msg: "no title found to add" }) }
  const todoToadd = { id: Idcount++, title, completed: false }
  todo.push(todoToadd)
  res.json({msg:"todo added"},{todo})
})

app.get("/api/todo", (req, res) => {
  res.json(todo)
})

app.get("/api/todo/:id", (req, res) => { // get todo by id 
  const { id } = req.params
  const searchedTodo = todo.find(t => t.id == Number(id))
  if (!searchedTodo) { return res.status(404).json({ msg: "coudn't find the id" }) }
  console.log(`found the value: ${searchedTodo}`)
  res.json(searchedTodo)
})

app.put("/api/todo/:id", (req, res) => { //put allows us to update
  const { id } = req.params
  const {title,completed} = req.body
  const searchedTodo = todo.find(t => t.id === Number(id))
  if (!searchedTodo) { return res.status(404).json({ msg: "todo not found" }) }
  if (title != undefined) searchedTodo.title = title
  if (completed != undefined) searchedTodo.completed = completed
  res.json(searchedTodo)
})

app.delete("/api/todo/:id", (req, res) => {
  const { id } = req.params
  const idx = todo.findIndex(t => t.id === Number(id))
  if (idx == -1) { return res.status(404).json({ msg: "todo not found" }) }
  const [delted] = todo.splice(idx, 1)
  res.status(200).json({msg:"deleted element :",delted})
})


app.get("/api/ping", loggermiddleware, (req, res) => { // ping route (health check)
  res.json({ ok: true, timestamp: Date.now() });
});


app.get("/check", loggermiddleware, (req, res) => { // check route (example showing middleware + response)
  res.status(200).json({ msg: "check ok" });
});

app.listen(PORT, () => { console.log(`we are on the port : ${PORT}`) })

