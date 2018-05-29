import React from 'react';
import Page from 'components/Page/Page';
import { withAuth } from 'modules/auth//utils';
import { Input, Button, Segment, Header } from 'semantic-ui-react';
import { graphql, createRefetchContainer, commitMutation } from 'react-relay';
import Template from 'components/Nudges/Template/Template'

import styles from './AddFeedbackConfig.scss';

const CreateFeedbackConfigMutation = graphql`
  mutation AddFeedbackConfigMutation (
    $name: String!
    $description: String!
    $heading: String!
    $text: String!
    $feedbackType: String!
  ) {
    createFeedbackConfig(
      name: $name,
      description: $description,
      heading: $heading,
      text: $text,
      feedbackType: $feedbackType,
    ) {
      feedbackConfig {
        id
      }
    }
  }
`;


class AddFeedbackConfig extends React.Component {
  state = {
    input: {
      name: "",
      description: "",
      heading: "",
      text: "",
      feedback_type: "",
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

    const FeedbackConfigVariables = {
      name: this.state.input.name,
      description: this.state.input.description,
      heading: this.state.input.heading,
      text: this.state.input.text,
      feedbackType: this.state.input.feedback_type
    };

    commitMutation(this.props.relay.environment, {
          mutation: CreateFeedbackConfigMutation,
          variables: FeedbackConfigVariables,
          onCompleted: (resp) => {
            console.log("Created new FeedbackConfig")
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
            <Header as='h1'>Neue Feedback Konfiguration</Header>

          <div className={styles.form}>


          <Input
            id='name'
            className={styles.inputField}
            value={input.name}
            type='text'
            size='large'
            fluid
            required
            placeholder='Name'
            onChange={this.handleFieldChange}
          />

          <Input
            id='feedback_type'
            className={styles.inputField}
            value={input.feedback_type}
            type='text'
            size='large'
            fluid
            required
            placeholder='Feedback Template'
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
            id='heading'
            className={styles.inputField}
            value={input.heading}
            type='text'
            size='large'
            fluid
            required
            placeholder='Überschrift'
            onChange={this.handleFieldChange}
          />

          <Input
            id='text'
            className={styles.inputField}
            value={input.text}
            type='text'
            size='large'
            fluid
            required
            placeholder='Text'
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

          <div className={styles.template}>
            <Template
              heading={this.state.input.heading}
              text={this.state.input.text}
              imagesrc={this.state.input.image}/>
          </div>

        </Segment>
      </div>
    </Page>
        )

      }
}

export default createRefetchContainer(
  withAuth(AddFeedbackConfig),
  graphql`
    fragment AddFeedbackConfig_viewer on Viewer {
      ...Page_viewer

    }
  `,
);
