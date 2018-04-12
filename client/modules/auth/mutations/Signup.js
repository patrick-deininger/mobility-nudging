const {
  commitMutation,
  graphql,
} = require('react-relay')
import { setToken } from '../jwtUtils';


function loginUser(setErrors, response, onSuccess) {
  const { login, signup } = response;
  response = login || signup;
  response = response.authFormPayload;
  if (response.__typename === "FormErrors") {
    setErrors(response.errors);
  }
  else if (response.__typename === "Viewer") {
    setToken(response.tokens.token, response.user, onSuccess);
  }
}

const mutation = graphql`
    mutation SignupUserMutation(
    $input: SignupUserMutationInput!
    ) {
        signup(input : $input) {
            authFormPayload {
                    __typename
                    ... on Viewer{
                        tokens {
                            __typename
                            ... on TokensSuccess {
                                token
                            }
                        }
                      user {
                        id
                      }
                    }
                    ... on FormErrors {
                      errors {
                        key 
                        message
                      }
                    }
                }
        }
    }
`

function Signup(environment, setErrors, onSuccess, input: { email: string, password: string, firstName: string, lastName: string }) {
  commitMutation(
    environment,
    {
      mutation,
      onCompleted: response => loginUser(setErrors, response, onSuccess),
      variables: {
        input
      }
    },
  )
}

export default Signup
