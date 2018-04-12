import { commitMutation, graphql } from 'react-relay';

const mutation = graphql`
  mutation CreateBookRecommendationForFriendMutation(
    $hostId: ID!,
    $bookTitle: String!,
    $bookAuthor: String!,
    $friendEmail: String!,
    $firstName: String!,
    $lastName: String!
  ) {
    createBookRecommendationForFriend(
      hostId: $hostId,
      bookTitle: $bookTitle,
      bookAuthor:$bookAuthor,
      friendEmail: $friendEmail,
      firstName: $firstName,
      lastName: $lastName
      ) {
      bookRecommendationForFriend {

        bookTitle
        bookAuthor
        friendEmail
        firstName
        lastName
      }
    }
  }
`;


export default function CreateBookRecommendationForFriend(environment, variables, onCompleted = null, onError = null) {
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
