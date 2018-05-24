import { commitMutation, graphql } from 'react-relay';

const mutation = graphql`
  mutation CreateEventMutation(
    $event: String!
    $userId: ID!
    $blockId: ID!
    $sessionId: ID!

    $screen: String!

    $providedFlexibilityTime: Float!
    $targetChargingLevel: Float!
    $chargingLevelRepresentation: String!

  ) {
    createEvent(
       event: $event
       userId: $userId
       blockId: $blockId
       sessionId: $sessionId

       screen: $screen

       providedFlexibilityTime: $providedFlexibilityTime
       targetChargingLevel: $targetChargingLevel
       chargingLevelRepresentation: $chargingLevelRepresentation

     ) {
      event {
        id
      }
    }
  }
`;

export default function createEvent(environment, variables, onCompleted = null, onError = null) {

  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted,
      onError(){
        console.log('error')
      }
    },
  );
}
