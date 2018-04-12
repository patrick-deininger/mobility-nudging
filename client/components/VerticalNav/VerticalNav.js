import React from 'react';
import PropTypes from 'prop-types';

import styles from './VerticalNav.scss';

import VerticalNavItem from '../VerticalNavItem/VerticalNavItem';

class VerticalNav extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  static Item = VerticalNavItem;

  render() {
    const { className } = this.props;

    return (
      <div className={[styles.root, className].join(' ')}>
        { this.props.children }
      </div>
    );
  }
}

export default VerticalNav;
