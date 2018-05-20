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
              <Header floated='left' as='h2'>Session Konfiguration</Header>
              <Button floated='right' basic color='green' as={Link} to='/add-session-config' className={styles.upperText} floated='right'>Neu</Button>
              <ConfigList viewer={this.props.viewer} show="sessionConfig"/>
            </div>


            <div className={styles.read}>
              <Header floated='left' as='h2'>Block Configuration</Header>
              <Button floated='right' basic color='green' as={Link} to='/add-block-config' className={styles.upperText} floated='right'>Neu</Button>
              <ConfigList viewer={this.props.viewer} show="blockConfig"/>

            </div>


            <div className={styles.to_read}>
              <Header floated='left' as='h2'>Nudge Configuration</Header>
              <Button floated='right' basic color='green' as={Link} to='/add-nudge-config' className={styles.upperText} floated='right'>Neu</Button>
              <ConfigList viewer={this.props.viewer} show="nudgeConfig"/>
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
