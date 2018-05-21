import React, { Image } from 'react';

import { Button } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './Template.scss';
import classNames from 'classnames';



class Template extends React.Component {

  render() {

    return (
      <div className={styles.container}>
        <img className={styles.image} src={this.props.imagesrc}/>
        <div className={styles.textContainer}>
          <h1 className={styles.heading}>{this.props.heading}</h1>
          <div className={styles.text}>
            {this.props.text}
          </div>
        </div>
      </div>
    );
  }
}

export default Template
