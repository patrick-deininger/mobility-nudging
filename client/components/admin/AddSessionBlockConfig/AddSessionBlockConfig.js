import React from 'react';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth//utils';
import { Input, Button, Segment, Header, Dropdown } from 'semantic-ui-react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';

import styles from './AddSessionBlockConfig.scss';

// const CreateSessionConfigMutation = graphql`
//   mutation AddSessionConfigMutation (
//     $name: String!
//     $numberOfSessions: Int!
//   ) {
//     createSessionConfig(name: $name, numberOfSessions: $numberOfSessions) {
//       sessionConfig {
//         id
//       }
//     }
//   }
// `;


class AddSessionBlockConfig extends React.Component {
  state = {
    input: {
      SessionConfigName: "",
      BlockConfigName: "",
    },
    sessionConfigOptions: [],
    blockConfigOptions: [],
    errors: [],

  }

  componentWillMount(){
    this.populateSessionConfigOptions()
    //this.populateBlockConfigOptions()

  }

  populateSessionConfigOptions = () => {
    const sessionConfigOptions = this.props.viewer.sessionConfigs.map((x) => (
    {
      key: x.id,
      value: x.id,
      text: x.name,
    }));
    this.setState({ ...this.state, sessionConfigOptions });
  }

  populateBlockConfigOptions = () => {
    const blockConfigOptions = this.props.viewer.blockConfigs.map((x) => (
    {
      key: x.id,
      value: x.id,
      text: x.nudge.name,
    }));
    this.setState({ ...this.state, blockConfigOptions });
  }

  setErrors = (errors) => {
    this.setState({ ...this.state, errors });
  }


  onSubmitHandler = (ev) => {
    console.log("onSubmit")
    // const SessionConfigVariables = {
    //   name: this.state.input.name,
    //   numberOfSessions: parseInt(this.state.input.number_of_sessions),
    // };


    // commitMutation(this.props.relay.environment, {
    //       mutation: CreateSessionConfigMutation,
    //       variables: SessionConfigVariables,
    //       onCompleted: (resp) => {
    //         console.log("Created new SessionBlockConfig")
    //         this.props.router.push('/cockpit');
    //       },
    //       onError: (err) => {
    //         console.error(err)
    //       },
    //     }
      // );
  }




  render() {

    const { input, erros } = this.state;


    return (
      <Page viewer={this.props.viewer}>

        <div className={styles.container}>
          <Segment padded='very'>
            <Header as='h1'>Neue Session Block Konfiguration</Header>

          <div className={styles.form}>

          <Dropdown
             id="sessionConfigs"
             className={styles.nameField}
             options={this.state.sessionConfigOptions}
             search
             selection
             fluid
             placeholder='Session Config'
             onChange={this.handleDropdownChange}
           />

           <Dropdown
              id="blockConfigs"
              className={styles.nameField}
              options={this.state.blockConfigOptions}
              search
              selection
              fluid
              placeholder='Block Config'
              onChange={this.handleDropdownChange}
            />


           <Button
             color='green'
              fluid
              type='submit'
              size='huge'
              onClick={this.onSubmitHandler}
            >
              Hinzufügen
            </Button>

          </div>
        </Segment>
            </div>
          </Page>
        )

      }
}

export default createRefetchContainer(
  withAuth(AddSessionBlockConfig),
  graphql`
    fragment AddSessionBlockConfig_viewer on Viewer {
      ...Page_viewer
      sessionConfigs{
        id
        name
      }
      blockConfigs{
        id
        nudge{
          name
        }
      }

    }
  `,
);
