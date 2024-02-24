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
import { Server } from 'socket.io'
import { Conversation } from './models/schemas/Coversations.schema'
import conversationRouter from './routes/conversations.routes'
import { ObjectId } from 'mongodb'
import { verifyAccessToken } from './utils/commons'
import { UserVerifyStatus } from './constants/enums'
import { TokenPayload } from './models/requests/User.requests'
import HTTP_STATUS from './constants/httpStatus'
import { USERS_MESSAGES } from './constants/message'
import { ErrorWithStatus } from './models/Errors'
// import '~/utils/fake'

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
const port = process.env.PORT || 4000

// Tạo folder upload
initFolder()

app.use(express.json())
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

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

const users: {
  [key: string]: {
    socket_id: string
  }
} = {}

io.use(async (socket, next) => {
  const { Authorization } = socket.handshake.auth
  // Đề phòng phía client gui request mà không có token do 1 lần đầu gọi access_token là undefined
  if (!Authorization) {
    return Authorization
  }

  const access_token = Authorization?.split(' ')[1]
  try {
    const decoded_authorization = await verifyAccessToken(access_token)
    const { verify } = decoded_authorization as TokenPayload
    if (verify !== UserVerifyStatus.Verified) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
    // truyen decoded_authorization vao socket de su dung o cac middleware khac
    socket.handshake.auth.decoded_authorization = decoded_authorization
    socket.handshake.auth.access_token = access_token

    next()
  } catch (error) {
    next({
      name: 'Unauthorized',
      message: 'UnauthorizedError',
      data: error
    })
  }
})

io.on('connection', (socket) => {
  // const user_id = socket.handshake.auth._id
  const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
  users[user_id] = {
    socket_id: socket.id
  }
  console.log(users)

  // Verify access_token khi emit event
  socket.use(async (packet, next) => {
    const { access_token } = socket.handshake.auth
    try {
      await verifyAccessToken(access_token)
      next()
    } catch (error) {
      next(new Error('Unauthorized'))
    }
  })

  socket.on('error', (error) => {
    if (error.message === 'Unauthorized') {
      socket.disconnect()
    }
  })

  socket.on('send_message', async (data) => {
    console.log(data)
    const { receiver_id, sender_id, content } = data.payload
    const receiver_socket_id = users[receiver_id]?.socket_id

    const conversation = new Conversation({
      sender_id: new ObjectId(sender_id),
      receiver_id: new ObjectId(receiver_id),
      content: content
    })

    const result = await databaseService.conversations.insertOne(conversation)
    conversation._id = result.insertedId
    if (receiver_socket_id) {
      socket.to(receiver_socket_id).emit('receiver_message', {
        payload: conversation
      })
    }
  })
  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`user ${socket.id} disconnected`)
    console.log(users)
  })
})

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
