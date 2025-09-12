import express from 'express'
import dotenv from 'dotenv'
import loggermiddleware from './middleware/loggermiddleware.js';
import todoRouter from './routes/todoRoute.js'
dotenv.config();
const app = express()
app.use(express.json())


let todo = []
let Idcount = 0

app.locals.todo = todo;     
app.locals.Idcount = Idcount;

const PORT = process.env.PORT || 4000

app.use("/api/todo",todoRouter)




app.get("/api/ping", loggermiddleware, (req, res) => { // ping route (health check)
  res.json({ ok: true, timestamp: Date.now() });
});


app.get("/check", loggermiddleware, (req, res) => { // check route (example showing middleware + response)
  res.status(200).json({ msg: "check ok" });
});

app.listen(PORT, () => { console.log(`we are on the port : ${PORT}`) })

