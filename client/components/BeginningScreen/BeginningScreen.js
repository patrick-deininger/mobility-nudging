import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import Page from 'components/Page/Page';

import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './BeginningScreen.scss';
import classNames from 'classnames';


class BeginningScreen extends React.Component {

  // handleButtonClick = () => {
  //   this.props.router.push('/')
  // }

  render() {

    return (
      <Page title='Mobility Nudging' viewer={this.props.viewer}>
        <section className={styles.container}>
          <Segment padded='very'>
            <Button as={Link} to='/run' fluid color="green" className={styles.conformationButton} >
              Start
            </Button>
          </Segment>
      </section>
      </Page>
    );
  }
}

export default createFragmentContainer(
  withAuth(BeginningScreen),
  graphql`
    fragment BeginningScreen_viewer on Viewer {
      ...Page_viewer
    }
  `,
);
