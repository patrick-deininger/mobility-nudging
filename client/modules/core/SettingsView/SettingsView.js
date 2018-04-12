import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth/utils';
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import VerticalNav from '../../../components/VerticalNav/VerticalNav';
import ProfileSettingsTab from '../../../components/ProfileSettingsTab/ProfileSettingsTab';
import ProfileInvitesTab from '../../../components/ProfileInvitesTab/ProfileInvitesTab';

import styles from './SettingsView.scss';

class SettingsView extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
  }

  state = { activeItem: 'profile' }

  onItemSelect = (name) => {
    this.setState({ activeItem: name });
  }

  render() {
    const { activeItem } = this.state;

    return (
      <Page title='Gutenberg' viewer={this.props.viewer}>
        <div className={styles.container}>
          <Segment className={styles.segment}>
            <VerticalNav className={styles.nav}>
              <VerticalNav.Item name='profile' color='red' active={activeItem === 'profile'} onClick={this.onItemSelect}>
                Profile
              </VerticalNav.Item>
              <VerticalNav.Item name='invites' color='green' active={activeItem === 'invites'} onClick={this.onItemSelect}>
                Invites
              </VerticalNav.Item>
            </VerticalNav>
            <div className={styles.content}>
              <ProfileSettingsTab visible={activeItem === 'profile'} viewer={this.props.viewer} />
              <ProfileInvitesTab visible={activeItem === 'invites'} viewer={this.props.viewer} />
            </div>
          </Segment>
        </div>
      </Page>
    );
  }
}

export default createFragmentContainer(withAuth(SettingsView), graphql`
  fragment SettingsView_viewer on Viewer {
    ...Page_viewer
    ...ProfileSettingsTab_viewer
    ...ProfileInvitesTab_viewer
  }
`);
