import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import loginRouter from './controllers/login.js'
//import userRouter from './controllers/user.js'

const PORT = 3001
const app = express()

app.use(cors())
app.use(express.json())
app.use('/', loginRouter)
//app.use('/', userRouter)

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connection to MongoDB:', error.message)
  })

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))
