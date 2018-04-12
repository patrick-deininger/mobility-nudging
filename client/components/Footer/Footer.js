import React from 'react';

import styles from './Footer.scss';

class Footer extends React.Component {
  state = { hovered: false };

  onHover = () => {
    this.setState({ hovered: true });
  }

  onLeave = () => {
    this.setState({ hovered: false });
  }

  render() {
    const { hovered } = this.state;

    return (
      <div className={styles.root} onMouseEnter={this.onHover} onMouseLeave={this.onLeave}>
        <div className={styles.inner}>
          <span>
            Made with <span hidden={!hovered} className={styles.code}>{'{'}code{'}'}</span><span hidden={hovered} className={styles.love}>❤️</span> in Karlsruhe.
          </span>
        </div>
      </div>
    );
  }
}

export default Footer;
