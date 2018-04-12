import { commitMutation, graphql } from 'react-relay';

const mutation = graphql`
  mutation UpdateRatingMutation(
    $bookshelfEntryId: ID!, $rating: Int!
  ) {
    updateRating(bookshelfEntryId: $bookshelfEntryId, rating: $rating) {
      bookshelfEntry {
        id
        rating
      }
    }
  }
`;



export default function updateRating(environment, variables, onCompleted = null, onError = null) {
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
