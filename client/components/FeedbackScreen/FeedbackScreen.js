import React from 'react';
import { graphql, createRefetchContainer } from 'react-relay';
import Page from 'components/Page/Page';

import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './FeedbackScreen.scss';
import classNames from 'classnames';


class FeedbackScreen extends React.Component {

  state = {
    sessionId: this.props.match.params.sessionId,
    blockNumber: parseInt(this.props.match.params.blockNumber),
    nextScreen: "",
    errors: []
  }

  setErrors = (errors) => {
    this.setState({ ...this.state, errors });
  }


  handleButtonClick = () => {
    var nextScreen = ""
    if (this.state.blockNumber+1 > this.props.viewer.blockConfigs.length){
        nextScreen = `/done/${this.state.sessionId}`
    }
    else {
        const blockNumber = this.state.blockNumber + 1
        nextScreen = `/run/${blockNumber}/${this.state.sessionId}`
    }
    this.setState({ ...this.state, nextScreen });
    this.props.router.push(nextScreen)
  }


  render() {
    return (
      <Page title='Mobility Nudging' viewer={this.props.viewer}>
        <section className={styles.container}>
          <Segment padded='very'>
            <p>Feedback:</p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            <p></p>
            <Button onClick={this.handleButtonClick} fluid color="green" className={styles.Button} >
              Weiter
            </Button>
          </Segment>
      </section>
      </Page>
    );
  }
}

export default createRefetchContainer(
  withAuth(FeedbackScreen),
  {
  viewer: graphql`
      fragment FeedbackScreen_viewer on Viewer{
        ...Page_viewer
        blockConfigs{
          id
        }
      }

      `,
  },

);
