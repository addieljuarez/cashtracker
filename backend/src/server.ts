import express from 'express'
import colors from 'colors'
import morgan from 'morgan'

const app = express()

// middlewares

app.use(morgan(dev))
app.use(express.json())


export default app
