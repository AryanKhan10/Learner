import dotenv from 'dotenv'
import express from 'express'
import connectDB from './db/db.js'
import cloud from './db/cloudinary.js'
dotenv.config()

const app = express()
app.use(express.json());
import auth  from "./routes/auth.route.js"
import course  from "./routes/course.js"
import profile  from "./routes/profile.js"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

app.use("/api/v1/auth",auth);
app.use("/api/v1/profile",profile);
app.use("/api/v1/course",course);
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))
app.get("/", (req, res)=>{
    res.send( "<h1>Home Page</h2>" )
})
cloud()
connectDB().then(()=>{
                    app.on("error", () => {
                                console.log("Express app not able to talk: ",error)
                                throw error
                                })
                    app.listen(process.env.PORT, () => {
                        console.log(`Server is listning at ${process.env.PORT}`)
            })

}).catch(err=>{
    console.log("MongoDb connection Error!! ",err)
})



