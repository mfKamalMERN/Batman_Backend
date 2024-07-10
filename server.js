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
    origin: [`http://localhost:3000`, `https://batman-frontend-pi.vercel.app/home`, `https://batman-frontend-pi.vercel.app/myprofile/:bid`, `https://batman-frontend-pi.vercel.app`, `https://batman-frontend-pi.vercel.app/register`, `https://batman-frontend-pi.vercel.app/home/:batmanid`, `https://batman-frontend-pi.vercel.app/allbatmans`, `http://localhost:3000/home`, `http://localhost:3000/home/:batmanid`, `http://localhost:3000/myprofile/:bid`, `http://localhost:3000/register`, `http://localhost:3000/allbatmans`],

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