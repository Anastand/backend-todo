import express from 'express'
import dotenv from 'dotenv'
import loggermiddleware from './middleware/loggermiddleware.js';
dotenv.config();
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 4000

app.get("/", (req, res) => {
  res.json({msg:'hello from /get'})
})

app.get("/check",loggermiddleware, (req, res) => {
  res.status(201)
})

app.listen(PORT,()=>{console.log(`we are on the port : ${PORT}`)})