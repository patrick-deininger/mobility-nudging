import React, { Image } from 'react';
import { graphql, createFragmentContainer } from 'react-relay';

import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form} from 'semantic-ui-react';
import { Link } from 'found';
import styles from './Neighbour.scss';
import classNames from 'classnames';



class Neighbour extends React.Component {

  render() {

    return (
      <section className={styles.container}>

        <img className={styles.image} src={"https://i.pinimg.com/originals/dd/0a/d2/dd0ad2f6c37ce1169386e27db982740b.png"}  width="100" height="100"/>

        <div className={styles.text}>
          <h1> Daniel Roth </h1>
          Daniel hat heute drei Stunden Flexibilität zur Verfügung gestellt.

          
        </div>

      </section>
    );
  }
}

export default Neighbour
