import React from 'react';
import { graphql, createRefetchContainer } from 'react-relay';
import Page from 'components/Page/Page';

import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './BeginningScreen.scss';
import createSessionMutation from '../../modules/core/mutations/CreateSession';
import classNames from 'classnames';


class BeginningScreen extends React.Component {

  state = {
    sessionConfigId: "",
    nextScreen: "",
    errors: []
  }

  componentWillMount(){
    const sessionConfigId = this.props.viewer.sessionConfigs[0].id
    this.setState({ ...this.state, sessionConfigId });
  }

  setErrors = (errors) => {
    this.setState({ ...this.state, errors });
  }

  handleButtonClick = () => {
    const sessionVariables = {
      user: this.props.viewer.user.id,
      sessionConfig: this.state.sessionConfigId
    };
    createSessionMutation(this.props.relay.environment, sessionVariables, this.onCompletedCreateSession, this.setErrors)
  }

  onCompletedCreateSession = (error, data) => {

    const refetchVariables = fragmentVariables => ({
      //TODO
      sessionConfig: 1,
      user: 1,
    });
    this.props.relay.refetch(refetchVariables, null, this.onCompletedRefetch);

    console.log("Session created")

  }

  onCompletedRefetch = () => {
    const nextScreen = `/run/1/${this.props.viewer.session.id}`
    this.setState({ ...this.state, nextScreen });
    this.props.router.push(nextScreen)


  }

  render() {
    return (
      <Page title='Mobility Nudging' viewer={this.props.viewer}>
        <section className={styles.container}>
          <Segment padded='very'>
            <p>Erläuterung:</p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <p></p>
            <Button onClick={this.handleButtonClick} fluid color="green" className={styles.conformationButton} >
              Start
            </Button>
          </Segment>
      </section>
      </Page>
    );
  }
}

export default createRefetchContainer(
  withAuth(BeginningScreen),
  {
  viewer: graphql`
      fragment BeginningScreen_viewer on Viewer
      @argumentDefinitions(
        sessionConfig: {type: "ID"},
        user: {type: "ID"},
      ){
        ...Page_viewer
        session(sessionConfig: $sessionConfig, user: $user){
          id
        }
        user{
          id
        }
        sessionConfigs{
          id
          name
        }
      }

      `,
  },


  graphql`
    query BeginningScreenRefetchQuery($sessionConfig: ID!, $user: ID!){
      viewer {
        ...BeginningScreen_viewer @arguments(sessionConfig: $sessionConfig, user: $user)

      }
    }
    `,
);
