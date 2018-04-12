import { commitMutation, graphql } from 'react-relay';

const mutation = graphql`
  mutation CreateBookMutation(
    $titleInput: String!, $authorInput: String!
  ) {
    createBook(title: $titleInput, author: $authorInput) {
      book {
        title
        author
      }
    }
  }
`;

export default function createBook(environment, variables, onCompleted = null, onError = null) {
  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted,
      onError
    },
  );
}
