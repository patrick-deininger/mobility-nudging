/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import { graphql, createFragmentContainer, commitMutation } from 'react-relay';
import { withAuth } from 'modules/auth/utils';
import Page from 'components/Page/Page';
import { Header, Segment, Button, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import styles from './GroupCreateView.scss';

const CreateGroupMutation = graphql`
  mutation GroupCreateViewMutation (
    $name: String!
    $nameUrl: String!
  ) {
    createGroup(name: $name, nameUrl: $nameUrl) {
      group {
        id
      }
    }
  }
`;

const CreateMembershipMutation = graphql`
  mutation GroupCreateView_Test_Mutation (
    $userId: ID!
    $groupId: ID!
  ) {
    createMembership(userId: $userId, groupId: $groupId) {
      membership {
        id
      }
    }
  }
`;

class GroupCreateView extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  }

  state = { name: '', url: '' }

  onChangeHandler = (ev, { value }) => {
    this.setState({ name: value, url: this.nameToUrl(value) });
  }

  onSubmitHandler = (ev) => {
    ev.preventDefault();

    const groupVars = {
      name: this.state.name,
      nameUrl: this.state.url
    };

    commitMutation(this.props.relay.environment, {
      mutation: CreateGroupMutation,
      variables: groupVars,
      onCompleted: (groupResponse) => {
        const membershipVars = {
          groupId: groupResponse.createGroup.group.id,
          userId: this.props.viewer.user.id
        };
        commitMutation(this.props.relay.environment, {
          mutation: CreateMembershipMutation,
          variables: membershipVars,
          onCompleted: (membershipResponse, membershipErrors) => {
            this.props.router.push(`/group/${groupVars.nameUrl}`);
          },
          onError: (err) => {
            //console.error(err);
          },
        });
      },
      onError: (err) => {
        //console.error(err);
      },
    });
  }

  nameToUrl = name => name.toLowerCase().replace(/ /g, '-')

  render() {
    return (
      <Page title='Gutenberg' viewer={this.props.viewer}>
        <section className={styles.container}>
          <Segment padded='very'>
            <Header as='h1'>New Group</Header>
            <form className={styles.createForm} onSubmit={this.onSubmitHandler}>
              <Input maxLength='25' placeholder='Group name' className={styles.groupNameInput} size='massive' onChange={this.onChangeHandler} />
              <p className={styles.preview}>gutenberg.com/group/<span>{ this.state.url }</span></p>

              <Button className={styles.submitButton} type='submit' size='massive' color='green' fluid>Create group</Button>
            </form>
          </Segment>
        </section>
      </Page>
    );
  }
}

export default createFragmentContainer(
  withAuth(GroupCreateView),
  graphql`
  fragment GroupCreateView_viewer on Viewer {
      user {
        id
      }
      ...Page_viewer
    }
  `
);
