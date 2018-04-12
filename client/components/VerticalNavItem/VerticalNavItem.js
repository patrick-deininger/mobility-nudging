import React from 'react';
import PropTypes from 'prop-types';

import styles from './VerticalNavItem.scss';

class VerticalNavItem extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    active: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node,
    color: PropTypes.string
  };

  static defaultProps = {
    active: false,
    className: '',
    onClick: () => { },
    color: 'grey'
  };

  static COLORS = {
    red: '#ef5350',
    pink: '#ec407a',
    purple: '#ab47bc',
    deepPurple: '#7e57c2',
    indigo: '#5c6bc0',
    blue: '#42a5f5',
    lightBlue: '#29b6f6',
    cyan: '#26c6da',
    teal: '#26a69a',
    green: '#66bb6a',
    lightGreen: '#9ccc65',
    lime: '#d4e157',
    yellow: '#ffee58',
    amber: '#ffca28',
    orange: '#ffa726',
    deepOrange: '#ff7043',
    brown: '#8d6e63',
    grey: '#bdbdbd',
    blueGrey: '#78909c',
  }

  state = { expanded: false, peaked: false };

  onHover = () => {
    if (this.props.active) {
      return;
    }
    this.setState({ ...this.state, peaked: true });
  }

  onHoverLeave = () => {
    this.setState({ ...this.state, peaked: false });
  }

  render() {
    const { children, name, active, className, onClick, color } = this.props;
    const { expanded, peaked } = this.state;
    const dotColor = VerticalNavItem.COLORS[color];

    return (
      <div className={[styles.root, className, active ? styles.active : ''].join(' ')} onClick={() => onClick(name)} onMouseOver={this.onHover} onMouseLeave={this.onHoverLeave}>
        <span className={styles.dotWrap}>
          <span className={[styles.dot, expanded ? styles.expanded : '', (peaked && !active) ? styles.peaked : ''].join(' ')} style={{ borderColor: dotColor }} />
        </span>
        <span className={styles.content}>
          { children }
        </span>
      </div>
    );
  }
}

export default VerticalNavItem;
