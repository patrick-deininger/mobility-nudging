/* eslint-disable jsx-a11y/href-no-hash */
import Page from 'components/Page/Page';
import React from 'react';
import { routerShape } from 'found/lib/PropTypes';
import { createFragmentContainer, graphql, commitMutation } from 'react-relay';
import PropTypes from 'prop-types';
import { Button, Input, Grid, Message } from 'semantic-ui-react';
import SignupUserMutation from '../../auth/mutations/Signup';

import styles from './AcceptGroupInviteView.scss';

const AcceptInviteMutation = graphql`
  mutation AcceptGroupInviteView_AcceptInvite_Mutation(
    $inviteIdInput: ID!, $verificationTokenInput: String!
  ) {
    acceptGroupInvite(inviteId: $inviteIdInput, verificationToken: $verificationTokenInput) {
      success
      reason
    }
  }
`;

const CreateMembershipMutation = graphql`
  mutation AcceptGroupInviteView_CreateMembership_Mutation (
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

class AcceptGroupInviteView extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    router: routerShape.isRequired
  }

  state = { input: { }, showError: false, errors: [] }

  componentWillMount = () => {
    const input = this.state.input;
    const invite = this.props.viewer.groupInvite;
    const user = this.props.viewer.user;
    input.email = invite.email;
    input.firstName = invite.firstName;
    input.lastName = invite.lastName;
    this.setState({ input });

    if (user.email === invite.email) {
      let variables = {
        inviteIdInput: invite.id,
        verificationTokenInput: this.props.params.verificationToken
      };

      commitMutation(this.props.relay.environment, {
        mutation: AcceptInviteMutation,
        variables,
        onCompleted: (response) => {
          const obj = response.acceptGroupInvite;
          if (!obj.success) {
            this.setState({ ...this.state, showError: true, errors: [obj.reason] });
            return;
          }

          variables = {
            groupId: invite.group.id,
            userId: user.id,
            inviteId: invite.id
          };
          commitMutation(this.props.relay.environment, {
            mutation: CreateMembershipMutation,
            variables,
            onError: () => {
              this.setErrors(['Unable to add user to group. Try again later.']);
            }
          });
        }
      });
    }
  }

  onSubmitHandler = (ev) => {
    ev.preventDefault();
    const invite = this.props.viewer.groupInvite;

    const variables = {
      inviteIdInput: invite.id,
      verificationTokenInput: this.props.params.verificationToken
    };

    commitMutation(this.props.relay.environment, {
      mutation: AcceptInviteMutation,
      variables,
      onCompleted: this.onCompletedAcceptInvite
    });
  }

  onCompletedAcceptInvite = (response) => {
    const obj = response.acceptGroupInvite;
    if (!obj.success) {
      this.setState({ ...this.state, showError: true, errors: [obj.reason] });
    } else {
      SignupUserMutation(this.props.relay.environment, this.onValidationErrors, this.onSuccessfulLogin, this.state.input);
    }
  }

  onSuccessfulLogin = (user) => {
    const variables = {
      groupId: this.props.viewer.groupInvite.group.id,
      userId: user.id,
      inviteId: this.props.viewer.groupInvite.id
    };
    commitMutation(this.props.relay.environment, {
      mutation: CreateMembershipMutation,
      variables,
      onCompleted: () => {
        this.props.router.replace(`/group/${this.props.viewer.groupInvite.group.nameUrl}`);
      },
      onError: () => {
        this.setErrors(['Unable to add user to group. Try again later.']);
      },
    });
  }

  onDismiss = () => {
    this.setState({ ...this.state, showError: false });
  }

  onValidationErrors = (errors) => {
    this.setState({ ...this.state, showError: true, errors: errors.map(e => e.message) });
  }

  setErrors = (errors) => {
    this.setState({ ...this.state, showError: true, errors });
  }

  handleFieldChange = (e) => {
    const input = this.state.input;
    const inputName = e.target.id;
    input[inputName] = e.target.value;
    this.setState({ input });
  }

  render() {
    const { input } = this.state;
    const invite = this.props.viewer.groupInvite;
    const { user } = this.props.viewer;

    if (user.email === invite.email) {
      return (
        <Page viewer={this.props.viewer} title='Accept invite'>
          <div className={styles.container}>
            <Message hidden={this.state.showError} size='massive' positive>You accepted the invite.</Message>
            <Message negative size='massive' list={this.state.errors} hidden={!this.state.showError} />
          </div>
        </Page>
      );
    }

    if (invite.invitee) {
      return (
        <Page viewer={this.props.viewer} title='Accept invite'>
          <div className={styles.container}>
            <Message size='massive' info>Please log in to accept the invite.</Message>
          </div>
        </Page>
      );
    }

    return (
      <Page viewer={this.props.viewer} title='Accept invite'>
        <div className={styles.container}>
          { invite.consumed ?
            <Message size='massive' negative>The invite has already been accepted.</Message>
            :
            <div>
              <header className={styles.head}>
                <h1>Join { invite.group.name }</h1>
                <p>{ invite.createdBy.firstName } { invite.createdBy.lastName } invited you.</p>
              </header>
              <form
                id='accept_invite'
                onSubmit={this.onSubmitHandler}
                className={styles.form}
              >
                <Grid className={styles.nameFields}>
                  <Grid.Row columns={2} className={styles.row}>
                    <Grid.Column className={styles.column}>
                      <Input
                        id='firstName'
                        onChange={this.handleFieldChange.bind(this)}
                        className={styles.nameField}
                        value={input.firstName}
                        type='text'
                        size='huge'
                        fluid
                        required
                        placeholder='First name'
                      />
                    </Grid.Column>
                    <Grid.Column className={styles.column}>
                      <Input
                        id='lastName'
                        onChange={this.handleFieldChange.bind(this)}
                        className={styles.nameField}
                        value={input.lastName}
                        type='text'
                        size='huge'
                        fluid
                        required
                        placeholder='Last name'
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <Input
                  id='email'
                  className={`${styles.textFields} email_input`}
                  onChange={this.handleFieldChange}
                  value={input.email}
                  type='email'
                  size='huge'
                  required
                  placeholder='Email'
                />

                <br />

                <Input
                  id='password'
                  className={styles.textFields}
                  onChange={this.handleFieldChange.bind(this)}
                  placeholder='Password'
                  type='password'
                  size='huge'
                  minLength={8}
                  required
                />

                <Button
                  color='green'
                  fluid
                  type='submit'
                  size='huge'
                  className='button_submit-signup-form'
                >
                  Join
                </Button>
              </form>
              <Message negative header='Error' list={this.state.errors} hidden={!this.state.showError} onDismiss={this.onDismiss}>
              </Message>
            </div>
          }
        </div>
      </Page>
    );
  }
}

export default createFragmentContainer(AcceptGroupInviteView, graphql`
    fragment AcceptGroupInviteView_viewer on Viewer {
      ...Page_viewer
      user {
        id
        email
      }
      groupInvite(verificationToken: $verificationToken) {
        id
        group {
          id
          name
          nameUrl
        }
        firstName
        lastName
        createdBy {
          firstName
          lastName
        }
        email
        invitee {
          id
        }
      }
    }
  `);
