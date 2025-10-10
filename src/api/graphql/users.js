import { gql } from "@apollo/client/core/index.js";

export const SIGNUP_USER = gql`
  mutation SignupUser($username: String!, $password: String!) {
    signupUser(username: $username, password: $password) {
      username
    }
  }
`;
