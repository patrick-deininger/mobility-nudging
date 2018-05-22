import {commitMutation, graphql} from 'react-relay';


const mutation = graphql`
  mutation CreateSessionMutation (
    $user: ID!
    $sessionConfig: ID!
  ) {
    createSession(user: $user, sessionConfig: $sessionConfig) {
      session {
        id
      }
    }
  }
`;

export default function createSession(environment, variables, onCompleted = null, onError = null) {
  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted,
      onError
    }
  );
}
