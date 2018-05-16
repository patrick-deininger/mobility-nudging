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
            <p>Erläuterung:</p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <p></p>
            <Button as={Link} to='/run/1' fluid color="green" className={styles.conformationButton} >
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
      user{
        id
      }
      blockConfigs {
          id
          nudge
          chargeStatus
          nudge
          clocktime
      }
    }
  `,
);
