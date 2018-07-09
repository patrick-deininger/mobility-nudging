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
            <title>Edision</title>
          </Helmet>
          <header className={styles.header}>
            <h1 className={styles.brandName}>
              <Link to='/' className={styles.brandNameLink}>Edision</Link>
            </h1>
            <nav className={styles.nav}>
              <div>
                <Button basic as={Link} to='/login' className={styles.item}>Log in</Button>
                <Button color='green' as={Link} to='/signup' className={styles.item}>Sign up</Button>
              </div>
            </nav>
          </header>
          <main>
            <section className={styles.main_container}>
              <Segment padded='very'>
                <p>Erläuterung:</p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

              </Segment>
          </section>
          </main>
        </div>
      );
  }
}

export default WelcomeView;
