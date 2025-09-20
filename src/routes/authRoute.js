import express, { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/createError.js';  // Your existing error util
import prisma from '../lib/prisma.js';
import { z } from 'zod';

const router = express.Router()

const registerUserValidatiorSchema = z.object({
  username: z.coerce.string().trim().toLowerCase().min(3).max(50),
  // email: z.coerce.string().trim().toLowerCase().email(),
  password:z.coerce.string().trim().min(5,{error:"too short"})
})
const loginUserSchema = z.object({
  username: z.coerce.string().toLowerCase().min(3).max(50),
  // email: z.coerce.string().toLowerCase().email(),
  password:z.coerce.string().trim()
})

router.get("/check", (req, res) => {
  res.json({ msg:'check succesfull for auth route'})
})
router.post("/check/logic", (req, res, next) => {
  const data = registerUserValidatiorSchema.safeParse(req.body)
  if (!data.success) { res.status(400).json({ error: data.error }) }
  res.json({ msg: "validation successfull ", data: data.data })
})


router.post("/register",(req, res, next)=> {
  res.json({msg:'you have hit /register user end point'})
})
router.post("/login",(req, res, next)=> {
  res.json({msg:'you have hit /register user end point'})
})

export default router