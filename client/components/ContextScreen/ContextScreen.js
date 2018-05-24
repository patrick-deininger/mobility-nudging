import React from 'react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';
import Page from 'components/Page/Page';

import { withAuth } from 'modules/auth/utils';
import { Button, Segment, Header, Label, Statistic, Form, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'found';
import styles from './ContextScreen.scss';
import classNames from 'classnames';

import createBlockMutation from '../../modules/core/mutations/CreateBlock';


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
    blockId: this.props.match.params.blockId,
    nextScreen: "",
    contextConfig: {
      heading: "",
      text: "",
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

    const blockConfigs = this.props.viewer.blockConfigs

    if (blockConfigs.length >= this.state.blockNumber){
      const blockConfig = blockConfigs[this.state.blockNumber-1]

      const contextConfig = this.state.contextConfig
      const heading = blockConfig.context.heading
      const text = blockConfig.context.text

      contextConfig['heading'] = heading
      contextConfig['text'] = text

      this.setState({contextConfig: contextConfig})

      this.createBlock()
    }
    else {
      this.props.router.push(`/done/${this.state.sessionId}`)
    }
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
    // createBlockMutation(this.props.relay.environment, blockVariables, this.onCompletedCreateBlock, this.setErrors)
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

   }


  handleButtonClick = () => {
    var nextScreen = `/run/${this.state.blockNumber}/${this.state.sessionId}/${this.state.blockId}`

    this.setState({ ...this.state, nextScreen });
    this.props.router.push(nextScreen)
  }


  render() {
    return (
      <Page title='Mobility Nudging' viewer={this.props.viewer}>
        <section className={styles.container}>
          <Segment padded='very'>
            <p>Context:</p>
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

          blockConfigs{
            id
            context{
              id
              name
              heading
              text
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
