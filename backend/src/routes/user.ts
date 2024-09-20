import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt';

import { signupInput, signinInput } from "@aditya-15-kamboj/vlog-common";




export const userRouter = new Hono<{ 
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string
	}
}>();




userRouter.post('/signup', async (c) => {

    const body = await c.req.json();

    const response = signupInput.safeParse(body);
    if(!response.success){
        console.log(response.error)
        c.status(411);
        return c.text("input not correct");
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
   
    try{
    const  user = await prisma.user.create({
      data : {
        username : body.username,
        password : body.password,
        name : body.name
      }
    })
  
    const token =  await sign( {id:user.id}, c.env.JWT_SECRET )
    return c.text(token);

    }catch(e){
        console.log(e);
        c.status(411);
        return c.text("Invalid");
    } 
  
  })
  
  
    
  
userRouter.post('/signin',  async (c) => {

    const body = await c.req.json();
    const {success} = signinInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.text("input not correct");
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
  
    const user = await prisma.user.findUnique({
      where : {
        username : body.username,
        password: body.pasword
      }
    })
  
    if( !user){
      c.status(403)
      return c.text("user not founnd")
    }
  
    const  jwt = await sign( {id:user.id},c.env.JWT_SECRET)
    return c.text( jwt); 
  
    
  })



