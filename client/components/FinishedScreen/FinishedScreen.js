import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import Page from 'components/Page/Page';

import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './FinishedScreen.scss';
import classNames from 'classnames';


class FinishedScreen extends React.Component {

  render() {

    return (
      <Page title='Mobility Nudging' viewer={this.props.viewer}>
        <section className={styles.container}>
          <Segment padded='very'>
            Done
            <Button as={Link} to='/' fluid color="green" className={styles.conformationButton} >
              Zurück
            </Button>
          </Segment>
      </section>
      </Page>
    );
  }
}

export default createFragmentContainer(
  withAuth(FinishedScreen),
  graphql`
    fragment FinishedScreen_viewer on Viewer {
      ...Page_viewer
    }
  `,
);
