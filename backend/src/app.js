import express from 'express'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { typeDefs, resolvers } from './graphql/index.js'
import bodyParser from 'body-parser'
import cors from 'cors'

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

apolloServer
  .start()
  .then(() => app.use('/graphql', expressMiddleware(apolloServer)))

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

export { app }
