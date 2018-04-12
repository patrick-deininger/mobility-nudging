/* eslint-disable jsx-a11y/href-no-hash */
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth/utils';
import React from 'react';
import { createFragmentContainer, graphql, commitMutation } from 'react-relay';
import PropTypes from 'prop-types';
import { Message, Grid, Header, Segment, Button, Input, Icon } from 'semantic-ui-react';

import styles from './GroupInviteView.scss';

const CreateInviteMutation = graphql`
  mutation GroupInviteView_CreateInvite_Mutation (
    $groupId: ID!
    $hostId: ID!
    $inviteeEmail: String!
    $inviteeFirstName: String!
    $inviteeLastName: String!
  ) {
    createGroupInvite(groupId: $groupId, hostId: $hostId, inviteeEmail: $inviteeEmail, inviteeFirstName: $inviteeFirstName, inviteeLastName: $inviteeLastName) {
      groupInvite {
        id
      }
    }
  }
`;

class GroupInviteView extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired
  }

  state = { input: { firstName: '', lastName: '', email: '' }, loading: false, isNegative: false, isPositive: false, showMessage: false, message: '' }

  onChangeHandler = (e) => {
    const input = this.state.input;
    const inputName = e.target.id;
    input[inputName] = e.target.value;
    this.setState({ input });
  }

  onSubmitHandler = (ev) => {
    ev.preventDefault();
    this.setState({ ...this.state, loading: true });
    const { input } = this.state;

    const variables = {
      groupId: this.props.viewer.group.id,
      hostId: this.props.viewer.user.id,
      inviteeFirstName: input.firstName,
      inviteeLastName: input.lastName,
      inviteeEmail: input.email
    };

    commitMutation(this.props.relay.environment, {
      mutation: CreateInviteMutation,
      variables,
      onCompleted: (response, err) => {
        console.log(response, err);
        if (err != null) {
          this.showError(err[0].message);
        } else {
          this.showSuccess(`Successfully sent invite to ${variables.inviteeEmail}.`);
        }
      },
      onError: () => {
        this.showError(`Unable to send email to ${variables.inviteeEmail}. Try again later.`);
      },
    });
  }

  showError = (msg) => {
    this.setState({ ...this.state, loading: false, isNegative: true, message: msg, showMessage: true });
    setTimeout(this.resetMessage, 5000);
  }

  showSuccess = (msg) => {
    this.setState({ ...this.state, isPositive: true, message: msg, loading: false, showMessage: true });
    setTimeout(this.resetMessage, 5000);
  }

  resetMessage = () => {
    this.setState({ ...this.state, showMessage: false, isNegative: false, isPositive: false, message: '' });
  }

  render() {
    const group = this.props.viewer.group;
    const { input } = this.state;

    return (
      <Page title='Gutenberg' viewer={this.props.viewer} activeGroup={group.name}>
        <section className={styles.container}>
          <Segment padded='very'>
            <Header as='h1'>New invite</Header>
            <form className={styles.createForm} onSubmit={this.onSubmitHandler}>
              <Grid className={styles.nameFields}>
                <Grid.Row columns={2} className={styles.row}>
                  <Grid.Column className={styles.column}>
                    <Input
                      id='firstName'
                      className={styles.nameField}
                      onChange={this.onChangeHandler}
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
                      className={styles.nameField}
                      onChange={this.onChangeHandler}
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
                fluid
                className={styles.friendEmailInput}
                placeholder='Email address'
                value={input.email}
                type='email'
                id='email'
                size='huge'
                onChange={this.onChangeHandler}
              />

              <Button loading={this.state.loading} type='submit' size='huge' primary fluid><Icon name='send' />Send invite</Button>
              <Message negative={this.state.isNegative} positive={this.state.isPositive} hidden={!this.state.showMessage}>{ this.state.message }</Message>
            </form>
          </Segment>
        </section>
      </Page>
    );
  }
}

export default createFragmentContainer(withAuth(GroupInviteView), graphql`
    fragment GroupInviteView_viewer on Viewer {
      ...Page_viewer
      user {
        id
      }
      group(nameUrl: $nameUrl) {
        id
        name
      }
    }
  `);
