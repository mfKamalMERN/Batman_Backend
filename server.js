import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { ConnectDB } from './ConnectDB/ConnectDB.js'
import { batmanRouter } from './Views/BatmanRouter.js'
import { postRouter } from './Views/PostRouter.js'

const app = express()

app.use(express.static('Public'))

app.use(express.json())

app.use(cors({
    origin: [`http://localhost:3000`, `http://localhost:3000/home`, `http://localhost:3000/myprofile/:bid`],

    methods: [`GET`, `POST`, `PUT`, `DELETE`],

    credentials: true
}))

app.use(bodyParser.json())
app.use(cookieParser())

ConnectDB()

app.use('/', batmanRouter)
app.use('/', postRouter)

const port = 9000

app.listen(port, () => console.log(`Server running at Port ${port}`))