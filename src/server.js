import express from 'express'
import dotenv from 'dotenv'
import loggermiddleware from './middleware/loggermiddleware.js';
dotenv.config();
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 4000


app.get("/api/ping", loggermiddleware, (req, res) => { // ping route (health check)
  res.json({ ok: true, timestamp: Date.now() });
});


app.get("/check", loggermiddleware, (req, res) => { // check route (example showing middleware + response)
  res.status(200).json({ msg: "check ok" });
});

app.listen(PORT, () => { console.log(`we are on the port : ${PORT}`) })

