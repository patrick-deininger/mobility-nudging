import React from 'react';
import PropTypes from 'prop-types';
import { withAuth } from 'modules/auth/utils';

import styles from './Navigation.scss';

class Navigation extends React.Component {
  static defaultProps = {};
  static propTypes = {};

  render() {
    return (
      <div className={styles.root}>
        Navigation
      </div>
    );
  }
}

export default withAuth(Navigation);
