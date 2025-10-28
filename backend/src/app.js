import express from 'express'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { typeDefs, resolvers } from './graphql/index.js'
import { optionalAuth } from './middleware/jwt.js'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'
import cors from 'cors'
import { handleSocket } from './socket.js'

const app = express()
app.use(cors())
app.use(bodyParser.json())
postsRoutes(app)
userRoutes(app)
eventRoutes(app)

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

apolloServer.start().then(() =>
  app.use(
    '/graphql',
    optionalAuth,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        return { auth: req.auth }
      },
    }),
  ),
)

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

handleSocket(io)

export { server as app }
