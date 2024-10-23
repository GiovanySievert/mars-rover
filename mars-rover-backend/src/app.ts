import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import roverRoutes from './routes/rover.routes'

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/rovers', roverRoutes)

export default app
