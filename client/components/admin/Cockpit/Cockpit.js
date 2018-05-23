import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './Cockpit.scss';
import ConfigList from 'components/admin/ConfigList/ConfigList'
import classNames from 'classnames';

class Cockpit extends React.Component {
  render() {
    return (
      <Page title='Mobility Nudging' viewer={this.props.viewer}>
        <section className={styles.container}>
          <Segment className={styles.segment} padded='very'>
            <div className={styles.head}>
              <Header floated='left' as='h1'>Konfigurationen</Header>
            </div>

            <div className={styles.reading}>
              <Header floated='left' as='h2'>Sessions</Header>
              <Button floated='right' basic color='green' as={Link} to='/add-session-config' className={styles.upperText} floated='right'>Neu</Button>
              <Button floated='right' basic as={Link} to='/add-session-block-config' className={styles.upperText} floated='right'>Blockzuordnung</Button>
              <ConfigList viewer={this.props.viewer} show="sessionConfig"/>
            </div>


            <div className={styles.read}>
              <Header floated='left' as='h2'>Blöcke</Header>
              <Button floated='right' basic color='green' as={Link} to='/add-block-config' className={styles.upperText} floated='right'>Neu</Button>
              <ConfigList viewer={this.props.viewer} show="blockConfig"/>

            </div>


            <div className={styles.to_read}>
              <Header floated='left' as='h2'>Statische Nudges</Header>
              <Button floated='right' basic color='green' as={Link} to='/add-nudge-static-config' className={styles.upperText} floated='right'>Neu</Button>
              <ConfigList viewer={this.props.viewer} show="nudgeStaticConfig"/>
            </div>

            <div className={styles.to_read}>
              <Header floated='left' as='h2'>Feedback</Header>
              <Button floated='right' basic color='green' as={Link} to='/add-feedback-config' className={styles.upperText} floated='right'>Neu</Button>
              <ConfigList viewer={this.props.viewer} show="feedbackConfig"/>
            </div>
          </Segment>
      </section>
      </Page>
    );
  }
}

export default createFragmentContainer(
  withAuth(Cockpit),
  graphql`
    fragment Cockpit_viewer on Viewer {
      ...Page_viewer
      ...ConfigList_viewer

    }
  `,
);
