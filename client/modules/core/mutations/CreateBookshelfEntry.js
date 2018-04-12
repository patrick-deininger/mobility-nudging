import { commitMutation, graphql } from 'react-relay';

const mutation = graphql`
  mutation CreateBookshelfEntryMutation(
    $userIdInput: ID!, $bookIdInput: ID!, $stateInput: String!, $ratingInput: Int!
  ) {
    createBookshelfEntry(userId: $userIdInput, bookId: $bookIdInput, state: $stateInput, rating: $ratingInput) {
      bookshelfEntry{
        book {
          id
        }
        user {
          id
        }
        state
        rating
      }
    }
  }
`;

export default function createBookshelfEntry(environment, variables, onCompleted = null, onError = null) {
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
