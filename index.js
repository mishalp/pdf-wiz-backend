import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import pdfRouter from './routes/pdfRouter.js'
import path from 'path'

dotenv.config()

//Databse connection
mongoose.connect(process.env.MONGO).then(() => {
    console.log('db connected');
}).catch((error) => {
    console.log(error);
})

const port = 3000;
const app = express();

app.use(express.json())
app.use(cors())
app.use("/files", express.static("files"))

//routes
app.use('/api/pdf', pdfRouter)

//error handler
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    console.log(message);
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.listen(port, ()=>{
    console.log('server listening on '+port);
})