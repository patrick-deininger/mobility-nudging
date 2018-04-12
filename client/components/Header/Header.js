import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'found';
import { Button, Dropdown } from 'semantic-ui-react';
import { graphql, createFragmentContainer } from 'react-relay';
import { logoutViewer } from 'modules/auth/jwtUtils';
import { isAuthenticated } from 'modules/auth/utils';
import styles from './Header.scss';

import UserAvatar from '../UserAvatar/UserAvatar.js';

class Header extends React.Component {
  static defaultProps = {
    visible: true
  };

  static propTypes = {
    viewer: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    activeGroup: PropTypes.string,
  }

  logOut() {
    logoutViewer();
  }

  urlFromGroup(group) {
    return `/group/${group.nameUrl}`;
  }

  render() {
    const loggedIn = this.props.isAuthenticated;
    const memberships = this.props.viewer.user.groups.edges;
    const user = this.props.viewer.user;
    const bookshelfText = 'My books';
    const dropdownText = this.props.activeGroup ? this.props.activeGroup : bookshelfText;

    return (
      <header className={styles.root}>
        <h1 className={styles.brand_name}>
          <Link to='/' className={styles.brand_name_link}>Gutenberg</Link>
        </h1>
        <nav className={styles.nav}>
          { loggedIn ? (
            <div className={styles.loggedInView}>
              <Dropdown scrolling floating pointing='top right' className={[styles.menuDropdown, 'basic'].join(' ')} text={dropdownText} button>
                <Dropdown.Menu id={styles.dropdownMenu}>
                  <Dropdown.Item as={Link} to='/'>{ bookshelfText }</Dropdown.Item>
                  <Dropdown.Header content='Groups' />
                  <Dropdown.Divider />
                  { memberships.map(m =>
                    <Dropdown.Item as={Link} to={this.urlFromGroup(m.node.group)} key={m.node.group.id}>
                      { m.node.group.name }
                    </Dropdown.Item>
                    )}
                  <Dropdown.Item className={styles.createGroupLink}>
                    <Button basic as={Link} to='/create' fluid color='green'>
                      CREATE GROUP
                    </Button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown
                scrolling
                floating
                pointing='top right'
                icon={null}
                trigger={
                  <UserAvatar user={user} size={50} className={styles.profileImage} />
                  }
              >
                <Dropdown.Menu id={styles.dropdownMenu}>
                  <Dropdown.Item id={styles.nameItem}>{ `${user.firstName} ${user.lastName}` }</Dropdown.Item>
                  <Dropdown.Item as={Link} to='/settings'>Settings</Dropdown.Item>
                  <Dropdown.Item onClick={() => { logoutViewer(); }}>Log out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <div className={styles.loggedOutView}>
              <Button basic as={Link} to='/login' className={styles.item}>Log in</Button>
              <Button color='green' as={Link} to='/signup' className={styles.item}>Sign up</Button>
            </div>
          )}
        </nav>
      </header>
    );
  }
}

export default createFragmentContainer(
  isAuthenticated(Header),
  graphql`
    fragment Header_viewer on Viewer {
      id
      user {
        firstName
        lastName
        email
        profileImage
        groups {
          edges {
            node {
              group {
                id
                name
                nameUrl
              }
            }
          }
        }
      }
    }
  `,
);
