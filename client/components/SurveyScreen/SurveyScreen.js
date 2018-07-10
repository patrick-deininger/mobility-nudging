import React from 'react';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth//utils';
import { Input, Button, Segment, Header } from 'semantic-ui-react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';

import styles from './SurveyScreen.scss';



class SurveyScreen extends React.Component {
  state = {
    sessionId: this.props.match.params.sessionId,
    blockId: this.props.match.params.blockId,
    userId: this.props.viewer.user.id,
    surveyLink: '',
    iframeLoadCount: 0,
  }

  componentWillMount = () => {
    this.identifySessionConfigId()
  }

  identifySessionConfigId = () => {
    const sessions = this.props.viewer.sessions
    const sessionId = this.state.sessionId
    var surveyLink = ''
    for (var i = 0; i < sessions.length; i++){
      if (sessions[i].id == this.state.sessionId){
        surveyLink = sessions[i].sessionConfig.surveyLink
        break;
      }
    }
    this.setState({surveyLink: surveyLink})
    console.log(surveyLink)
  }

  onSubmitHandler = (ev) => {

    var nextScreen = `/done/${this.state.sessionId}/${this.state.blockId}`
  //  this.props.router.push(nextScreen);
  }
  onLoadChange = (x) => {
    const iframeLoadCount = this.state.iframeLoadCount + 1
    this.setState({iframeLoadCount: iframeLoadCount})
    console.log(this.state.iframeLoadCount)

    // dirty hack
    if (iframeLoadCount == 2){
      var nextScreen = `/done/${this.state.sessionId}/${this.state.blockId}`
      this.props.router.push(nextScreen);
    }
  }

  render() {
    const lime_src = this.state.surveyLink+"&id="+this.state.sessionId+"|"+this.state.blockId

    console.log(lime_src)

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
            src={lime_src}
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
      user{
        id
      }
      sessions{
        id
        sessionConfig{
          surveyLink
        }
      }

    }
  `,
);
