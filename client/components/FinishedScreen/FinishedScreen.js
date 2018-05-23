import React from 'react';
import { graphql, createFragmentContainer, commitMutation } from 'react-relay';
import Page from 'components/Page/Page';

import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './FinishedScreen.scss';
import classNames from 'classnames';


const FinishSessionMutation = graphql`
  mutation FinishedScreenMutation (
    $sessionId: ID!
  ) {
    finishSession(sessionId: $sessionId) {
      session {
        id
      }
    }
  }
`;


class FinishedScreen extends React.Component {
  state = {
    sessionId: this.props.match.params.sessionId
  }

  onButtonClick = () => {

    const FinishSessionVariables = {
      sessionId: this.state.sessionId,
    };

    commitMutation(this.props.relay.environment, {
          mutation: FinishSessionMutation,
          variables: FinishSessionVariables,
          onCompleted: (resp) => {
            console.log("Finished Session")
            this.props.router.push('/');
          },
          onError: (err) => {
            console.error(err)
          },
        }
      );

  }


  render() {
    return (
      <Page title='Mobility Nudging' viewer={this.props.viewer}>
        <section className={styles.container}>
          <Segment padded='very'>
            Done
            <Button onClick={this.onButtonClick} fluid color="green" className={styles.conformationButton} >
              Experiment abschließen
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
      sessions{
        id
      }
    }
  `,
);
