import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import fs from 'fs'
import router from './routes/api.js'
import './models/modrels.js'
import { UPLOAD_PATH } from './utils/paths.js'

const app = express()

const logfile = 'access.log'
var accessLogStream = fs.createWriteStream(logfile, { flags: 'a' })
app.use('/images', express.static(UPLOAD_PATH))
app.use(morgan('dev', { stream: accessLogStream }))
app.use(cors())
app.use(express.json())
app.use('/api', router);

export default app
