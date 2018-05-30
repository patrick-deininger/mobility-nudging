import React from 'react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';
import Page from 'components/Page/Page';
import createEventMutation from 'components/mutations/CreateEventMutation/CreateEventMutation';

import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './ContextScreen.scss';
import classNames from 'classnames';


const CreateBlockMutation = graphql`
    mutation ContextScreen_CreateBlock_Mutation(
      $user: ID!,
      $blockConfig: ID!,
      $session: ID!
    ) {
      createBlock(
        user: $user,
        blockConfig: $blockConfig,
        session: $session,
      ) {
        block {
          user{
            id
          }
          blockConfig{
            id
          }
        }
      }
    }
  `;

class ContextScreen extends React.Component {

  state = {
    sessionId: this.props.match.params.sessionId,
    blockConfigId: this.props.viewer.blockConfigs[parseInt(this.props.match.params.blockNumber)-1].id,
    blockNumber: parseInt(this.props.match.params.blockNumber),
    blockId: "",
    nextScreen: "",
    contextConfig: {
      heading: "",
      text: "",
      context_type: "",
    },
    errors: []
  }

  setErrors = (errors) => {
    this.setState({ ...this.state, errors });
  }


  componentWillMount(){
    this.initialize()
  }

  initialize = () => {

    const blockConfigs = this.identifyRelevantBlockConfigs()

    if (blockConfigs.length >= this.state.blockNumber){
      const blockConfig = blockConfigs[this.state.blockNumber-1]

      const contextConfig = this.state.contextConfig
      const heading = blockConfig.context.heading
      const text = blockConfig.context.text
      const context_type = blockConfig.context.contextType

      contextConfig['heading'] = heading
      contextConfig['text'] = text
      contextConfig['context_type'] = context_type

      this.setState({contextConfig: contextConfig})

      this.createBlock()
    }
    else {
      this.props.router.push(`/done/${this.state.sessionId}/null`)
    }
  }


  identifyRelevantBlockConfigs = () => {
      // Identify all blockConfigs that match to current session
      const sessions = this.props.viewer.sessions
      var sessionConfigId  = ""

      for (var i = 0; i < sessions.length; i++){
        if (sessions[i].id == this.state.sessionId){
          sessionConfigId = sessions[i].sessionConfig.id
        }
      }

      const sessionBlockConfigs = this.props.viewer.sessionBlockConfigs
      var blockConfigIds = []

      for (var i = 0; i < sessionBlockConfigs.length; i++){
        if (sessionBlockConfigs[i].sessionConfig.id == sessionConfigId){
          blockConfigIds.push(sessionBlockConfigs[i].blockConfig.id)
        }
      }

      var blockConfigs = []
      const allBlockConfigs = this.props.viewer.blockConfigs

      for (var i = 0; i < blockConfigIds.length; i++){
        for (var j = 0; j < allBlockConfigs.length; j++){
          if (allBlockConfigs[j].id == blockConfigIds[i]){
            blockConfigs.push(allBlockConfigs[j])
          }
        }
      }
      return(blockConfigs)
  }


  createBlock = () => {
     const blockVariables = {
       user: this.props.viewer.user.id,
       blockConfig: this.state.blockConfigId,
       session: this.state.sessionId
     }

     commitMutation(this.props.relay.environment, {
           mutation: CreateBlockMutation,
           variables: blockVariables,
           onCompleted: (resp) => {
             this.onCompletedCreateBlock()
           },
           onError: (err) => {
             console.error(err)
           },
         }
       );

  }



   onCompletedCreateBlock = () => {
     const refetchVariables = fragmentVariables => ({
       //TODO (currently hack)
       session: atob(this.state.sessionId).split(':')[1],
       blockConfig: atob(this.state.blockConfigId).split(':')[1],
     });
     this.props.relay.refetch(refetchVariables, null, this.onCompletedRefetch);

     console.log("Block created")

   }

   onCompletedRefetch = () => {
     const blockId = this.props.viewer.block.id
     this.setState({blockId: blockId});

     const eventVariables =  {
       event: "Block created - context started",
       userId: this.props.viewer.user.id,
       blockId: blockId,
       sessionId: this.state.sessionId,

       screen: "ContextScreen",
       providedFlexibilityTime: 0,
       targetChargingLevel: 0,
       targetMinimumChargingLevel: 0,
       chargingLevelRepresentation: "None",
     }

     this.createEvent(eventVariables)

   }


  handleButtonClick = () => {
    var nextScreen = `/run/${this.state.blockNumber}/${this.state.sessionId}/${this.state.blockId}`

    this.setState({ ...this.state, nextScreen });

    const eventVariables =  {
      event: "Context finished",
      userId: this.props.viewer.user.id,
      blockId: this.state.blockId,
      sessionId: this.state.sessionId,

      screen: "ContextScreen",
      providedFlexibilityTime: 0,
      targetChargingLevel: 0,
      targetMinimumChargingLevel: 0,
      chargingLevelRepresentation: "None",
    }
    this.createEvent(eventVariables)


    this.props.router.push(nextScreen)
  }


    createEvent = (eventVariables) => {
      createEventMutation(this.props.relay.environment, eventVariables, this.onCompletedCreateEvent, this.setErrors);
    }

    onCompletedCreateEvent = () => {
      console.log('created event')
    }


  render() {
    return (
      <Page title='Mobility Nudging' viewer={this.props.viewer}>
        <section className={styles.container}>
          <Segment padded='very'>
            <p>{this.state.contextConfig.heading}</p>
            {this.state.contextConfig.text}
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
  withAuth(ContextScreen),
  {
  viewer: graphql`
      fragment ContextScreen_viewer on Viewer
        @argumentDefinitions(
          session: {type: "ID"},
          blockConfig: {type: "ID"},
        ){
          ...Page_viewer
          block(session: $session, blockConfig: $blockConfig){
            id
          }
          user{
            id
          }
          sessionBlockConfigs{
            id
            sessionConfig{
              id
            }
            blockConfig{
              id
            }
          }
          sessions{
            id
            sessionConfig{
              id
            }
          }

          blockConfigs{
            id
            context{
              id
              name
              heading
              text
              contextType
            }
        }

      }

      `,
  },


    graphql`
      query ContextScreenRefetchQuery($session: ID!, $blockConfig: ID!){
        viewer {
          ...ContextScreen_viewer @arguments(session: $session, blockConfig: $blockConfig)

        }
      }
      `,

);
