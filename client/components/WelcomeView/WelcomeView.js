import React from 'react';
import BodyClassName from 'react-body-classname';
import { Button, Grid, Segment, Rating, Header } from 'semantic-ui-react';
import { Link } from 'found';
import { Helmet } from 'react-helmet';

import styles from './WelcomeView.scss';


class WelcomeView extends React.Component {


  render() {
    return (
        <div className={styles.container} onScroll={this.onScroll}>
          <Helmet>
            <title>Mobility Nudging</title>
          </Helmet>
          <header className={styles.header}>
            <h1 className={styles.brandName}>
              <Link to='/' className={styles.brandNameLink}>Mobility Nudging</Link>
            </h1>
            <nav className={styles.nav}>
              <div>
                <Button basic as={Link} to='/login' className={styles.item}>Log in</Button>
                <Button color='green' as={Link} to='/signup' className={styles.item}>Sign up</Button>
              </div>
            </nav>
          </header>
          <main>
            Here we go
          </main>
        </div>
      );
  }
}

export default WelcomeView;
