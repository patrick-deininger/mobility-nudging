import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth/utils';
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { Link } from 'found';
import { Segment, Button, Header, Table, Rating, Grid } from 'semantic-ui-react';

import styles from './GroupView.scss';

import UserAvatar from '../../../components/UserAvatar/UserAvatar.js';
import GroupInvitationButton from '../../../components/GroupInvitationButton/GroupInvitationButton.js';

class GroupView extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired
  }

  render() {
    const { group, user } = this.props.viewer;
    const inviteLink = `/group/${group.nameUrl}/invite`;
    const members = group.members.edges;

    return (
      <Page title='Gutenberg' viewer={this.props.viewer} activeGroup={group.name}>
        <section className={styles.container}>
          <Segment attached='top' padded='very'>
            {members.length === 1 ?
              <div className={styles.inviteNudge}>
                <Header className={styles.text} size='huge'>{user.firstName}, it's only you.<span className={styles.emoji}></span></Header>
                <Button className={styles.btn} size='massive' as={Link} to={inviteLink} primary>Invite friends</Button>
              </div>
              :
              <div>
                <Grid>
                  <Grid.Column floated="left" width={4}>
                    <div className={styles.groupInfo}>
                      <Header as='h1'>{group.name}</Header>
                    </div>
                  </Grid.Column>
                  <Grid.Column floated="right" width={12}>
                    <div className={styles.memberAvatars}>
                      <GroupInvitationButton onClick={() => this.props.router.push(inviteLink)} />
                      {members.map(m =>
                        <UserAvatar key={m.node.id} user={m.node} showPopup className={styles.avatar} />
                      )}
                    </div>
                  </Grid.Column>
                </Grid>
                <Header as='h1'>Books</Header>
                <Table singleLine className={styles.books}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>User</Table.HeaderCell>
                      <Table.HeaderCell>Title</Table.HeaderCell>
                      <Table.HeaderCell>Author</Table.HeaderCell>
                      <Table.HeaderCell>Rating</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>

                    {members.map(m =>
                      m.node.books &&
                      m.node.books.edges.map(e =>
                        <Table.Row key={e.node.id}>
                          <Table.Cell>{m.node.firstName}</Table.Cell>
                          <Table.Cell>{e.node.book.title}</Table.Cell>
                          <Table.Cell>{e.node.book.author}</Table.Cell>
                          <Table.Cell>
                            <Rating disabled rating={e.node.rating} maxRating={5} className={styles.rating}/>
                          </Table.Cell>
                        </Table.Row>
                      )
                    )}
                  </Table.Body>
                </Table>
              </div>
            }
          </Segment>
        </section>
      </Page>
    );
  }
}

export default createFragmentContainer(withAuth(GroupView), graphql`
    fragment GroupView_viewer on Viewer {
      ...Page_viewer
      user {
        firstName
      }
      group(nameUrl: $nameUrl) {
        name
        nameUrl
        members {
          edges {
            node {
              id
              firstName
              lastName
              profileImage
              books {
                edges {
                  node {
                    id
                    rating
                    state
                    book {
                      title
                      author
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `);
