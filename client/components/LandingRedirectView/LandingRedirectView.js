import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import HomeView from 'components/HomeView/HomeView';
import BeginningScreen from 'components/BeginningScreen/BeginningScreen';
import WelcomeView from 'components/WelcomeView/WelcomeView';
import { isAuthenticated } from 'modules/auth/utils';

class LandingRedirectView extends React.Component {
  render() {
    const loggedIn = this.props.isAuthenticated;

    if (loggedIn) {
      return <BeginningScreen viewer={this.props.viewer} />;
    }

    return <WelcomeView />;
  }
}

export default createFragmentContainer(
  isAuthenticated(LandingRedirectView),
  graphql`
    fragment LandingRedirectView_viewer on Viewer {
    ...BeginningScreen_viewer
    }
  `,
);
