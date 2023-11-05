import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import pdfRouter from './routes/pdfRouter.js'
import userRouter from './routes/userRouter.js'

dotenv.config()

//Databse connection
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO, connectionParams).then(() => {
    console.log('db connected');
}).catch((error) => {
    console.log(error);
})

const port = 3000;
const app = express();

app.use(express.json())
app.use(cors())
app.use("/files", express.static("files"))
app.use("/edits", express.static("edits"))

//routes
app.use('/api/pdf', pdfRouter)
app.use('/api/user', userRouter)

//error handler
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    console.log(err);
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.listen(port, ()=>{
    console.log('server listening on '+port);
})