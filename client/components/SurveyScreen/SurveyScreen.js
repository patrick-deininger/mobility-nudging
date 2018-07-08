import React from 'react';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth//utils';
import { Input, Button, Segment, Header } from 'semantic-ui-react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';

import styles from './SurveyScreen.scss';



class SurveyScreen extends React.Component {
  state = {
    sessionId: this.props.match.params.sessionId,
    blockID: this.props.match.params.blockId,
  }

  onSubmitHandler = (ev) => {

    var nextScreen = `/done/${this.state.sessionId}/${this.state.blockId}`
  //  this.props.router.push(nextScreen);
  }
  onLoadChange = (x) => {
    console.log("location")
    console.log(x.target)
    if (x.target.src == "http://localhost:8000/cockpit") {
      var nextScreen = `/done/${this.state.sessionId}/${this.state.blockId}`
      this.props.router.push(nextScreen);
    }

  }



  render() {



    return (
      <Page viewer={this.props.viewer}>

        <div className={styles.container}>
          <Segment padded='very'>
            <Header as='h1'>Umfrage</Header>

          <div className={styles.form}>


          <iframe
            className={styles.limesurvey}
            id="iframe_id"
            title="My Survey"
            src="https://experiment123.limequery.com/464639?lang=en&id=test"
            onLoad={this.onLoadChange}
          />

           <Button
             color='green'
              fluid
              type='submit'
              size='huge'
              onClick={this.onSubmitHandler}
            >
              Bestätigen
            </Button>



          </div>

        </Segment>
      </div>
    </Page>
        )

      }
}

export default createRefetchContainer(
  withAuth(SurveyScreen),
  graphql`
    fragment SurveyScreen_viewer on Viewer {
      ...Page_viewer

    }
  `,
);
