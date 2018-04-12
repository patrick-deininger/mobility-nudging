import React from 'react';
import Moment from 'react-moment';
import { createFragmentContainer, graphql, commitMutation } from 'react-relay';
import PropTypes from 'prop-types';
import { withAuth } from 'modules/auth/utils';
import { Button, Item, Icon } from 'semantic-ui-react';

import styles from './ProfileInvitesTab.scss';

const AcceptInviteMutation = graphql`
  mutation ProfileInvitesTab_AcceptInvite_Mutation(
    $inviteIdInput: ID!, $verificationTokenInput: String!
  ) {
    acceptGroupInvite(inviteId: $inviteIdInput, verificationToken: $verificationTokenInput) {
      success
      reason
    }
  }
`;

const CreateMembershipMutation = graphql`
  mutation ProfileInvitesTab_CreateMembership_Mutation (
    $userId: ID!
    $groupId: ID!
    $inviteId: ID!
  ) {
    createMembership(userId: $userId, groupId: $groupId, inviteId: $inviteId) {
      membership {
        id
      }
    }
  }
`;

class ProfileInvitesTab extends React.Component {
  static defaultProps = {
    visible: true
  };
  static propTypes = {
    visible: PropTypes.bool,
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired
  };

  state = { invites: this.props.viewer.user.receivedInvites.edges };

  acceptInvite = (e) => {
    const i = e.node;

    const { user } = this.props.viewer;
    let variables = {
      groupId: i.group.id,
      userId: user.id,
      inviteId: i.id
    };

    commitMutation(this.props.relay.environment, {
      mutation: CreateMembershipMutation,
      variables,
      onCompleted: () => {
        variables = {
          inviteIdInput: i.id,
          verificationTokenInput: i.verificationToken
        };

        commitMutation(this.props.relay.environment, {
          mutation: AcceptInviteMutation,
          variables,
          onCompleted: (response) => {
            const obj = response.acceptGroupInvite;
            if (!obj.success) {
              //this.setState({ ...this.state, showError: true, errors: [obj.reason] });
              //return;
            } else {
              this.setState(prevState => ({ ...prevState, invites: prevState.invites.filter(ee => ee !== e) }));
            }
          }

          //onError: () => {
            //this.setErrors(['Unable to accept user to group. Try again later.']);
          //}
        });
      },
      //onError: () => {
        //this.setErrors(['Unable to add user to group. Try again later.']);
      //}
    });
  }

  render() {
    const { visible } = this.props;
    if (!visible) {
      return null;
    }
    const receivedInvitesEdges = this.state.invites;
    const hasInvites = receivedInvitesEdges.length > 0;

    return (
      <div className={[styles.root, hasInvites ? '' : styles.empty].join(' ')}>
        { !hasInvites ?
        <div className={styles.emptyMessageWrap}>
          <h1>
            No open invites
          </h1>
        </div>
        :
          <Item.Group divided>
            {
            receivedInvitesEdges.map(e =>
              <Item key={e.node.id}>
                <Item.Content>
                  <Item.Header>{ e.node.group.name }</Item.Header>
                  <Item.Description>{ `${e.node.createdBy.firstName} ${e.node.createdBy.lastName}` } invited you.
                    <Button basic color='green' floated='right' onClick={() => this.acceptInvite(e)}>
                    Accept
                  </Button>
                  </Item.Description>
                  <Item.Extra>
                    <Icon name='calendar'/>
                    <Moment fromNow>{ e.node.createdAt }</Moment>
                  </Item.Extra>
                </Item.Content>
              </Item>
              )
            }
          </Item.Group>
        }
      </div>
    );
  }
}

export default createFragmentContainer(ProfileInvitesTab, graphql`
  fragment ProfileInvitesTab_viewer on Viewer @argumentDefinitions(email: { type: "String" }) {
    user {
      id
      receivedInvites(consumed: false) {
        edges {
          node {
            id
            firstName
            lastName
            email
            createdAt
            verificationToken
            group {
              id
              name
            }
            createdBy {
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`);
