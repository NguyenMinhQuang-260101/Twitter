import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandle } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import cors from 'cors'
import tweetsRouter from './routes/tweets.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
import { createServer } from 'http'
import conversationRouter from './routes/conversations.routes'
import initSocket from './utils/socket'
import YAML from 'yaml'
// import fs from 'fs'
// import path from 'path'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { envConfig } from './constants/config'
// import '~/utils/fake'

// const file = fs.readFileSync(path.resolve('twitter-swagger.yaml'), 'utf8')
// const swaggerDocument = YAML.parse(file)

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'X clone (Twitter API)',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // apis: ['./src/routes/*.routes.ts', './src/models/requests/*.requests.ts'] // files containing annotations as above
  apis: ['./openapi/*.yaml']
}
const openapiSpecification = swaggerJsdoc(options)

config()
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})
const app = express()
const httpServer = createServer(app)
app.use(cors())
const port = envConfig.port

// Tạo folder upload
initFolder()

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/search', searchRouter)
app.use('/conversations', conversationRouter)
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandle)

initSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Code Test Index trong MongoDB
// const mgclient = new MongoClient(
//   `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.5ndsv0f.mongodb.net/?retryWrites=true&w=majority`
// )
// const db = mgclient.db('earth')
// Tạo 1000 document vào collection users
// const users = db.collection('users')
// const userData = []
// function getRandomNumber() {
//   return Math.floor(Math.random() * 100) + 1
// }

// for (let i = 0; i < 1000; i++) {
//   userData.push({
//     name: 'user' + (i + 1),
//     age: getRandomNumber(),
//     sex: i % 2 === 0 ? 'male' : 'female'
//   })
// }
// users.insertMany(userData)
