import { commitMutation, graphql } from 'react-relay';

const mutation = graphql`
  mutation UpdateStateMutation(
    $bookshelfEntryId: ID!, $state: String!
  ) {
    updateState(bookshelfEntryId: $bookshelfEntryId, state: $state) {
      bookshelfEntry {
        id
        state
      }
    }
  }
`;



export default function updateState(environment, variables, onCompleted = null, onError = null) {
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
