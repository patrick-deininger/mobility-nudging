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
          <Link to='/' className={styles.brand_name_link}>Edision</Link>
        </h1>

      </header>
    );
  }
}

export default createFragmentContainer(
  isAuthenticated(Header),
  graphql`
    fragment Header_viewer on Viewer {
      id
    }
  `,
);
