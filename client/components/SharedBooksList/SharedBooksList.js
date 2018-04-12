import React from 'react';
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay';
import Page from 'components/Page/Page';
import { authenticatedRoute } from 'modules/auth/utils'
import { Table, Dimmer, Loader, Rating, Segment, Button } from 'semantic-ui-react';
import styles from './SharedBooksList.scss';
import { environment } from '../../utils/relay'
import Link from 'found'

class SharedBookList extends React.Component {
  render() {
    const bookshelf_entries = this.props.viewer.bookshelfEntries;
    return (
      <div className={styles.root}>
        { bookshelf_entries.length ? (
          <Table singleLine className={styles.books}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Author</Table.HeaderCell>
                <Table.HeaderCell>User</Table.HeaderCell>
                <Table.HeaderCell>Rating</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {bookshelf_entries.map((e) =>
                <Table.Row key={e.id}>
                  <Table.Cell>{e.book.title}</Table.Cell>
                  <Table.Cell>{e.book.author}</Table.Cell>
                  <Table.Cell>{e.user.firstName}</Table.Cell>
                  <Table.Cell><Rating disabled rating={e.rating} maxRating={5} /></Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        ) : (
          <Segment padded='very' className={styles.booksMissing}>
            <div className={styles.emoji}></div>
            <div className={styles.warning}>
              <h1>Your group has no books yet.</h1>
              <p><Button basic color='green' as={Link} to='/'>Invite friends</Button> to share the goodness.</p>
            </div>
          </Segment>
        )}
      </div>
    )
  }
}

export default createFragmentContainer(SharedBookList, graphql`
  fragment SharedBooksList_viewer on Viewer {
    bookshelfEntries {
      id
      book {
        title
        author
      }
      user {
        firstName
      }
      rating
      state
    }
  }
`)
