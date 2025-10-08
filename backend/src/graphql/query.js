export const querySchema = `#graphql
type Query {
  test: String
}`

export const queryResolver = {
  Query: {
    test: () => {
      return 'Hello world from GraphQL!'
    },
  },
}
