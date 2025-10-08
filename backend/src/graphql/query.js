import {
  getPostById,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
} from '../services/posts.js'

export const querySchema = `#graphql
type Query {
  test: String
  posts: [Post!]!
  postsByAuthor(username: String!): [Post!]!
  postsByTag(tag: String!): [Post!]!
  postsById(id: ID!): Post
}`

export const queryResolver = {
  Query: {
    test: () => {
      return 'Hello world from GraphQL!'
    },
    posts: async () => {
      return await listAllPosts()
    },
    postsByAuthor: async (parent, { username }) => {
      return await listPostsByAuthor(username)
    },
    postsByTag: async (parent, { tag }) => {
      return await listPostsByTag(tag)
    },
    postsById: async (parent, { id }) => {
      return await getPostById(id)
    },
  },
}
