import express from 'express'
import dotenv from 'dotenv'
import loggermiddleware from './middleware/loggermiddleware.js';
import todoRouter from './routes/todoRoute.js'
dotenv.config();
const app = express()
app.use(express.json())
// app.use(loggermiddleware)


let todo = []
let Idcount = 0

app.locals.todo = todo;     
app.locals.Idcount = Idcount;

const PORT = process.env.PORT || 4000

app.use("/api/todo",todoRouter)




app.get("/api/ping", loggermiddleware, (req, res,next) => { // ping route (health check)
  res.json({ ok: true, timestamp: Date.now() });
});


app.get("/check", loggermiddleware, (req, res) => { // check route (example showing middleware + response)
  res.status(200).json({ msg: "check ok" });
});


app.use((err, req, res, next) => { // this is basically a middleware things which can be called by next(variable name to check for errors)
  const status = err && (err.status || err.statusCode) ? (err.status || err.statusCode) : 500
  
  console.log(`ERROR DETECTED : ${err.message}`)
  res.status(status).json({
    error: true,
    message: err.message || "INTERNAL ERROR"
  })
})

app.listen(PORT, () => { console.log(`we are on the port : ${PORT}`) })

