import React from 'react';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth//utils';
import { Input, Button, Segment, Header } from 'semantic-ui-react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';

import styles from './AddSessionConfig.scss';

const CreateSessionConfigMutation = graphql`
  mutation AddSessionConfigMutation (
    $name: String!
    $description: String!
    $numberOfSessions: Int!
    $surveyLink: String!
  ) {
    createSessionConfig(name: $name, description: $description, numberOfSessions: $numberOfSessions, surveyLink: $surveyLink) {
      sessionConfig {
        id
      }
    }
  }
`;


class AddSessionConfig extends React.Component {
  state = {
    input: {
      name: "",
      description: "",
      number_of_sessions: "",
      survey_link: "",
    },
    errors: [],

  }

  setErrors = (errors) => {
    this.setState({ ...this.state, errors });
  }

  handleFieldChange = (e, { value }) => {
    const input = this.state.input;
    const inputName = e.target.id;
    input[inputName] = e.target.value;
    this.setState({ ...this.state, input });
  }


  onSubmitHandler = (ev) => {
    console.log("onSubmit")
    const SessionConfigVariables = {
      name: this.state.input.name,
      description: this.state.input.description,
      numberOfSessions: parseInt(this.state.input.number_of_sessions),
      surveyLink: this.state.input.survey_link,
    };


    commitMutation(this.props.relay.environment, {
          mutation: CreateSessionConfigMutation,
          variables: SessionConfigVariables,
          onCompleted: (resp) => {
            console.log("Created new SessionConfig")
            this.props.router.push('/cockpit');
          },
          onError: (err) => {
            console.error(err)
          },
        }
      );
  }




  render() {

    const { input, erros } = this.state;


    return (
      <Page viewer={this.props.viewer}>

        <div className={styles.container}>
          <Segment padded='very'>
            <Header as='h1'>Neue Session Konfiguration</Header>

          <div className={styles.form}>


          <Input
            id='name'
            className={styles.inputField}
            value={input.name}
            type='text'
            size='large'
            fluid
            required
            placeholder='Session Name'
            onChange={this.handleFieldChange}
          />

          <Input
            id='description'
            className={styles.inputField}
            value={input.description}
            type='text'
            size='large'
            fluid
            required
            placeholder='Beschreibung'
            onChange={this.handleFieldChange}
          />

          <Input
            id='number_of_sessions'
            className={styles.inputField}
            value={input.number_of_sessions}
            type='text'
            size='large'
            fluid
            required
            placeholder='Anzahl geplanter Sessions'
            onChange={this.handleFieldChange}
          />

          <Input
            id='survey_link'
            className={styles.inputField}
            value={input.survey_link}
            type='text'
            size='large'
            fluid
            required
            placeholder='Link zur LimeSurvey'
            onChange={this.handleFieldChange}
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
  withAuth(AddSessionConfig),
  graphql`
    fragment AddSessionConfig_viewer on Viewer {
      ...Page_viewer

    }
  `,
);
