import express, { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/createError.js"; // Your existing error util
import prisma, { resetTodoDatabase } from "../lib/prisma.js";
import { success, z } from "zod";
import { tr } from "zod/locales";

const router = express.Router();

const registerUserValidatiorSchema = z.object({
  username: z.coerce.string().trim().toLowerCase().min(3).max(50),
  // email: z.coerce.string().trim().toLowerCase().email(),
  password: z.coerce.string().trim().min(5, { error: "too short" }),
});
const loginUserSchema = z.object({
  username: z.coerce.string().toLowerCase().min(3).max(50),
  // email: z.coerce.string().toLowerCase().email(),
  password: z.coerce.string().trim(),
});

router.get("/check", (req, res) => {
  // check the status of the route
  res.json({ msg: "check succesfull for auth route" });
});

router.post("/check/logic", (req, res, next) => {
  // checking the basic validation
  const data = registerUserValidatiorSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ error: data.error });
  }
  res.json({ msg: "validation successfull ", data: data.data });
});

router.post("/register", async (req, res, next) => {
  const registerData = registerUserValidatiorSchema.safeParse(req.body);
  if (!registerData.success) {
    res.status(400).json({msg: "we suffered from an error",error: registerData.error})
  } 
  const { username, password } = registerData.data
  try {
    const isUniqueUser = await prisma.user.findUnique({
      where:{username:username}
    })
    if (isUniqueUser) { return res.status(409).json({ msg: "username already taken" }) }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const updateNewUser = await prisma.user.create({
      data: {
        username , password:hashedPassword
      }
    })
    
    // generating the token
    const token = jwt.sign({ userId: updateNewUser.id, username: updateNewUser.username }, process.env.JWT_SECRET, { expiresIn: "24h" })
    res.status(201).json({
      success: true,
      msg: "successfully registered",
      data: {
        id: updateNewUser.id,
        username:updateNewUser.username
      },
      token:token
    })



  } catch (error) {
    next(error)
  }

});
router.post("/login", (req, res, next) => {
  res.json({ msg: "you have hit /register user end point" });
});

export default router;
