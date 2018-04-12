import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'found';
import { Button, Dropdown } from 'semantic-ui-react';
import { graphql, createFragmentContainer } from 'react-relay';
import { logoutViewer } from 'modules/auth/jwtUtils';
import { isAuthenticated } from 'modules/auth/utils';
import styles from './Header.scss';


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

  render() {
    const loggedIn = this.props.isAuthenticated;
    const user = this.props.viewer.user;


    return (
      <header className={styles.root}>
        <h1 className={styles.brand_name}>
          <Link to='/' className={styles.brand_name_link}>Mobility Nudging</Link>
        </h1>
        <nav className={styles.nav}>
          { loggedIn ? (
            <div className={styles.loggedInView}>
              <Button basic  onClick={() => { logoutViewer(); }} className={styles.item}>Log out</Button>
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
