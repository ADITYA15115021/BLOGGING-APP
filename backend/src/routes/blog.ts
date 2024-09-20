import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt';
import { createBlogInput, updateBlogInput } from "@aditya-15-kamboj/vlog-common";




export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
    JWT_SECRET: string;
	},
    Variables : {
        userId : number;
    }
}>();

blogRouter.use("/*", async (c,next) => {

    const authHeader = c.req.header("authorization") || "";
    
    try{ 
       const user = await verify(authHeader,c.env.JWT_SECRET);
        if(user){
            
            c.set("userId", user.id as number);
            await next();
        }else{
            c.status(403);
            return c.json({
                message : "you are not logged in" 
            })
        }

    }catch(e){
        c.status(403);
        return c.json({
            message : "you are not logged in "
        })
    }
    
   
})




// route to post a blog
blogRouter.post("/", async (c) => {

    const body = await c.req.json();

    const response = createBlogInput.safeParse(body);
    if(!response.success){
        console.log(response.error.errors);
       c.status(411);
       return c.json({
        message : "inputs are not correct adi" 
       })
    }

    const userId = c.get("userId") ;
   

    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.blog.create({
       data : {
        title : body.title,
        content : body.content,
        authorId : userId
       } 
    })
    
    return c.json({
        id : blog.id
    });
})



//route to update blog

blogRouter.put("/", async (c) => {
  
    const body = await c.req.json();
    const  response = updateBlogInput.safeParse(body);

    if(!response.success){
       c.status(411);
       console.log(response.error.errors);
       return c.json({
        message : "inputs are not correct xyz" 
       })
    }

 
    
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.blog.update({
    where : {
        id : body.id
    },
    data:{
        title:body.title,
        content: body.content
    }
    })

    return c.json({ id:blog.id })
})



//route to disaply title of all the existing blogs  
//pagination -> not returning all the content,returning the first  fews 

blogRouter.get("/bulk", async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

    const blogs = await prisma.blog .findMany({
        select:{
            title:true, content:true, id:true,
            author:{
                select : {
                    name:true
                }
            }
        }
    });   
    return c.json({
        blogs
    }) 
    
})





//route to get the blog of a specific user
blogRouter.get("/:id", async (c) => {
   
    const id = c.req.param("id");
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
    
    try{
       
        const blog = await prisma.blog.findFirst({
            where:{
                id: Number(id)
            }
        })

        return c.json({blog});

    }catch(e){
        c.status(411);
        console.log(e);
        return c.json({
            message : "error while fetching blog"
        })
    }    


})



