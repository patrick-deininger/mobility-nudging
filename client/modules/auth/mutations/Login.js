import { ConnectionHandler } from 'relay-runtime';
import { setToken } from '../jwtUtils';

const {
  commitMutation,
  graphql,
} = require('react-relay');

const mutation = graphql`
    mutation LoginMutation(
    $input: LoginMutationInput!
    ) {
        login(input : $input) {
            authFormPayload{
                    __typename
                    ... on Viewer{
                        tokens {
                            __typename
                            ... on TokensSuccess {
                                token
                            }
                            ... on TokenError {
                                error
                            }
                        }
                        user {
                            id
                        }
                    }
                }
        }
    }
`;

function Login(environment, setErrors, onSuccess, input: {email: string, password: string}) {
  commitMutation(
    environment,
    {
      mutation,
      onCompleted: response => setToken(response.login.authFormPayload.tokens.token, response.login.authFormPayload.user, onSuccess),
      variables: {
        input
      }
    },
  );
}

export default Login;
