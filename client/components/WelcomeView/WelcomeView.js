import React , {image} from 'react';
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
            <title>Companion</title>
          </Helmet>

          <header className={styles.header}>
            <h1 className={styles.brandName}>
              <Link to='/' className={styles.brandNameLink}>Companion</Link>
            </h1>
          </header>

          <main>
            <section className={styles.main_container}>

              <Segment className={styles.segment} padded='very'>
                <div className={styles.medication}>
                  <Header as='h1'>Novalgin</Header>
                    500 mg | intravenös
                </div>

                <div className={styles.patient}>
                  <Header as='h1'>Vetter, Vater</Header>
                    50 | male
                </div>
              </Segment>

              <div>
                <Button fluid color="green" as={Link} to='/signup' className={styles.conformationButton}>Start</Button>
              </div>
              
          </section>
          </main>
        </div>
      );
  }
}

export default WelcomeView;
